"""Version-bound lexical/semantic retrieval. No generated answers."""
import sqlite3,re,math,difflib,os,json,hashlib,urllib.request,threading
from pathlib import Path
STOP=set('a an the is are can could how what when does do to of in and or be being by for with on it ai'.split())
def tokens(s):
 s=s.casefold(); words=re.findall(r'[a-z0-9_-]+',s);han=''.join(re.findall(r'[\u4e00-\u9fff]',s))
 return [w for w in words if w not in STOP]+([han[i:i+2] for i in range(len(han)-1)] if han else [])
def matching_snippet(text,query):
 terms=tokens(query);lower=text.casefold();positions=[lower.find(t) for t in terms if lower.find(t)>=0]
 start=max(0,(min(positions) if positions else 0)-100)
 return ('…' if start else '')+text[start:start+350]+('…' if len(text)>start+350 else '')
class SearchEngine:
 def __init__(self,corpus,cache=None):
  self.version=corpus['candidateId'];self.docs=corpus['documents'];self.lock=threading.Lock();self.api_key=os.getenv('OPENAI_API_KEY');self.model=os.getenv('NUWA_EMBED_MODEL','text-embedding-3-large');self.cache=Path(cache) if cache else None
  self.dimensions=int(os.getenv('NUWA_EMBED_DIMENSIONS','1024'))
  if self.dimensions<1:raise ValueError('Embedding dimensions must be positive')
  self.document_keys={d['id']:hashlib.sha256(json.dumps([self.model,self.dimensions,d['title']+'\n'+d['text'][:6000]],ensure_ascii=False).encode()).hexdigest()for d in self.docs}
  self.db=sqlite3.connect(':memory:',check_same_thread=False);self.db.execute('CREATE VIRTUAL TABLE chunks USING fts5(title, body)')
  self.vocab=set()
  for d in self.docs:
   ts=tokens(d['title']+' '+d['text']);self.vocab.update(ts);self.db.execute('INSERT INTO chunks VALUES (?,?)',(' '.join(tokens(d['title'])),' '.join(ts)))
  self.vectors={};self.vector_entries={};self.vector_manifest=None;self.query_cache={}
  if self.cache and self.cache.exists():
   data=json.loads(self.cache.read_text())
   if data.get('schemaVersion')=='nuwa-vectors-2' and data.get('model')==self.model and data.get('dimensions')==self.dimensions:
    self.vector_entries={k:v for k,v in data.get('entries',{}).items()if self.valid_vector(v)}
    self.vectors={docid:self.vector_entries[key]for docid,key in self.document_keys.items()if key in self.vector_entries}
    if data.get('candidateId')==self.version and data.get('documents')==self.document_keys:self.vector_manifest=data
 @property
 def semantic_ready(self):
  return self.vector_manifest is not None and bool(self.docs) and set(self.vectors)==set(self.document_keys)
 def valid_vector(self,vector):
  return isinstance(vector,list) and len(vector)==self.dimensions and all(type(v)in(int,float)and math.isfinite(v)for v in vector) and any(v!=0 for v in vector)
 def validate_batch(self,vectors,count):
  if len(vectors)!=count or not all(self.valid_vector(v)for v in vectors):raise ValueError('Embedding response has incomplete, invalid or mismatched vectors')
  return vectors
 def embedding(self,values):
  if not self.api_key:raise RuntimeError('Embedding API credentials unavailable')
  payload=json.dumps({'model':self.model,'input':values,'dimensions':self.dimensions}).encode()
  req=urllib.request.Request('https://api.openai.com/v1/embeddings',data=payload,headers={'Authorization':'Bearer '+self.api_key,'Content-Type':'application/json'})
  with urllib.request.urlopen(req,timeout=15) as r: data=json.load(r)
  entries=sorted(data['data'],key=lambda d:d['index'])
  if [d['index']for d in entries]!=list(range(len(values))):raise ValueError('Embedding response index mismatch')
  return self.validate_batch([d['embedding']for d in entries],len(values))
 def prepare_vectors(self):
  if not self.cache:raise ValueError('Cache path required')
  pending=[d for d in self.docs if d['id'] not in self.vectors]
  # Identical chunks in different objects/locales reuse the same embedding.
  unique={self.document_keys[d['id']]:d for d in pending}
  items=list(unique.items())
  for start in range(0,len(items),24):
   batch=items[start:start+24]
   vectors=self.validate_batch(self.embedding([d['title']+'\n'+d['text'][:6000]for _,d in batch]),len(batch))
   self.vector_entries.update({key:v for (key,_),v in zip(batch,vectors)})
  self.vectors={docid:self.vector_entries[key]for docid,key in self.document_keys.items()}
  data={'schemaVersion':'nuwa-vectors-2','candidateId':self.version,'model':self.model,'dimensions':self.dimensions,'documents':self.document_keys,'entries':self.vector_entries}
  self.cache.parent.mkdir(parents=True,exist_ok=True)
  temporary=self.cache.with_suffix(self.cache.suffix+'.tmp')
  temporary.write_text(json.dumps(data,allow_nan=False));temporary.replace(self.cache)
  self.vector_manifest=data
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
  if query and self.api_key and self.semantic_ready:
   try:
    v=self.query_cache.get(query)
    if v is None:
     v=self.validate_batch(self.embedding([query]),1)[0]
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
   if key not in best or score>best[key]['score']:
    url=d['url'];url=('/en'+url)if request.get('locale')=='en'and url.startswith('/nuwa/')else url
    if d.get('anchor'):url=url.split('#',1)[0]+'#'+d['anchor']
    best[key]={**d,'url':url,'score':score,'snippet':matching_snippet(d['text'],query)}
  ordered=sorted(best.values(),key=lambda d:-d['score'])
  for d in ordered:facets[d['type']]=facets.get(d['type'],0)+1
  try:offset=max(0,int(request.get('cursor')or 0))
  except (TypeError,ValueError):raise ValueError('Invalid cursor')
  return {'snapshotId':self.version,'mode':mode,'notice':notice,'hits':ordered[offset:offset+20],'facets':facets,'nextCursor':str(offset+20)if len(ordered)>offset+20 else None}
