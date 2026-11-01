import {preview} from 'vite';
import {statSync} from 'node:fs';
import {resolve,sep} from 'node:path';
// Playwright owns the same Vite production preview/compression lifecycle. The
// test-only middleware measures actual encoded bodies, including image workers.
const root=resolve('dist');let files=[];
await preview({configFile:false,preview:{host:'127.0.0.1',port:5173,strictPort:true},plugins:[{name:'production-transfer-counter',configurePreviewServer(server){
 server.middlewares.use((req,res,next)=>{
  const url=new URL(req.url??'/','http://localhost');
  if(url.pathname==='/__transfer/reset'){files=[];res.end('ok');return;}
  if(url.pathname==='/__transfer.json'){const bodyBytes=files.reduce((sum,f)=>sum+f.bytes,0);res.setHeader('Content-Type','application/json');res.end(JSON.stringify({files,bodyBytes,decodedBodyBytes:files.reduce((sum,f)=>sum+f.decodedBytes,0),requestCount:files.length,headerAllowancePerRequest:1024,conservativeTransferBytes:bodyBytes+files.length*1024}));return;}
  const own=files,path=resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));let size;
  try{if(!path.startsWith(root+sep))return next();size=statSync(path).size;}catch{return next();}
  let bytes=0;const write=res.write,end=res.end,count=chunk=>{if(chunk)bytes+=typeof chunk==='string'?Buffer.byteLength(chunk):chunk.byteLength;};
  res.write=function(chunk,...rest){count(chunk);return write.call(this,chunk,...rest);};res.end=function(chunk,...rest){count(chunk);return end.call(this,chunk,...rest);};
  res.once('finish',()=>own.push({name:url.pathname,status:res.statusCode,bytes,decodedBytes:res.statusCode===304?0:size,encoding:res.getHeader('content-encoding')??'identity'}));next();
 });
}}]});
