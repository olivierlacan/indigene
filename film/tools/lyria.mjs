// Generate the score with Google Lyria 3 through OpenRouter (streamed).
//   node lyria.mjs ../assets/music.mp3 music-prompt.txt google/lyria-3-pro-preview mp3
import fs from 'fs';
const [out, promptFile, model='google/lyria-3-pro-preview', fmt='wav'] = process.argv.slice(2);
const key = process.env.OPENROUTER_API_KEY;
if (!key) { console.error("Set OPENROUTER_API_KEY"); process.exit(1); }
const prompt = fs.readFileSync(promptFile,'utf8');
const body = { model, stream:true, messages:[{role:'user',content:prompt}], modalities:['text','audio'], audio:{format:fmt} };
const r = await fetch('https://openrouter.ai/api/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${key}`},body:JSON.stringify(body)});
if (!r.ok) { console.error(r.status, await r.text()); process.exit(1); }
let buf='', chunks=[], text='', usage=null, fmtSeen=null, sample=null;
const dec = new TextDecoder();
for await (const part of r.body) {
  buf += dec.decode(part, {stream:true});
  let i;
  while ((i = buf.indexOf('\n')) >= 0) {
    const line = buf.slice(0,i).trim(); buf = buf.slice(i+1);
    if (!line.startsWith('data:')) continue;
    const d = line.slice(5).trim(); if (d==='[DONE]') continue;
    let j; try { j = JSON.parse(d); } catch { continue; }
    if (j.usage) usage = j.usage;
    if (j.error) console.error('ERR', JSON.stringify(j.error));
    const delta = j.choices?.[0]?.delta || {};
    if (!sample && Object.keys(delta).length) sample = Object.keys(delta);
    if (delta.content) text += delta.content;
    if (delta.audio?.data) chunks.push(delta.audio.data);
    if (delta.audio?.transcript) text += delta.audio.transcript;
    if (delta.audio?.format) fmtSeen = delta.audio.format;
  }
}
console.error('delta keys', sample, 'usage', JSON.stringify(usage));
console.error('text:', text.slice(0,1500));
const b = Buffer.concat(chunks.map(c=>Buffer.from(c,'base64')));
fs.writeFileSync(out, b); console.error('wrote', out, b.length, fmtSeen);
