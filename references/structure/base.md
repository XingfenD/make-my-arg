# Front-End Base (Shared Across Containers; a Single index.html Is Prohibited)

> Pure static, no build step: HTML + CSS + Alpine.js v3 core (vendored locally; no plugins, no runtime CDN).
> The Node tools are optional, dependency-free, and run on built-ins. Runs on any static host (GitHub Pages
> preferred). This file covers the directory tree (§1) and the page skeleton (§2). The Alpine component
> canonical code ships as files under `assets/templates/` (index: `assets/templates/README.md`) and the rules they implement in `references/structure/components.md`; check cadence, shared config, and
> manual methods in `references/structure/tooling.md`.

## 1. Directory Structure

Module marks (M1…M14) come from `references/design-playbook.md` §2 and appear only when selected in
`docs/system-profile.md`; everything else belongs to the base.

```
<game-name>/
├── index.html                    # Entry page (M9): role assignment + start button + the link back to the skill repo (keep it); rules only where the fiction needs them
├── search.html                   # M1 search module
├── pages/
│   ├── home.html  menu.html  news.html …      # public pages, flat until the fiction needs sections
│   └── internal/                 # restricted area — name it with the fiction's own word (staff/ archive/ members/),
│       │                         # never "secret"; filenames must not spoil. Point CONFIG.secretUrl here (tooling.md §2).
│       └── s19-record.html  s23-diary.html …
├── assets/
│   ├── css/
│   │   ├── base.css              # shared layout skeleton, document realism kit, x-cloak
│   │   ├── surface.css           # public skin
│   │   ├── secret.css            # M5 layer-reskin module
│   │   ├── phone.css             # device class phone chrome (template: assets/templates/css/phone.css)
│   │   └── chrome.css            # drawn address bar (template: assets/templates/css/chrome.css)
│   ├── js/
│   │   ├── components.js         # Alpine components (search / gate / access / staging / progress), registered on alpine:init
│   │   └── vendor/
│   │       └── alpine.min.js     # Alpine v3 core, pinned (vendored once via tools/vendor-alpine.mjs; never edited; no plugins)
│   └── img/  audio/  docs/       # Images, audio puzzles, downloadable mock documents (pdf/xlsx)
├── data/
│   ├── keywords.surface.src.json # Plaintext public index (development only; excluded from the deploy tree)
│   ├── keywords.secret.src.json  # Plaintext deep index (development only; excluded from the deploy tree)
│   ├── keywords.surface.json     # Public hash table — must contain no restricted-area URL (R8)
│   ├── keywords.secret.json      # Deep hash table, fetched only by deep pages
│   ├── forbidden.json            # M6 module (hashes + forbidden-state copy)
│   └── credentials.src.json      # M2 derived-credential provenance (development only)
├── tools/                        # the tool files copied from this skill's assets/tools/ at scaffold time
├── viewer/                       # the graph renderer tree copied at scaffold time (graph-viewer.html + css/ + js/); never a site page
├── .gitignore                    # ships inside assets/starter/: development by-products stay out of history
├── .dockerignore                 # ships inside assets/starter/: plaintext sources / docs / dev trees stay out of the image
└── README.md                     # How to run + GDD link + player notes
```

`tools/`, `viewer/`, `docs/` and `deploy/` hold no site page: the page-walking tools skip them (`CONFIG.skipDirs`,
`references/structure/tooling.md` §2), so a generated `docs/site-graph/` tree can never inflate the page count.

The tree is materialized by **`assets/starter/`**, the starting project every game is based on: it ships the
invariant files — the entry shell (carrying the link back to the skill repo), `base.css` + `surface.css`, the
`components.js` kernel, the two ignore files above, and the project README — so a project starts from a real
tree instead of an empty directory. Everything
module-marked or device-marked (`search.html`, `data/`, `secret.css`, `phone.css` / `chrome.css`, the restricted area, the ending pages — templates in `assets/templates/`) and the assembled
infrastructure (`tools/`, `viewer/`) are added at scaffold time per `docs/system-profile.md`
(`workflow/06-scaffold.md`). The starter therefore ships no `data/*.src.json`: its own `.gitignore` would ignore
them, and a plaintext table is created at 6a only when the profile selects the module that needs it.

