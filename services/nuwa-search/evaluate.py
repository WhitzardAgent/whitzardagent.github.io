"""Evaluate typed objects against the same engine used by the service."""
import argparse,json,time,statistics,math
from pathlib import Path
from engine import SearchEngine

def evaluate(corpus,tasks,cache=None,mode='lexical'):
 e=SearchEngine(corpus,cache)
 if mode=='lexical':e.api_key=None
 if mode=='hybrid' and (not e.api_key or not e.semantic_ready):raise ValueError('Hybrid evaluation requires credentials and complete matching vectors')
 rows=[]
 for task in tasks:
  expected={(r['type'],r['id']):r.get('relevance',1) for r in task.get('expected', [{'type':'research','id':i}for i in task.get('expectedWorkIds',[])])}
  start=time.perf_counter();result=e.search(task);elapsed=(time.perf_counter()-start)*1000
  if mode=='hybrid' and result['mode']!='hybrid':raise ValueError('Semantic query failed; hybrid evaluation cannot use lexical fallback')
  warm_start=time.perf_counter();warm=e.search(task);warm_elapsed=(time.perf_counter()-warm_start)*1000
  if mode=='hybrid' and warm['mode']!='hybrid':raise ValueError('Semantic warm query failed; hybrid evaluation cannot use lexical fallback')
  hits=result['hits'][:10];gains=[expected.get((h['type'],h['objectId']),0)for h in hits];found={(h['type'],h['objectId'])for h in hits}&expected.keys()
  dcg=sum((2**g-1)/math.log2(i+2)for i,g in enumerate(gains));ideal=sum((2**g-1)/math.log2(i+2)for i,g in enumerate(sorted(expected.values(),reverse=True)[:10]))
  rows.append({'id':task['id'],'category':task['category'],'top1':bool(gains and gains[0]),'top5':any(gains[:5]),'recall10':len(found)/len(expected)if expected else None,'ndcg10':dcg/ideal if ideal else None,'latencyMs':elapsed,'coldLatencyMs':elapsed,'warmLatencyMs':warm_elapsed,'actualMode':result['mode'],'topIds':[h['type']+':'+h['objectId']for h in hits],'noAnswerCorrect':not hits if not expected else None})
 valid=[r for r in rows if r['recall10']is not None];exact=[r for r in rows if r['category']=='exact'];lat=sorted(r['latencyMs']for r in rows)
 def percentile(values,p):
  ordered=sorted(values);return ordered[math.ceil(p*len(ordered))-1]if ordered else None
 categories={}
 for category in sorted({r['category']for r in rows}):
  selected=[r for r in rows if r['category']==category];answerable=[r for r in selected if r['recall10']is not None]
  categories[category]={'tasks':len(selected),'top1':statistics.mean(r['top1']for r in answerable)if answerable else None,'top5':statistics.mean(r['top5']for r in answerable)if answerable else None,'recall10':statistics.mean(r['recall10']for r in answerable)if answerable else None,'ndcg10':statistics.mean(r['ndcg10']for r in answerable)if answerable else None}
 return {'coldP95Ms':percentile([r['coldLatencyMs']for r in rows],.95),'warmP95Ms':percentile([r['warmLatencyMs']for r in rows],.95),'categories':categories,'mode':mode,'judgments':'model-assisted; pending researcher review','candidateId':e.version,'tasks':len(rows),'exactTop1':sum(r['top1']for r in exact)/len(exact)if exact else None,'answerableTop5':sum(r['top5']for r in valid)/len(valid)if valid else None,'recall10':statistics.mean(r['recall10']for r in valid)if valid else None,'ndcg10':statistics.mean(r['ndcg10']for r in valid)if valid else None,'p50Ms':statistics.median(lat),'p95Ms':lat[math.ceil(.95*len(lat))-1],'results':rows}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--corpus',required=True);p.add_argument('--tasks',required=True);p.add_argument('--out',required=True);p.add_argument('--cache');p.add_argument('--mode',choices=['lexical','hybrid'],default='lexical');a=p.parse_args()
 report=evaluate(json.loads(Path(a.corpus).read_text()),json.loads(Path(a.tasks).read_text())['tasks'],a.cache,a.mode);Path(a.out).write_text(json.dumps(report,ensure_ascii=False,indent=2));print(json.dumps({k:v for k,v in report.items()if k!='results'}))
