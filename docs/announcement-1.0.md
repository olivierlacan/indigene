# Indigene 1.0

**Stand in a spot. Get the native plants that will actually live there, ranked
by what they feed, with every number traceable to somebody else.** No account,
no app store, works with no signal — [indigene.app](https://indigene.app).

Most gardens are green and nearly lifeless. Lawn, and shrubs from other
continents, look fine and feed almost nothing. The caterpillars that nearly
every baby songbird is raised on can only eat the plants they evolved alongside,
so no native plants means no caterpillars, which means no baby birds. That
subtraction is happening across whole countries at once, one tidy garden at a
time.

The remedy is unusually cheap and unusually fast. Plant one native and the food
web restarts the same season. What was missing was never the will. It was a
straight answer to *what should I plant here, in this actual corner*, that
didn't require you to already speak the language of plant catalogues.

Indigene is that answer, and nothing else.

## What it does

Stand where you want to plant. The app takes your coordinates, looks up the soil
and climate for that exact point, works out how much sun that corner actually
gets — with the camera and compass if you want, with a three-way picker if you
don't — and asks what the spot is *for*. Then it hands you a ranked list of
plants native to your ecoregion that fit that spot: how big each one really gets
at one, three, five and ten years, which animals it feeds and how much they
depend on it, and where every figure came from.

It runs in a browser, installs to a home screen, and works with no connection,
which is what the far end of a garden usually has. Saved spots stay on your
device — there's no server for them to go to — and Settings will write them to a
plain file you keep. It's MIT licensed, there's no company behind it, and
there's nothing to buy.

Nine regions today, across two continents: the Mid-Atlantic, the Pacific
Northwest, Southern California, north and south Florida, and all four
biogeographical regions of metropolitan France. 325 plants, 82 named animals,
and 574 sourced relationships between them.

## Who it's for

People who are not experts and shouldn't have to become experts first.
Beginners who have never heard "part shade" or "keystone species." Guerrilla
gardeners who get one shot with no aftercare and need to be told plainly what
survives alone. Older gardeners new to natives, who deserve "here's what this
does for you" instead of ideology.

And people whose land isn't a yard. A balcony on a rented flat. Two square
metres of a community garden. The strip of dirt between the sidewalk and the
street that the city mows twice a year. Habitat doesn't care about deed lines,
and the app doesn't either.

## What it isn't

There are good apps for running a garden — what you watered, what's blooming,
what to do next weekend. There are good apps for pointing a camera at a leaf and
getting a name back. There are excellent platforms for recording what you saw
and where, and they are the backbone of modern ecology. Indigene is built on one
of those, which I'll come back to.

Indigene isn't any of those and doesn't want to be. Each of them starts from
something that already exists: a plant you own, a plant you found, a plant you
observed. Indigene starts from bare ground and one question — what belongs here,
and what would it feed?

That's the whole product, and it's why there's no identification, no care
diary, no reminders, no feed, no marketplace. Those are other people's apps,
done better there, and every one of them would blur the only question this one
answers.

## There is no AI in the answers

Nothing in a recommendation is a model output. The ranking is arithmetic over
boring public data: soil grids, weather records, elevation, ecoregion
boundaries, published caterpillar host counts, herbarium and flora records,
propagation protocols out of forestry handbooks, and observation records
contributed by people who went outside and wrote down what they saw.

Every figure is labelled with how firm it is — counted, calculated, or
estimated — and every plant carries its sources. There's a page that names the
numbers I'd challenge first, including my own scoring. Where a plant has no
French name in any national reference list, the app shows the Latin, because
inventing a plausible-sounding one is precisely the failure this thing is built
to avoid.

None of that is a feat of engineering. It's the unglamorous half: reading
licences, reconciling names across sources that disagree, and refusing to fill
a gap.

## What we owe iNaturalist

That claim has a name behind it, and it should be said plainly rather than left
in a licence table. A great deal of what makes Indigene trustworthy was built by
[iNaturalist](https://www.inaturalist.org/) and the people who use it.

Five things in the app lean on it. The photographs of a plant growing near you
are theirs — real specimens somebody stood in front of, not my drawings. So are
the sightings on an animal's page. The line telling you a plant is seldom
recorded around here is two of their counts, one for the plant and one for every
plant, so the figure means something in a quiet county and in central London
alike. When I check whether a candidate is genuinely native to a region rather
than a garden escape that settled in, I'm reading their per-place establishment
records. And when a plant page names the impostor it gets confused with, the
evidence that people *actually* make that mistake is their identification
history — a record no expert database publishes, because it isn't a fact about a
plant. It's a fact about us.

None of that is scraped, and none of it is clever. It exists because a great
many people went outside, photographed something, and — the part that matters —
other people confirmed the identification. "Research grade" means a community
agreed, not that a model guessed. Those confirmed records then flow onward into
GBIF, so the occurrence counts underneath our region work are partly the same
people's labour reaching us a second time.

That is the better part of two decades of unglamorous infrastructure and
volunteer identification, given away for nothing, and wiring it in took me a few
days. The least the debt deserves is care with it: every photo Indigene shows
carries its observer and its licence and links back to the original record,
anything marked all rights reserved is dropped rather than displayed, and the
app asks about a plant once per area and caches the answer instead of hammering
a free service that owes me nothing.

## Where this comes from

I've been gardening since I was a child in my mother's garden in Normandy. When
I bought my first house in Orlando in 2019 it came with the standard Florida
dead yard — St. Augustine grass, a few clipped exotics, and almost nothing
living in it. By the time I left in 2025 it was loud. That conversion took me
six years and a lot of reading I shouldn't have had to do. Making it repeatable,
and much less laborious, is the point of the app.

The other half of this is data work. In 2020 I worked on the COVID Tracking
Project, digging through Florida's case reporting and, with Rebecca Glassman,
writing up [what that state's numbers did and didn't
say](https://covidtracking.com/analysis-updates/florida-covid-19-data/) — then
working with Florida journalists that summer to push for hospital data the state
wasn't releasing.

That taught me the thing Indigene is built on. The hard part is almost never the
analysis. It's establishing what a source actually says, what it doesn't, and
being willing to publish both.

## About the Claude Code in the room

I built Indigene with Claude Code — Opus 4.8, then Opus 5. Nearly all of the
code, and most of the data assembly.

I'm not going to pretend that's free. These models cost energy and water at a
scale I don't control and can't fully account for, and "my use of it was
worthwhile" is what everyone says. So here's what I can actually point at
instead.

What came out is a static site of about 418 KB. No server, no account, no
analytics, nothing sold, and no model anywhere in the running app — once it's on
your phone it works in a field with no signal and calls nothing home. All of it
is public and MIT: the data, the scripts, the checks. Every claim cites a source
you can go read. And the machinery that keeps it honest runs without an LLM: a
type that won't compile if a plant-and-animal relationship is missing its
source, a scheduled job that re-asks the French national reference whether our
plant names are still its plant names, a check that fails a release note for
being too long.

That's the bet. Use the expensive tool to build cheap, durable systems —
pipelines, audits, tests — that go on working without it, so the project needs
less of this over time rather than more. Whether that holds will be visible in
the repository, which is most of why the repository is public.

And the plain part: a few weeks got me where months of full-time work would
have, and I do not have months of full-time. Without it this would still be a
note in a file.

## What 1.0 means

Not finished. It means the shape has stopped moving: the flow, the honesty
rules, the data model, the way a region gets added. What comes next is mostly
more ground — the rest of the West Coast, more of Europe, county-level native
status — on the same backbone.

The plant lists are starter lists, not the complete flora of anywhere, and the
regions are not equally well sourced. The app says so itself, on its own
[sources page](https://indigene.app/sources).

## Corrections wanted

The most useful thing you can send me is a correction with a source behind it.
Everything — the plant data, the scripts, every line that turns a number into a
recommendation — is at
[github.com/olivierlacan/indigene](https://github.com/olivierlacan/indigene).
Asking for your own region is welcome too. That's how the map grows.

## Thanks

Joey Santore, whose *Crime Pays But Botany Doesn't* has done more to make people
care about a roadside plant than any interpretive sign ever has. The Florida
Native Plant Society, and the native plant societies everywhere else, doing this
with volunteers and folding tables for decades before anyone made an app about
it. Doug Tallamy and the researchers whose host-plant counts make any of this
countable. And the people who keep the unfashionable machinery running — the
herbaria, the national inventories, the extension offices writing the bulletin
on how to tell a native from the thing that looks like it.
