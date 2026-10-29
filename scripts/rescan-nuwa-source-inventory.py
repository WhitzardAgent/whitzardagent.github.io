"""HTTP/source-version census, deliberately separate from substantive reading."""
import json,sys,urllib.request,hashlib,datetime,concurrent.futures
from pathlib import Path
root=Path(sys.argv[1]);base=json.loads((root/'baseline-inventory.json').read_text());catalogue=json.loads(Path('src/data/nuwa-index/catalogue.json').read_text());sources={s['id']:s for s in catalogue['sources']};out=root/'inventory-rescan';out.mkdir(exist_ok=True)
items=[]
for kind in ['signals','inventory','protocols']:
 for entry in base[kind]:
  r=entry.get('record',entry);source=sources.get(r.get('sourceId'),{});url=r.get('url')or source.get('url');items.append((kind,entry['id'],url))
def fetch(url):
 captured=datetime.datetime.now(datetime.timezone.utc).isoformat()
 try:
  req=urllib.request.Request(url,headers={'User-Agent':'NUWA-Research-SourceCheck/1.0'})
  with urllib.request.urlopen(req,timeout=18)as response:
   body=response.read(1048576);digest=hashlib.sha256(body).hexdigest();(out/(digest+'.capture')).write_bytes(body)
   return {'checkedAt':captured,'httpStatus':response.status,'finalUrl':response.url,'contentType':response.headers.get('Content-Type'),'capturedBytes':len(body),'captureSha256':digest,'captureScope':'at most first 1 MiB; availability and version evidence, not substantive reading','status':'retrieved'}
 except Exception as e:return {'checkedAt':captured,'status':'retrieval-failed','error':str(e)}
urls=sorted({url for _,_,url in items if url});results={}
with concurrent.futures.ThreadPoolExecutor(max_workers=8)as pool:
 for url,result in zip(urls,pool.map(fetch,urls)):results[url]=result
rows=[{'collection':kind,'id':identity,'url':url,**(results[url]if url else {'status':'source-url-not-resolved'}),'substantiveReview':'pending'}for kind,identity,url in items]
report={'schemaVersion':'nuwa-source-rescan-1','baseSnapshotId':base['baseSnapshotId'],'rows':rows,'summary':{k:sum(r['collection']==k for r in rows)for k in ['signals','inventory','protocols']},'uniqueUrlsAttempted':len(urls),'retrieved':sum(r['status']=='retrieved'for r in results.values())}
(root/'inventory-rescan.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print(json.dumps({k:v for k,v in report.items()if k!='rows'}))
