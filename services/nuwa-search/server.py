"""Local review server: static Astro output and same-origin search."""
import argparse,json,time,threading
from pathlib import Path
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from engine import SearchEngine
p=argparse.ArgumentParser();p.add_argument('--corpus',required=True);p.add_argument('--site',default='dist');p.add_argument('--port',type=int,default=4345);p.add_argument('--host',default='127.0.0.1');p.add_argument('--cache',default='.cache/nuwa-vectors.json');p.add_argument('--embed',action='store_true');args=p.parse_args()
engine=SearchEngine(json.loads(Path(args.corpus).read_text()),args.cache)
if args.embed:engine.prepare_vectors()
slots=threading.BoundedSemaphore(4);recent={};guard=threading.Lock()
class Handler(SimpleHTTPRequestHandler):
 def __init__(self,*a,**kw):super().__init__(*a,directory=args.site,**kw)
 def do_POST(self):
  if self.path!='/api/search':self.send_error(404);return
  try:
   size=int(self.headers.get('Content-Length','0'))
   if not 0<size<=16384:self.send_error(413);return
   with guard:
    now=time.monotonic();history=[t for t in recent.get(self.client_address[0],[])if now-t<60]
    if len(history)>=60:self.send_error(429);return
    recent[self.client_address[0]]=history+[now]
   if not slots.acquire(blocking=False):self.send_error(503);return
   try:result=engine.search(json.loads(self.rfile.read(size)))
   finally:slots.release()
   payload=json.dumps(result,ensure_ascii=False).encode();self.send_response(200);self.send_header('Content-Type','application/json; charset=utf-8');self.send_header('Cache-Control','no-store');self.send_header('Content-Length',str(len(payload)));self.end_headers();self.wfile.write(payload)
  except (ValueError,TypeError,KeyError):self.send_error(400,'Invalid query or index version')
 def log_message(self,*a):pass # Do not persist researcher queries.
print(f'NUWA local review: http://127.0.0.1:{args.port}/nuwa/whitzard-index/preview/trend/',flush=True)
ThreadingHTTPServer((args.host,args.port),Handler).serve_forever()
