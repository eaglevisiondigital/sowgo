// Local fallback preview only. No remote credentials, migrations, or auth calls.
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {makeHandler} from '../netlify/edge-functions/outreach-router.js';
const root=resolve('public'),handler=makeHandler({get:()=>undefined});
createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://127.0.0.1:4387'),path=decodeURIComponent(url.pathname);
  const file=resolve(root,'.'+path+(path.endsWith('/')?'index.html':''));
  if(!file.startsWith(root+'/')){res.writeHead(404);res.end();return;}
  const staticResponse=async()=>{try{return new Response(await readFile(file),{headers:{'Content-Type':({'.html':'text/html','.css':'text/css','.js':'text/javascript','.png':'image/png','.svg':'image/svg+xml'}[extname(file)]||'application/octet-stream')}});}catch{return new Response('Not found',{status:404});}};
  const response=(['/go','/go/','/go/admin','/api/outreach-router-config'].includes(path)||path.startsWith('/go/admin/'))?await handler(new Request(url,{method:req.method}),{next:staticResponse}):await staticResponse();
  res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
 }catch{res.writeHead(500);res.end('Preview unavailable');}
}).listen(4387,'127.0.0.1',()=>process.stdout.write('Router preview http://127.0.0.1:4387/go\n'));
