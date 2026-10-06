import {test} from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {PNG} from 'pngjs';import QRCode from 'qrcode';
import zxing from '@zxing/library';
test('4096px QR decodes exact permanent URL; SVG integrity and quiet zone',async()=>{
 const image=PNG.sync.read(readFileSync('public/assets/qr/sowgo-universal-outreach.png'));
 assert.equal(image.width,4096);assert.equal(image.height,4096);
 const pixels=new Uint8ClampedArray(image.width*image.height);
 for(let i=0;i<pixels.length;i++){assert.equal(image.data[i*4+3],255);pixels[i]=image.data[i*4];}
 const bitmap=new zxing.BinaryBitmap(new zxing.HybridBinarizer(new zxing.RGBLuminanceSource(pixels,image.width,image.height)));
 const decoded=new zxing.QRCodeReader().decode(bitmap).getText();assert.equal(decoded,'https://sowgo.org/go');
 const svg=readFileSync('public/assets/qr/sowgo-universal-outreach.svg','utf8');
 assert.equal(svg,await QRCode.toString(decoded,{type:'svg',errorCorrectionLevel:'M',margin:4,color:{dark:'#000000',light:'#FFFFFF'}}));
 assert.match(svg,/^<svg/);assert.doesNotMatch(svg,/<image|<script|href=/);
 for(let x=0;x<image.width;x++){assert.equal(pixels[x],255);assert.equal(pixels[(image.height-1)*image.width+x],255);}
 const qr=QRCode.create(decoded,{errorCorrectionLevel:'M'});const quietPixels=Math.floor(4*image.width/(qr.modules.size+8));
 for(let y=0;y<quietPixels;y++)for(let x=0;x<image.width;x++)assert.equal(pixels[y*image.width+x],255);
});
