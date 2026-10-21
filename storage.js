// GitHub Pages has no write API. Its workspace.json is the starting snapshot;
// subsequent edits stay in this browser and can be moved with export/import.
export function storageConfig(location) {
 const localHost=['localhost','127.0.0.1','[::1]'].includes(location.hostname);
 const base=new URL('.',location.href);
 return {
  key:'room-by-room-workspace-v1'+(localHost?'':':'+base.pathname),
  api:localHost&&base.pathname==='/'?new URL('api/workspace',base).href:null,
  seed:new URL('workspace.json',base).href
 };
}

export async function readWorkspace({config,storage,fetcher,normalise}) {
 let local=null,remote=null,server=false;
 try { const raw=storage.getItem(config.key);if(raw)local=normalise(JSON.parse(raw)); } catch {}
 if(config.api)try {
  const response=await fetcher(config.api,{cache:'no-store'});
  if(response.ok){const raw=await response.json();remote=raw?normalise(raw):null;server=true;}
 } catch {}
 if(!server)try {
  const response=await fetcher(config.seed,{cache:'no-store'});
  if(response.ok)remote=normalise(await response.json());
 } catch {}
 return {server,state:remote&&(!local||remote.updatedAt>=local.updatedAt)?remote:local};
}
