"""Version-bound lexical/semantic retrieval. No generated answers."""
import sqlite3,re,math,difflib,os,json,hashlib,urllib.request,threading
from pathlib import Path
STOP=set('a an the is are can could how what when does do to of in and or be being by for with on it ai'.split())
def tokens(s):
 s=s.casefold(); words=re.findall(r'[a-z0-9_-]+',s);han=''.join(re.findall(r'[\u4e00-\u9fff]',s))
 return [w for w in words if w not in STOP]+([han[i:i+2] for i in range(len(han)-1)] if han else [])
class SearchEngine:
 def __init__(self,corpus,cache=None):
  self.version=corpus['candidateId'];self.docs=corpus['documents'];self.lock=threading.Lock();self.api_key=os.getenv('OPENAI_API_KEY');self.model=os.getenv('NUWA_EMBED_MODEL','text-embedding-3-large');self.cache=Path(cache) if cache else None
  self.db=sqlite3.connect(':memory:',check_same_thread=False);self.db.execute('CREATE VIRTUAL TABLE chunks USING fts5(title, body)')
  self.vocab=set()
  for d in self.docs:
   ts=tokens(d['title']+' '+d['text']);self.vocab.update(ts);self.db.execute('INSERT INTO chunks VALUES (?,?)',(' '.join(tokens(d['title'])),' '.join(ts)))
  self.vectors={};self.vector_manifest=None;self.query_cache={}
  if self.cache and self.cache.exists():
   data=json.loads(self.cache.read_text())
   if data.get('candidateId')==self.version and data.get('model')==self.model:
    self.vectors=data.get('vectors',{});self.vector_manifest=data
 def embedding(self,values):
  if not self.api_key:raise RuntimeError('Embedding API credentials unavailable')
  payload=json.dumps({'model':self.model,'input':values,'dimensions':1024}).encode()
  req=urllib.request.Request('https://api.openai.com/v1/embeddings',data=payload,headers={'Authorization':'Bearer '+self.api_key,'Content-Type':'application/json'})
  with urllib.request.urlopen(req,timeout=15) as r: data=json.load(r)
  return [d['embedding'] for d in sorted(data['data'],key=lambda d:d['index'])]
 def prepare_vectors(self):
  if not self.cache:raise ValueError('Cache path required')
  pending=[d for d in self.docs if d['id'] not in self.vectors]
  for start in range(0,len(pending),24):
   batch=pending[start:start+24];vectors=self.embedding([d['title']+'\n'+d['text'][:6000] for d in batch]);self.vectors.update({d['id']:v for d,v in zip(batch,vectors)})
  self.cache.parent.mkdir(parents=True,exist_ok=True)
  self.cache.write_text(json.dumps({'candidateId':self.version,'model':self.model,'dimensions':1024,'vectors':self.vectors}))
 def search(self,request):
  query=request.get('query','').strip()
  if len(query)>1000:raise ValueError('Query too long')
  if request.get('snapshotId') and request['snapshotId']!=self.version:raise ValueError('Search version mismatch')
  filters=request.get('filters',{});terms=tokens(query);expanded=[]
  for t in terms:
   expanded.append(t)
   if t not in self.vocab and len(t)>3:expanded.extend(difflib.get_close_matches(t,self.vocab,n=1,cutoff=.72))
  scores={};mode='lexical';notice=None
  eligible=[i for i,d in enumerate(self.docs) if (not filters.get('type') or d['type']==filters['type']) and (not filters.get('area') or filters['area'] in d.get('areas',[])) and (not filters.get('primaryFunction') or filters['primaryFunction']==d.get('primaryFunction'))]
  eligible_set=set(eligible)
  if expanded and eligible:
   expression=' OR '.join('"'+t.replace('"','')+'"' for t in expanded)
   with self.lock: rows=list(self.db.execute('SELECT rowid,bm25(chunks,8,1) AS rank FROM chunks WHERE chunks MATCH ? AND rowid IN ('+','.join('?' for _ in eligible)+') ORDER BY rank LIMIT 100',[expression]+[i+1 for i in eligible]))
   for rank,(rowid,_)in enumerate(rows):scores[rowid-1]=1/(60+rank)
  if self.api_key and len(self.vectors)==len(self.docs) and self.docs:
   try:
    v=self.query_cache.get(query)
    if v is None:
     v=self.embedding([query])[0]
     if len(self.query_cache)>=256:self.query_cache.pop(next(iter(self.query_cache)))
     self.query_cache[query]=v
    norm=math.sqrt(sum(x*x for x in v))or 1
    ranked=[]
    for i,d in enumerate(self.docs):
     if i not in eligible_set:continue
     u=self.vectors[d['id']];cos=sum(a*b for a,b in zip(u,v))/((math.sqrt(sum(x*x for x in u))or 1)*norm)
     if cos>.2:ranked.append((cos,i))
    for rank,(_,i)in enumerate(sorted(ranked,reverse=True)[:100]):scores[i]=scores.get(i,0)+1/(60+rank)
    mode='hybrid'
   except Exception:notice='Semantic retrieval unavailable; showing lexical results.'
  else:notice='Lexical retrieval; semantic vectors or API credentials are not configured.'
  best={};facets={}
  for i,score in sorted(scores.items(),key=lambda x:-x[1]):
   d=self.docs[i]
   if filters.get('type') and d['type']!=filters['type']:continue
   if filters.get('area') and filters['area'] not in d.get('areas',[]):continue
   if request.get('locale')==d.get('locale'):score+=.00001
   key=(d['type'],d['objectId'])
   if key not in best or score>best[key]['score']:best[key]={**d,'score':score,'snippet':d['text'][:350]}
  ordered=sorted(best.values(),key=lambda d:-d['score'])
  for d in ordered:facets[d['type']]=facets.get(d['type'],0)+1
  try:offset=max(0,int(request.get('cursor')or 0))
  except (TypeError,ValueError):raise ValueError('Invalid cursor')
  return {'snapshotId':self.version,'mode':mode,'notice':notice,'hits':ordered[offset:offset+20],'facets':facets,'nextCursor':str(offset+20)if len(ordered)>offset+20 else None}
