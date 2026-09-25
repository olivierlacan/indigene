// Generate the narration through OpenRouter's speech endpoint.
//   node tts.mjs google/gemini-3.8-flash-tts Algieba ../assets/voice "<style>" narration-tts.txt
// Gemini returns raw 24 kHz PCM; convert with
//   ffmpeg -f s16le -ar 24000 -ac 1 -i ../assets/voice.pcm -c:a flac ../assets/voice.flac
// narration-tts.txt spells the name Ahn-dee-ZHENNE so the voice says it the French way.
// usage: node tts.mjs model voice out [style] [scriptfile] [fmt]
import fs from 'fs';
const [model, voice, out, style='', scriptFile=new URL('./narration-tts.txt', import.meta.url).pathname, fmt='pcm'] = process.argv.slice(2);
const key = process.env.OPENROUTER_API_KEY;
if (!key) { console.error("Set OPENROUTER_API_KEY"); process.exit(1); }
const input = fs.readFileSync(scriptFile,'utf8').trim();
const body = { model, input, voice, response_format: fmt };
if (style && model.startsWith('google/')) body.provider = { options: { 'google-ai-studio': { speech_metadata: { style } } } };
if (style && model.startsWith('microsoft/')) body.provider = { options: { azure: JSON.parse(style) } };
const r = await fetch('https://openrouter.ai/api/v1/audio/speech', { method:'POST', headers:{'Content-Type':'application/json', Authorization:`Bearer ${key}`}, body: JSON.stringify(body)});
const buf = Buffer.from(await r.arrayBuffer());
if (!r.ok) { console.error(r.status, buf.toString()); process.exit(1); }
console.error('content-type', r.headers.get('content-type'), buf.length);
fs.writeFileSync(out + (fmt==='pcm'?'.pcm':''), buf);
