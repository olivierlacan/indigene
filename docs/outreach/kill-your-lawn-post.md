# Kill your lawn: Instagram template

The Halloween post at [indigene.app/kill-your-lawn](https://indigene.app/kill-your-lawn).
Images are drawn from the app's own words and drawing, so they can't drift from
the page:

```sh
cd app
node scripts/gen-story.mjs kill-your-lawn --feed            # feed post, 1080×1350
node scripts/gen-story.mjs kill-your-lawn                   # story, 1080×1920
node scripts/gen-story.mjs kill-your-lawn --feed --lang fr  # French versions
node scripts/gen-story.mjs kill-your-lawn --lang fr
```

| Feed post | Story |
|---|---|
| <img src="post-kill-your-lawn.png" width="300"> | <img src="story-kill-your-lawn.png" width="240"> |

**When:** 31 October, morning. The story goes up the same day with a link
sticker in the clear band under the text.

## Feed caption (English)

> Your lawn is already a zombie. 🧟
>
> It looks alive, feeds almost nothing, and drinks: an American household uses
> more water outdoors than for showers and laundry together.
>
> This Halloween, bury it. Cardboard, wood chips, wait for spring. Then plant
> what feeds the caterpillars, bees and birds: wildflowers, shrubs, trees, and
> evergreens for the dead of winter.
>
> Easy natives for your region: link in bio → indigene.app/kill-your-lawn
>
> 🕸️ And keep the fake cobwebs indoors. They trap songbirds, owls and real
> spiders.
>
> #KillYourLawn #NativePlants #Halloween #SheetMulching #HomegrownNationalPark #NoMowMay

## Légende (français)

> Votre pelouse est déjà un zombie. 🧟
>
> Elle a l'air vivante, ne nourrit presque rien, et elle boit.
>
> Pour Halloween, enterrez-la : du carton, des copeaux, et attendez le
> printemps. Puis plantez ce qui nourrit chenilles, abeilles et oiseaux :
> fleurs sauvages, arbustes, arbres, et des persistants pour le cœur de l'hiver.
>
> Des plantes indigènes faciles pour votre région : lien en bio →
> indigene.app/kill-your-lawn
>
> 🕸️ Et gardez les fausses toiles d'araignée à l'intérieur : elles piègent
> passereaux, chouettes et vraies araignées.
>
> #TuezVotrePelouse #PlantesIndigènes #Halloween #Paillage #JardinSauvage

## Alt text

> A dark card titled "Kill your lawn", Halloween, October 31, 2026. A drawing:
> under a crescent moon and two bats, a flat strip of lawn holds a headstone
> and a jack-o'-lantern; beside it grow goldenrod, purple asters, a pine, and a
> spider on its web.

## Notes

- Every figure in the caption is on the page with its source (EPA WaterSense
  for the water; Will County Forest Preserve for the webs). Don't add one that
  isn't.
- The US water figure doesn't hold for every reader. The French caption leaves
  it out rather than borrow an American number.
- Keep the joke to the first line. The rest is the how-to.
