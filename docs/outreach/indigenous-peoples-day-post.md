# Indigenous Peoples' Day post: outline

Two posts, one launch. Each audience gets the part it came for and a link to
the other.

| | **A. On Indigene** (`indigene.app/…`) | **B. On Constant Variable** |
|---|---|---|
| Reader | Gardeners, native plant societies, r/NativePlantGardening | HN, r/webdev, people who read about how things get built |
| Question it answers | *What would I plant, and who ate it before me?* | *Why build this, and what did it take?* |
| Voice | The app's: plain words, short, warm, translatable | Yours: first person, opinions allowed |
| Length | ~600 words | ~1,500 words |
| Leads with | Plants | The day, then the build |
| Links to | B, for the why and the cost | A, for the plants; the app itself |

Constant Variable over olivierlacan.com: HN and Reddit judge the link, not the
domain's history, and the new blog gains a first post with a real launch behind
it. Keep olivierlacan.com to a short note pointing at B.

**Timing check:** the second Monday of October 2026 is the **12th**.

---

## The rule both posts follow

**The plants and the peoples are the subject. Indigene is the way in.** A
product launch timed to the day is fine if the day isn't decoration. Three
guards:

1. **Name nations, not "Indigenous peoples" in general.** Coast Salish, Māori,
   and whoever's land the reader stands on. Link a tool like native-land.ca so
   they can find out.
2. **Food, fibre and fire, not medicine.** A post that says "this root treats X"
   sends people to dig it up. White sage is the cautionary case. Say a plant was
   eaten, woven, tended; don't give uses that invite harvest.
3. **Say what Indigene doesn't do yet.** See the gap below. Honest beats
   impressive, and HN will check.

---

## The gap to be honest about

Indigene mentions Indigenous use on a handful of plants today, not as a
feature:

- **Common camas** (PNW): "a First Foods staple of Northwest peoples". The
  white fawn lily's bulbs "were a food plant for Coast Salish peoples".
- **Karaka, tōtara, harakeke** (Auckland): Māori planted karaka groves, built
  canoes from tōtara, weave harakeke. Te reo Māori names are the everyday
  common names there.
- **Garry oak meadows** (`#/native`): kept open by Coast Salish burning.

That's the whole list. Everything else in the post must stay inside what ships,
or be labelled *next*. **To decide before publishing:** what "soon" is, and
whether it's written with Indigenous sources credited by name. If it isn't
planned, don't promise it.

---

## A. The Indigene post

Title: names the thing. *Plants that fed people first* or *Native plants for
Indigenous Peoples' Day*.

1. **Opening (2–3 sentences).** Today is Indigenous Peoples' Day. Before these
   were "native plants", they were food, rope and medicine for the peoples who
   tended them. Here are a few you can still plant.
2. **Five plants, one line each, each linked to its page.** Camas, karaka,
   harakeke, plus two from regions with the most readers (pick from Mid-Atlantic
   / PNW / California). Each: the plant, the nation, what it was for, what it
   feeds now. Cut to three if two are weak.
3. **Land that was tended, not wild (1 paragraph).** Garry oak meadows and fire.
   "Wilderness" was often a garden whose gardeners were removed. One sentence
   on what replaced them; the genocide named plainly, once. Link `#/native`.
4. **What Indigene does (bullets, 5 max).** Stand in a spot → plants that thrive
   there, ranked by the wildlife they feed. 15 regions on four continents. Free,
   no account, offline. Regions follow land, not borders. Names chosen with
   care (`#/native`).
5. **What's next (2 sentences).** The gap above, as a plan or as an ask.
6. **Way on.** "Find what grows where you're standing" → the app. "Why we built
   it, and what it cost" → post B.

Cut from A: the LLM detail (one link to `/llm` in step 4), urgency stats,
anything on the tech stack.

---

## B. The Constant Variable post

Title: says what it is, no pronoun, no politics in the title (HN flags them).
*Show HN: Indigene – native plants for the exact spot you're standing*. The day
goes in the first line of the body.

1. **Why today (1 paragraph).** Columbus out, Indigenous Peoples' Day in. Native
   plants are a living record of who was here first and what they knew. Link A
   for the plants themselves.
2. **What it does (short, with one screenshot).** Location, sun, soil, climate →
   ranked plants with mature-size drawings and the caterpillars they feed. Try
   it link up top, not at the end.
3. **Urgency, with one number.** Insect decline and the native-host link (Forister
   2015, already cited on `#/native`). One figure, its source, move on. Climate
   enters here, honestly: Indigene ranks carbon as "small" on purpose. Planting
   for food webs and water is the real claim; don't sell gardens as offsets.
4. **Native, not nativism (the section HN and Reddit will quote).**
   - "Native" is an ecological fact; it says nothing about people.
   - Borders don't come into it: Ireland covers both sides of the border; the St
     Lawrence region spans Québec, Ontario, New York and Vermont because the
     lowland does.
   - The words changed: "invader/alien" → "invasive", "belongs here" → "native
     to", a colonial slur dropped from the sour fig, "Oriental" → "Asian".
   - The French problem: *autochtone* and the far right; *Végétal local*.
   - The editorial rules live in the repo, enforced like code.
5. **Colonialism, concretely.** Tended landscapes, fire suppressed, names
   replaced. Te reo Māori as the default common names in Auckland is the
   answer in practice. Keep to what the app shows; skip the essay.
6. **The elephant: built with an LLM.** Say it before a commenter does.
   - What it cost: link `indigene.app/llm` (sessions, tokens, kWh, CO₂,
     list price). At least ~$5,400 at API rates over 110 sessions as of 7
     October; re-check the page the morning you publish.
   - Why it's defensible, not free: no LLM at runtime, no server, ~half a
     megabyte, facts rechecked by plain scripts, MIT so nobody pays the bill
     twice.
   - What it got wrong and how the repo catches it (one example: check
     scripts against GBIF/VASCAN, not trust).
7. **What's next and how to help.** The gap above. Native plant societies:
   tell us what's wrong in your region. Indigenous readers: name the plants
   and sources we should credit, on your terms.
8. **Links.** App, repo, post A, `/llm`, `#/native`.

Cut from B: the region-by-region catalogue, the ranking formula (link it),
anything about the Hanami server.

---

## Where each theme goes

| Theme | A | B | Note |
|---|---|---|---|
| Indigenous Peoples' Day | Opening | Opening | The reason, not the product |
| Genocide | One sentence | One sentence | Named plainly, not dwelt on |
| Colonialism | Tended land | Names, fire, land | Evidence from the app only |
| Diversity & anti-nativism | One bullet + link | Core section | B's most quotable part |
| Borders | One bullet | Inside anti-nativism | Ireland, St Lawrence |
| Climate | — | Inside urgency | Don't overclaim carbon |
| Urgency | — | One number | Food webs, insects |
| LLM | Link to `/llm` | Own section | Pre-empt it |

## Posting notes

- **HN:** Show HN, post B. Be in the thread for the first two hours; the LLM and
  "native" questions come first.
- **r/NativePlantGardening** and regional subs: post A. Read each sub's
  self-promotion rule first; lead with the plants, link the app once.
- **Native plant societies:** don't use this launch for cold emails;
  [playbook.md](playbook.md) has the order.
