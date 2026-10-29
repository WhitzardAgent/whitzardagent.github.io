import argparse,json,time,statistics,math
from pathlib import Path
from engine import SearchEngine
p=argparse.ArgumentParser();p.add_argument('--corpus',required=True);p.add_argument('--tasks',required=True);p.add_argument('--out',required=True);a=p.parse_args()
e=SearchEngine(json.loads(Path(a.corpus).read_text()));tasks=json.loads(Path(a.tasks).read_text())['tasks'];rows=[]
for task in tasks:
 start=time.perf_counter();result=e.search(task);ms=(time.perf_counter()-start)*1000;expected=set(task['expectedWorkIds']);hits=result['hits'];ranks=[i+1 for i,h in enumerate(hits[:10])if h['type']=='research'and h['objectId']in expected];unique={h['objectId']for h in hits[:10]if h['type']=='research'and h['objectId']in expected}
 dcg=sum(1/math.log2(r+1)for r in ranks);ideal=sum(1/math.log2(i+2)for i in range(min(10,len(expected))))
 rows.append({'id':task['id'],'category':task['category'],'query':task['query'],'top1':bool(ranks and ranks[0]==1),'top5':any(r<=5 for r in ranks),'recall10':len(unique)/len(expected)if expected else None,'ndcg10':dcg/ideal if ideal else None,'latencyMs':ms,'topIds':[h['type']+':'+h['objectId']for h in hits[:10]],'expected':list(expected),'noAnswerCorrect':not hits if not expected else None})
valid=[r for r in rows if r['recall10']is not None];exact=[r for r in rows if r['category']=='exact'];lat=sorted(r['latencyMs']for r in rows)
report={'mode':'lexical','semanticEvaluation':'not-run-no-API-credentials-or-vectors','judgments':'model-assisted; pending researcher review','candidateId':e.version,'tasks':len(rows),'exactTop1':sum(r['top1']for r in exact)/len(exact),'answerableTop5':sum(r['top5']for r in valid)/len(valid),'recall10':statistics.mean(r['recall10']for r in valid),'ndcg10':statistics.mean(r['ndcg10']for r in valid),'p50Ms':statistics.median(lat),'p95Ms':lat[math.ceil(.95*len(lat))-1],'results':rows}
Path(a.out).write_text(json.dumps(report,ensure_ascii=False,indent=2));print(json.dumps({k:v for k,v in report.items()if k!='results'}))
