// Production-only public config; previews keep intake disabled.
import {cp,readFile,writeFile,rm} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
export async function buildPartnerSite(root,env=process.env){
 if(env.CONTEXT!=='production')throw Error('Production context required; use the isolated preview builder for previews.');
 const siteKey=env.OUTREACH_PUBLIC_SITE_KEY||'';
 if(!/^0x[A-Za-z0-9_-]{20,}$/.test(siteKey))throw Error('Existing production OUTREACH_PUBLIC_SITE_KEY required.');
 const output=resolve(root,'dist-public');await rm(output,{recursive:true,force:true});await cp(resolve(root,'public'),output,{recursive:true});
 const config={url:'https://exdocjbmylgxssanymjk.supabase.co',publishableKey:'sb_publishable_h2U_5DLZ0dtRi2QwwD_8Kw_nJ-qhYhu',outreachSiteKey:siteKey};
 await writeFile(resolve(output,'assets/js/supabase-config.js'),'// Public intake settings only; no Auth session or server secret.\nwindow.CHAMPION_LIFE_SUPABASE = '+JSON.stringify(config)+';\n');
 return {output};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){const {output}=await buildPartnerSite(fileURLToPath(new URL('../',import.meta.url)));console.log('Built complete SowGo production site with shared partner intake: '+output);}
