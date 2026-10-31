/** Read before repository construction. A fixture never obtains real storage. */
export function isDebugFixture(search:string){const params=new URLSearchParams(search);return params.get('debug')==='1'&&params.get('fixture')==='1';}
export const IS_FIXTURE=typeof location!=='undefined'&&isDebugFixture(location.search);
