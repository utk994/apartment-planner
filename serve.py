from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from pathlib import Path
import json,threading,os
ROOT=Path(__file__).resolve().parent
WORKSPACE=ROOT/'workspace.json'
lock=threading.Lock()
class Handler(SimpleHTTPRequestHandler):
 def __init__(self,*args,**kwargs):super().__init__(*args,directory=str(ROOT),**kwargs)
 def end_headers(self):
  self.send_header('Cache-Control','no-cache')
  self.send_header('X-Content-Type-Options','nosniff')
  super().end_headers()
 def respond(self,status,value):
  data=json.dumps(value).encode();self.send_response(status);self.send_header('Content-Type','application/json');self.send_header('Content-Length',str(len(data)));self.end_headers();self.wfile.write(data)
 def do_GET(self):
  if self.path.split('?')[0]=='/api/workspace':
   with lock:
    data=json.loads(WORKSPACE.read_text()) if WORKSPACE.exists() else None
   return self.respond(200,data)
  return super().do_GET()
 def do_POST(self):
  if self.path!='/api/workspace':return self.respond(404,{'error':'Not found'})
  if self.headers.get('Host') not in ('127.0.0.1:8766','localhost:8766'):return self.respond(403,{'error':'Local access only'})
  origin=self.headers.get('Origin')
  if origin and origin not in ('http://127.0.0.1:8766','http://localhost:8766'):return self.respond(403,{'error':'Origin rejected'})
  if self.headers.get('Content-Type','').split(';')[0]!='application/json':return self.respond(415,{'error':'JSON required'})
  try:
   length=int(self.headers.get('Content-Length',0))
   if not 0<length<=2000000:return self.respond(413,{'error':'Workspace too large'})
   data=json.loads(self.rfile.read(length))
   if not isinstance(data,dict) or data.get('schema')!=1 or not isinstance(data.get('layouts'),list):raise ValueError('Invalid workspace')
   with lock:
    previous=json.loads(WORKSPACE.read_text()) if WORKSPACE.exists() else None
    if previous and previous.get('updatedAt',0)>data.get('updatedAt',0):return self.respond(409,{'error':'A newer local workspace is already saved. Reload before editing.'})
    temporary=WORKSPACE.with_suffix('.tmp');temporary.write_text(json.dumps(data,indent=2));os.replace(temporary,WORKSPACE)
   return self.respond(200,{'saved':True})
  except (ValueError,TypeError,json.JSONDecodeError):return self.respond(400,{'error':'Invalid workspace'})
 def log_message(self,format,*args):pass
print('Local: http://127.0.0.1:8766/',flush=True)
ThreadingHTTPServer(('127.0.0.1',8766),Handler).serve_forever()
