import {createServer} from 'vite';
import {writeFileSync} from 'node:fs';
const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom',logLevel:'error'});
try{const module=await server.ssrLoadModule('/scripts/s2-balance-simulation.ts');const results=module.releaseBalanceObservations();if(process.argv[2])writeFileSync(process.argv[2],JSON.stringify(results,null,2)+'\n');console.log(JSON.stringify(results,null,2));}finally{await server.close();}
