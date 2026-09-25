// Ask an audio-capable model to critique a voice take (or any audio): accent,
// pronunciation, errors, glitches, pacing. Pass your own prompt as the third
// argument, or get the default casting-director checklist.
//   node judge-audio.mjs take.wav [model] [prompt]
// usage: node judge.mjs file.(wav|mp3) [model] [prompt]
import fs from 'fs';
const [file, model='google/gemini-3.8-flash', promptArg] = process.argv.slice(2);
const key = process.env.OPENROUTER_API_KEY;
if (!key) { console.error("Set OPENROUTER_API_KEY"); process.exit(1); }
const script = fs.readFileSync(new URL(process.env.SCRIPT || './narration.txt', import.meta.url),'utf8');
const prompt = promptArg || `You are a demanding casting director and audio engineer for a professional animated explainer. Listen carefully to this voice-over take. The intended script is:\n---\n${script}\n---\nReport, candidly and specifically:\n1. Accent: exactly what accent it is (must NOT be British; any British/RP/Australian tinge is disqualifying — say so).\n2. How "Indigène" is pronounced each time (transcribe phonetically). Target: French-ish "an-dee-ZHEN" / "in-di-ZHEN".\n3. Any mispronunciations, skipped/added words, glitches, clicks, robotic artifacts, odd breaths, unnatural emphasis — with timestamps.\n4. Warmth, naturalness, pacing, emotional fit for a gentle hand-drawn nature explainer (score each 1-10).\n5. Start and end timestamps (seconds, 2 decimals) of each of the 7 script lines.\nBe precise and critical; do not flatter.`;
const b64 = fs.readFileSync(file).toString('base64');
const fmt = file.endsWith('.mp3')?'mp3':'wav';
const r = await fetch('https://openrouter.ai/api/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${key}`},body:JSON.stringify({model,messages:[{role:'user',content:[{type:'text',text:prompt},{type:'input_audio',input_audio:{data:b64,format:fmt}}]}]})});
const j = await r.json();
if (!r.ok) { console.error(JSON.stringify(j)); process.exit(1); }
console.log(j.choices[0].message.content);
console.error('usage', JSON.stringify(j.usage));
