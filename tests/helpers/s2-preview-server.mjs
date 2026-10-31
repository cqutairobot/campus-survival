import {createServer} from 'vite';
import {fileURLToPath} from 'node:url';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
const root=fileURLToPath(new URL('../preview/',import.meta.url)),repo=fileURLToPath(new URL('../../',import.meta.url));
// Test-only origin. This host is never an input to the production build.
const server=await createServer({configFile:false,root,publicDir:join(repo,'public'),cacheDir:join(tmpdir(),'campus-s2-preview-vite'),server:{host:'127.0.0.1',port:5174,strictPort:true,fs:{allow:[repo]}}});
await server.listen();
