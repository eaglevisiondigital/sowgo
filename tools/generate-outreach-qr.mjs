import QRCode from 'qrcode';
import {mkdirSync,writeFileSync} from 'node:fs';
const url='https://sowgo.org/go',path='public/assets/qr';mkdirSync(path,{recursive:true});
const options={errorCorrectionLevel:'M',margin:4,color:{dark:'#000000',light:'#FFFFFF'}};
writeFileSync(path+'/sowgo-universal-outreach.svg',await QRCode.toString(url,{...options,type:'svg'}));
await QRCode.toFile(path+'/sowgo-universal-outreach.png',url,{...options,width:4096});
console.log('Generated SVG and 4096px PNG: '+url+'; 4-module quiet zone, black/white, error correction M.');
