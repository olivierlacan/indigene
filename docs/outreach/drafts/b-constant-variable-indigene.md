# Indigene: native plants for the exact spot you're standing

*Constant Variable · 12 October 2026 · Show HN title: "Show HN: Indigene – native
plants for the exact spot you're standing"*

Today is Indigenous Peoples' Day in a growing number of places that stopped
celebrating Columbus. It seemed like the right day to show what I've been
building since July, because native plants are a living record of the people who
were here first: what they ate, wove and burned the land to keep. Five of those
plants are on [the Indigene post](https://indigene.app/#TODO). This one is about
the app, and why I built it the way I did.

**[Try Indigene →](https://indigene.app)** It's free, has no account, and works
offline.

<!-- Screenshot: a ranked plant list beside the size drawing. One image. -->

## What it does

Stand somewhere you could plant something. Indigene reads your location, asks how
much sun the spot gets (or measures the skyline with your camera), and pulls the
soil and climate for those coordinates. Then it lists the native plants that will
actually thrive there, ranked by how much of the local food web each one feeds:
the caterpillars it hosts, the bees, the birds. Each plant shows how big it will
be in one, three, five and ten years, next to a person for scale.

It covers [15 regions](https://indigene.app/regions) on four continents, from
Florida's Keys to the Kantō Plain. Outside them, the sun, soil and climate
readings still work, and the app says plainly that it has no list for you yet.

## Why native, and why now

Most plant-eating insects can only eat a narrow range of plants
([Forister et al., 2015](https://doi.org/10.1073/pnas.1423042112)). A caterpillar
that eats oak has spent thousands of generations learning to handle oak's
defenses; it can't switch to a hedge from another continent. Caterpillars are
what songbirds feed their young. So a yard of plants nothing local can eat is,
to that food web, a car park.

Climate is part of this, but I don't oversell it. Indigene scores a plant's
carbon as small on purpose, because a garden is not an offset. What a garden of
native plants does reliably is feed things, hold soil and soak up rain.

## Native, not nativism

"Native" sits next door to *nativism*, the idea that people born in a place
matter more than people who came later. Ecology lends that idea nothing, and the
app is written to keep the two apart. The rules are in the repo's contributor
guide, and every change is reviewed against them.

- **Native is an ecological fact.** A plant is native where it evolved alongside
  the insects, fungi and birds that can use it. It says nothing about people.
- **Borders don't come into it.** The [Ireland](https://indigene.app/regions/ireland)
  list covers the Republic and Northern Ireland alike. The
  [St Lawrence Lowlands](https://indigene.app/regions/st-lawrence) region spans
  Québec, Ontario, New York and Vermont, because the lowland does.
- **The words changed.** "Invader", "alien" and "villain" became "invasive".
  "Belongs here" became "native to". A succulent's best-known English name, a
  Dutch colonial slur for the Khoikhoi people, gave way to "highway ice plant".
  "Oriental bittersweet" became "Asian bittersweet".
- **An invasive is a problem because of what it does**, not where it's from. Most
  plants moved to a new place never spread at all.

French has its own trap. The app's name there is *indigène*, the legal status
of colonized people under the Code de l'indigénat until 1946, and still French
botany's everyday technical word. The obvious substitute, *autochtone*, is the
respectful word for Indigenous peoples, and lately the far right has borrowed it.
French gardeners mostly sidestep both: the national label is *Végétal local*.
[The Native page](https://indigene.app/native) has all of this, with sources,
including the scientists who argue the other side.

## Colonialism, concretely

The Garry oak meadows of the Pacific Northwest were kept open by Coast Salish
burning for centuries. When the burning was stopped, firs closed in. Much of
what settlers called wilderness was a garden whose gardeners had been killed or
removed, and genocide is the honest word for how that happened.

The app can't undo that, and I won't claim it does. What it can do is small and
specific. In Auckland, the everyday common names are the Māori ones, because
that's what people there call the plants. A plant's page says who tended it. And
the next part of the work is doing that properly.

## The elephant in the room: I built it with an LLM

Indigene was written with Claude, Anthropic's model. I'd rather say so here than
have it be the first comment. The cost is public on
[indigene.app/llm](https://indigene.app/llm), and every pull request reports its
own: at least $5,400 at API list prices over 110 working sessions as of
7 October, with the electricity and carbon estimated beside it.
<!-- Re-check the figures on /llm the morning this goes out. -->

What I can defend is the design that bill paid for:

- **No LLM when you use it.** Every answer is looked up in lists made in advance,
  and your phone does the sums.
- **No server of its own.** A first visit downloads about half a megabyte, and
  then it works offline.
- **Facts rechecked without an LLM.** Plain scripts ask GBIF, VASCAN, the EPA and
  the national floras, on a schedule, whether each claim still holds, and flag
  what changed.
- **MIT licensed**, so a land trust or a council can run its own copy without
  paying that bill again.

<!-- Add one honest example of something the model got wrong, and what caught it. -->

## What's next, and how to help

Today, a handful of plant pages mention the people who ate, wove or tended the
plant. I've started the sourcing for every North American region: USDA plant
guides cover about a third of our plants, and the gaps are real. Many old
sources say "Native Americans" without naming a nation, many are mostly
medicine, which only sends people out to dig, and some peoples have almost
nothing published by or about them.

- **Native plant societies:** look at your region's list and tell us what we got
  wrong.
- **Indigenous readers:** if your nation has a plant guide, a language resource
  or a person we should credit, tell us, on your terms.
- **Everyone else:** stand in your yard, or a vacant lot, and see what grows
  there.

[Indigene](https://indigene.app) ·
[Source on GitHub](https://github.com/olivierlacan/indigene) ·
[What it cost](https://indigene.app/llm) ·
[Native, not nativism](https://indigene.app/native)