Two ignore files come with the tree: they live in `assets/starter/` as `.gitignore` and `.dockerignore` (bodies:
those files; do not retype them here), so copying the starter lands both at the project root. They answer two
different questions and a project needs both:

- **`.gitignore`** — what must never enter history. Development by-products: the plaintext `data/*.src.json`
tables (the answer key, R3), the generated `docs/site-graph.{json,html}`, an agent's scratch `memory/`, editor
and OS junk. Everything the site publishes stays tracked (`index.html`, `pages/`, `assets/`, `data/*.json`,
`tools/`, `viewer/`, the `docs/*.md` artifacts).
- **`.dockerignore`** (or the deploy script's rsync exclude list) — what must never reach a visitor. Deploying a
static tree is a copy, so the same material is a second problem: the plaintext tables, the `docs/` artifacts
(the GDD and reachability chain are the whole game in prose), and the `tools/` `viewer/` `deploy/` machinery.
A plaintext source is listed in both files.

The tools ship under `assets/tools/` in this skill; scaffold copies them into `tools/` so the project stays
self-contained and re-runnable. They run on Node built-ins only (`node:crypto`, `node:fs`, `node:path`,
`node:child_process`) — no dependencies, no install step. The checkers import their assumptions from the shared
`tools/config.mjs`: a project that renames directories, layer names, or markers edits that one file instead of
rewriting a checker (`references/structure/tooling.md` §2 lists the knobs, its section 3 the methods no static
check replaces). Keyword tables are auto-discovered, so the per-layer convention above and a single-table project both
work with zero configuration. Re-run the checks after every content edit, not just before deploy — the canonical
pass/fail checklist is `workflow/08-self-check.md`.

Vendor the Alpine runtime once at scaffold time (the script pins the version and verifies the sha256 before
writing the file, which is then committed with the game):

```bash
node tools/vendor-alpine.mjs      # writes assets/js/vendor/alpine.min.js (alpinejs@3.17.3, checksum-verified)
```

The tree above is the shared base; the form docs adapt the pages and the reach model:

- **Container A — fake official website**: `references/structure/form-website.md` — search hub, audience-scoped indexes, gates.
- **Containers B/C/D — system fictions**: `references/structure/form-system.md` — account login, per-account access (RBAC-style), and the desktop / simulated-internet / archive shells. A system project's page root may be `apps/` instead of `pages/`; set `pagesDir` once in `tools/config.mjs` (tooling.md §2).
- **Device, state, apparatus**: `references/structure/form-device.md` — shell components per device class, the R13 state contract (progress / world-response storage), the apparatus single-page carve-out.

## 2. Page Skeleton Template (uniform across pages)

Canonical file: **`assets/templates/html/page-skeleton.html`** — 6b copies it per page, so the head,
script order, and the skin links never drift from this description.

**Persistent top bar** — every page's header (same for container B's top menu bar) is fixed to the top
of the viewport and does not leave view on long pages (base.css gives `position: sticky; top: 0` + an opaque
background site-wide, deep pages included); the header carries that organization's own nav links, which together
with the footer's own links (and the M1 search box when selected) are the only cross-page links a public page
carries (R7). Every `<input>` placeholder names its field (`Search...`, `Employee ID`) (R4). Every page loads the
same two scripts in the same order (`components.js` before the Alpine runtime) and carries no inline behavior
wiring — behavior lives in `x-data` components. Deep-page footers may use anomalous numbers such as `ex/36` or
`?/36` (M7); the `[This content has been deleted]` placeholder is a valid narrative element.
