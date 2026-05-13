# Mérida Hotel Design Explorations

Six website directions for two sister boutique hotels in Mérida, Yucatán:

- **Boutique by The Museo** — intimate 15-room hotel on Paseo de Montejo
- **Tree House Boutique Hotel** — adults-only 15-room hotel in Santa Ana; first Michelin Key in Mérida

Each property has three design variants:

| Variant | Anchor inspiration | Mode |
|---|---|---|
| V1 — Cinematic Immersive | The Largo (Porto) | Dark, full-bleed, refined |
| V2 — Editorial Magazine | Mas Girbau (Catalonia) | Light, paper-stock, drop caps + plates |
| V3 — Brutalist Art-Forward | Peter & Paul Hotel + Pan & Koffee | Catalog grid, mono microcopy, art-as-spine |

Each variant went through three rounds of adversarial refinement: visual hierarchy & typography, then narrative & copy voice, then motion & accessibility. Treehouse variants use curated property photography (28 images selected from 119); Boutique variants use locally-mirrored press selection.

The shared **Treehouse × SoHo Galleries** art collaboration is treated as a named section in every variant, with Tree House framed as the namesake venue.

## Structure

```
.
├── index.html              # Landing page linking all 6 variants
├── boutique/               # Boutique by The Museo
│   ├── v1/  v2/  v3/
│   └── shared/BRIEF.md     # Brand brief used by the build swarm
└── treehouse/              # Tree House Boutique Hotel
    ├── v1/  v2/  v3/
    ├── shared/BRIEF.md
    └── assets/             # 28 curated property photos + PHOTO_MANIFEST.md
```

Each variant folder contains `index.html`, `css/style.css`, `js/main.js`, an `assets/` folder of mirrored images, plus the round-by-round `CRITIQUE_R*.md` + `REVISION_R*.md` logs from the build swarm.

## Local preview

Open `index.html` directly or run a static server:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deployment

Deployed via GitHub Pages from the `main` branch root. Production URL is in the repo description.
