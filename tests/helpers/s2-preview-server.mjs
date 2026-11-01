import {createServer,build} from 'vite';
import {createReadStream,statSync} from 'node:fs';
import {resolve,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
const root=fileURLToPath(new URL('../preview/',import.meta.url)),repo=fileURLToPath(new URL('../../',import.meta.url));
// Test-only origin. This host is never an input to the production build.
const built=join(tmpdir(),'campus-s2-built-preview');
await build({configFile:false,root,base:'/__s2-built__/',publicDir:join(repo,'public'),logLevel:'warn',build:{outDir:built,emptyOutDir:true,target:'es2022',rollupOptions:{input:join(root,'budget.html')}}});
// Count server bodies as well as main-thread timing: Pixi fetches textures in workers.
let transfer={files:[]};
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2','.ogg':'audio/ogg','.mp3':'audio/mpeg'};
const builtHost={name:'s2-built-test-host',configureServer(server){
 server.middlewares.use((req,res,next)=>{
  const pathname=new URL(req.url??'/','http://localhost').pathname;
  if(pathname==='/__s2-built__/budget.html')transfer={files:[]};
  if(pathname==='/__s2-built__/__transfer.json'){const bodyBytes=transfer.files.reduce((n,f)=>n+f.bytes,0),requestCount=transfer.files.length;res.setHeader('Content-Type','application/json');res.end(JSON.stringify({bodyBytes,requestCount,headerAllowancePerRequest:1024,conservativeTransferBytes:bodyBytes+requestCount*1024,includes:'HTML, JS, CSS, fonts, DOM images and dedicated-worker texture requests',files:transfer.files}));return;}
  const own=transfer,path=pathname.startsWith('/__s2-built__/')?resolve(built,'.'+decodeURIComponent(pathname.slice('/__s2-built__'.length))):pathname.startsWith('/assets/')?resolve(repo,'public','.'+decodeURIComponent(pathname)):null;
  if(path&&(path.startsWith(built+sep)||path.startsWith(join(repo,'public')+sep)))try{const stat=statSync(path);if(stat.isFile())res.once('finish',()=>own.files.push({name:pathname,status:res.statusCode,bytes:res.statusCode===304?0:stat.size}));}catch{/* Non-static Vite modules do not enter this production-host counter. */}
  next();
 });
 server.middlewares.use('/__s2-built__',(req,res,next)=>{const url=new URL(req.url??'/', 'http://localhost'),file=resolve(built,'.'+decodeURIComponent(url.pathname));if(!file.startsWith(built+sep))return next();let stat;try{stat=statSync(file);if(!stat.isFile())return next();}catch{return next();}res.setHeader('Content-Type',types[extname(file)]??'application/octet-stream');res.setHeader('Content-Length',stat.size);createReadStream(file).pipe(res);});
}};
const server=await createServer({configFile:false,optimizeDeps:{include:['react','react-dom','react-dom/client']},plugins:[builtHost],root,publicDir:join(repo,'public'),cacheDir:join(tmpdir(),'campus-s2-preview-vite'),server:{host:'127.0.0.1',port:5174,strictPort:true,fs:{allow:[repo]}}});
await server.listen();
