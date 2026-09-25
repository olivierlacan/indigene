// Ask a multimodal model to critique a cut of the film.
//   node review.mjs cut.mp4 [model] [promptfile]
import fs from "node:fs";
const [file, model = "google/gemini-3.8-flash", pf] = process.argv.slice(2);
const key = process.env.OPENROUTER_API_KEY;
if (!key) { console.error("Set OPENROUTER_API_KEY"); process.exit(1); }
const prompt = pf ? fs.readFileSync(pf, "utf8") : `You are the creative director at a top animation studio reviewing a 60-second hand-drawn, watercolor "naturalist's notebook" explainer for Indigene, a free app that recommends native plants for exactly where you stand. It must look and sound professional. Watch and listen closely. Give a candid, specific critique with timestamps:
1. Anything that looks broken, glitchy, clipped at the frame edge, overlapping, unreadable, or amateurish.
2. Sync: do the visuals land on the narration's words? Anything early/late?
3. Pacing and camera moves: too fast, too slow, jarring?
4. Sound mix: voice clarity, music level/ducking, sound effects (any that sound fake, too loud, or distracting).
5. Storytelling clarity for a general audience.
6. The 5 highest-impact concrete fixes, in priority order.
Be blunt; do not praise.`;
const b64 = fs.readFileSync(file).toString("base64");
const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
  body: JSON.stringify({ model, messages: [{ role: "user", content: [{ type: "text", text: prompt }, { type: "video_url", video_url: { url: `data:video/mp4;base64,${b64}` } }] }] }),
});
const j = await r.json();
if (!r.ok) { console.error(JSON.stringify(j).slice(0, 1500)); process.exit(1); }
console.log(j.choices[0].message.content);
console.error("usage", JSON.stringify(j.usage));
