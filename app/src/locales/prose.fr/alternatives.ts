// The ornamentals a native stands in for — `data/alternatives.ts`, the French
// side.
//
// An ornamental is a taxon like any other, keyed on its scientific name. It
// carries the three catalogue paragraphs the page opens with — what it's
// planted for (`altRole`), where it's really from (`altOrigin`) and what it is
// (`altBlurb`) — plus, under `alternativeNotes`, the writing for each swap:
// keyed by the *native* plant's id, the sentence on why the native does the job
// (`why`) and the two-sided water/disease/wildlife comparison (`edges`).
//
// **Ornamentals that are also look-alikes live in `lookalikes.ts`, not here.**
// Cherry laurel, butterfly bush and Chinese silvergrass are impostors too, and
// `lib/prose.ts` gives a taxon exactly one key — so their `altRole`/`altOrigin`/
// `altBlurb`/`alternativeNotes` sit beside their look-alike paragraphs there, to
// avoid two entries under one key silently overwriting each other. This file is
// only the ornamentals that appear *nowhere else*.
//
// Region by region, as the English is translated. So far: Atlantic France.
import type { ProseTable } from "../../lib/prose";

export const ALTERNATIVES_FR: ProseTable = {
  "Hosta": {
    altRole: "Touffe de feuillage pour l'ombre",
    altOrigin: "Indigène d'Asie de l'Est ; le feuillage par défaut des coins ombragés.",
    altBlurb:
      "La touffe de grandes feuilles qu'on met à l'ombre par défaut — et le plat préféré des limaces, si bien qu'elle finit souvent l'été criblée de trous. Rien d'indigène n'y élève sa descendance : c'est de la verdure, et rien que de la verdure.",
    alternativeNotes: {
      "dryopteris-filix-mas": {
        why: "Pour une grande touffe pleine d'allure à l'ombre, la fougère mâle déroule de hautes frondes arquées qui tiennent la moitié de l'hiver — bien plus de présence qu'un hosta, et pas un trou de limace.",
        edges: [
          { axis: "care", native: "Vigoureuse, presque persistante et dédaignée des limaces à l'ombre sèche.", ornamental: "Déchiquetée par les limaces dès la mi-été." },
          { axis: "wildlife", native: "Un abri pour la petite vie du jardin ombragé.", ornamental: "Rien d'indigène ne la mange." },
        ],
      },
      "asplenium-scolopendrium": {
        why: "Pour des lanières persistantes et lustrées qui éclairent un coin sombre, la scolopendre garde son éclat toute l'année là où un hosta disparaît jusqu'à la terre nue.",
        edges: [
          { axis: "care", native: "Persistante, dédaignée des limaces et heureuse à l'ombre profonde.", ornamental: "Une cible pour les limaces, disparue en hiver." },
          { axis: "wildlife", native: "Un abri pour la petite vie des murs et de l'ombre.", ornamental: "Peu d'intérêt pour la faune indigène." },
        ],
      },
    },
  },
  "Rosa hybrids": {
    altRole: "Rosier de massif / à fleurs",
    altOrigin: "Des hybrides horticoles, sélectionnés depuis des siècles pour la fleur.",
    altBlurb:
      "Le rosier de massif acheté pour la floraison, et la floraison est à peu près tout ce qu'il donne : gourmand en eau, sujet à la maladie des taches noires et au traitement qui va avec, et — quand la fleur est bien double — si serré qu'une abeille n'en atteint pas le cœur.",
    alternativeNotes: {
      "rosa-arvensis": {
        why: "Pour un rosier arbustif grimpant et parfumé, le rosier des champs offre des fleurs simples et blanches où les abeilles plongent, puis des cynorhodons rouges pour les oiseaux — un indigène des haies qui n'a jamais besoin des traitements dont vit un rosier hybride.",
        edges: [
          { axis: "disease", native: "Un indigène robuste qui ignore les taches noires et l'oïdium des rosiers de jardin.", ornamental: "Sujet aux taches noires et à l'oïdium ; maintenu à coups de traitements." },
          { axis: "wildlife", native: "Ses fleurs ouvertes nourrissent les abeilles ; ses cynorhodons, les oiseaux d'hiver ; hôte de bien des papillons de nuit.", ornamental: "Les fleurs doubles ferment la porte aux pollinisateurs ; peu d'intérêt pour la faune." },
        ],
      },
    },
  },
  "Rhododendron ponticum": {
    altRole: "Écran persistant à fleurs",
    altOrigin: "Indigène de la péninsule Ibérique et des rivages de la mer Noire.",
    altBlurb:
      "Vendu pour son mur de fleurs pourpres au printemps, et l'un des grands envahisseurs de la façade atlantique : il fait une ombre si dense et une litière si toxique que rien ne pousse dessous, et son nectar est un poison pour l'abeille domestique.",
    alternativeNotes: {
      "ilex-aquifolium": {
        why: "Pour un écran persistant qui fleurit et nourrit, le houx indigène dresse un mur dense, lustré et riche en vie — là où le rhododendron pontique empoisonne le sol dessous et les abeilles dessus.",
        edges: [
          { axis: "disease", native: "Laisse vivre un sous-étage à son pied.", ornamental: "Litière toxique et ombre : le sol reste nu, et son nectar empoisonne l'abeille domestique." },
          { axis: "wildlife", native: "Ses baies nourrissent les grives d'hiver ; hôte de l'azuré du houx.", ornamental: "L'un des pires envahisseurs de l'Ouest atlantique ; un désert pour la faune à son pied." },
        ],
      },
      "crataegus-monogyna": {
        why: "Pour un écran fleuri, l'aubépine se couvre de blanc en mai puis rougeoie de cenelles à l'automne — la haie nourricière par excellence, là où le rhododendron offre un seul spectacle et prend le bois.",
        edges: [
          { axis: "water", native: "Parfaitement autonome une fois installée.", ornamental: "Un envahisseur d'ombre qui laisse un sol empoisonné." },
          { axis: "wildlife", native: "Nourrit des centaines d'espèces d'insectes ; ses cenelles nourrissent les oiseaux d'hiver.", ornamental: "Ne nourrit presque rien, et son nectar est toxique pour les abeilles." },
        ],
      },
    },
  },
  "Platanus × hispanica": {
    altRole: "Grand arbre d'alignement / de parc",
    altOrigin: "Un hybride horticole, planté le long des rues du monde entier.",
    altBlurb:
      "Le géant à l'écorce marbrée qui borde les avenues. Il encaisse le pavé et la pollution et donne une vraie ombre — mais il ne nourrit presque rien ici, lâche des poils urticants et un pollen lourd, allergène notoire, et attrape l'anthracnose année après année.",
    alternativeNotes: {
      "quercus-robur": {
        why: "Pour un grand arbre de parc ou d'alignement, le chêne pédonculé est celui qu'on plante à la place du platane : l'arbre lent, immense et millénaire qui porte plus de vie que tout autre en Europe.",
        edges: [
          { axis: "wildlife", native: "Hôte d'environ 400 espèces de chenilles — le réseau nourricier le plus riche de nos arbres ; ses glands nourrissent geais et mammifères.", ornamental: "Ne nourrit presque rien d'indigène." },
          { axis: "disease", native: "Célèbre pour sa longévité et sa solidité.", ornamental: "Anthracnose à répétition ; un pollen lourd et allergène." },
        ],
      },
    },
  },
  "Salix babylonica": {
    altRole: "Arbre isolé de bord d'eau / de pelouse",
    altOrigin: "Indigène du nord de la Chine ; planté au bord de l'eau partout dans le monde.",
    altBlurb:
      "Le rideau vert pleureur au bord de la mare. Il pousse vite et fait romantique — puis ses racines avides trouvent chaque drain et chaque canalisation, ses branches cassantes tombent aux tempêtes, et il est le plus souvent creux et pourri avant quarante ans.",
    alternativeNotes: {
      "salix-caprea": {
        why: "Pour un indigène rapide au bord de l'eau, le saule marsault sort les chatons argentés de la fin de l'hiver qui nourrissent les premières abeilles — là où le saule pleureur ne trouve que les canalisations.",
        edges: [
          { axis: "wildlife", native: "Hôte d'environ 370 espèces de chenilles ; ses chatons précoces sont une source de pollen vitale.", ornamental: "Nourrit peu d'indigène." },
          { axis: "disease", native: "Un indigène robuste et adaptable.", ornamental: "Des racines avides qui ravagent les drains ; cassant et de courte vie." },
        ],
      },
      "populus-tremula": {
        why: "Pour un grand arbre plein de lumière et de mouvement, le tremble frémit au moindre souffle et vire à l'or en automne — une espèce clé des bois d'Europe, non un fardeau au bord de la mare.",
        edges: [
          { axis: "wildlife", native: "Hôte d'environ 260 espèces de chenilles ; un pilier de la vie des bois.", ornamental: "Nourrit peu d'indigène." },
          { axis: "disease", native: "Un pionnier indigène vigoureux.", ornamental: "Cherche les drains, cassant et creux en quelques décennies." },
        ],
      },
    },
  },
  "Prunus serrulata": {
    altRole: "Arbre d'ornement à floraison printanière",
    altOrigin: "Indigène du Japon, de Corée et de Chine ; le cerisier des fêtes des fleurs.",
    altBlurb:
      "Quinze jours d'écume rose au printemps, puis un arbre qui ne donne plus grand-chose — de courte vie, sujet au chancre et à la pourriture, et hôte de presque aucune des chenilles dont nos oiseaux nourrissent leurs petits.",
    alternativeNotes: {
      "prunus-avium": {
        why: "Pour une floraison printanière qui nourrit le bois, le merisier suspend des nuages de fleurs blanches puis des fruits sombres que les oiseaux emportent — et devient un vrai arbre là où le cerisier d'ornement est épuisé en vingt ans.",
        edges: [
          { axis: "wildlife", native: "Hôte d'environ 300 espèces de chenilles ; ses fruits nourrissent oiseaux et mammifères.", ornamental: "N'élève presque aucune génération d'insectes." },
          { axis: "disease", native: "Un indigène vigoureux et de longue vie.", ornamental: "De courte vie, sujet au chancre et à la pourriture." },
        ],
      },
      "prunus-spinosa": {
        why: "Pour une floraison à plus petite et plus rude échelle, le prunellier moutonne de blanc sur ses rameaux noirs et nus dès le premier printemps, puis garde ses prunelles jusqu'à l'hiver — l'arbre de haie que le cerisier d'ornement ne fait qu'imiter.",
        edges: [
          { axis: "wildlife", native: "Hôte d'environ 300 espèces de chenilles ; fleurs pour les premières abeilles, prunelles pour les oiseaux d'hiver.", ornamental: "N'élève presque aucun insecte indigène." },
          { axis: "water", native: "Parfaitement autonome une fois installé.", ornamental: "De courte vie et sujet aux maladies." },
        ],
      },
    },
  },
};
