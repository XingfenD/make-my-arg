# Alpine Component Rules & Conventions

> Companion to `references/structure/base.md` (tree + skeleton). The canonical front-end code templates now
> ship as **real files under `assets/templates/`** (js/css/html — index: `assets/templates/README.md`);
> step 6a copies the profile-selected ones instead of transcribing code. This file keeps the *rules and
> conventions* the templates implement: keyword hash build (§1), search M1 (§2), gates M2 (§3), staging
> M12 (§4), reskin M5 (§5), progress M7 (§6). Required reading at steps 6 and 7. Rule IDs `(Rn)` cite
> references/guardrails.md.

## 1. Keyword Hash Build (tools/build-keywords.mjs)

One plaintext source per audience, hashed to one table per audience (R3). The public table is fetched by public pages and **must never contain a restricted-area URL** (default `internal/`; R8); the deep table is fetched only by deep pages. A `title` is the catalog entry the archive would print (issuing body + document type + number/date) — never a summary of the document's content (R9). This is the website form's convention (references/structure/form-website.md); a system form keeps a single index and lets the account matrix decide what a hit opens (references/structure/form-system.md §1) — access is never maintained in the JSON (R10).

The canonical implementation ships as **`assets/tools/build-keywords.mjs`** (copy it to `tools/`). Its contract:

- Discovers every `data/keywords*.src.json` and writes the matching `data/keywords*.json` beside it, so both the per-layer convention (`keywords.surface.src.json` → `keywords.surface.json`) and a single-table project (`keywords.src.json` → `keywords.json`) work with no configuration.
- Keys support `|`-separated synonym aliases. Values are `"url|title"`; the url is relative to `pages/`.
- Normalizes with `String(w).trim().toLowerCase()` → md5 → base64. This **must be byte-identical** to `tools/hash.mjs` and to the in-page `hash()` helper in the starter kernel; if you ever switch to async WebCrypto SHA-256, change all three sides together.
- De-duplicates by url within a hash bucket, so two aliases that normalize to the same hash never list a page twice.

Example source shape:

```json
{
  "前台|营业时间": ["news.html|焰溪镇供销社 营业时间公告"],
  "Margaret Holt": ["internal/s23-file.html|刑事侦查卷宗 087-J-03 · 询问笔录"]
}
```

At deployment, **do not ship the `.src.json` files** (add `data/*.src.json` to .gitignore or delete them after the build) (R3). `tools/check-links.mjs` also fails the deploy if a table whose name marks it as the public index (`data/keywords.surface*.json`) carries a restricted-area url (default `internal/`; R8).

## 2. Search Engine (`search` Component) — Three-State Feedback

Canonical code: **`assets/templates/js/modules/search.js`** (component body, depends on the kernel's
`hash()`) and **`assets/templates/html/search.html`** (mount markup). Registered in the project's
`components.js`; mounted by search.html as `<main x-data="search" data-index="data/keywords.surface.json">`
(a deep-page search points `data-index` at the deep table). The three states the mount renders: hit / miss /
forbidden, plus the empty prompt; the forbidden branch reads `data/forbidden.json` (M6) and shifts the whole
page (`body-forbidden`).

**Shared hash contract.** The in-page `hash()` lives in the starter kernel
(`assets/starter/assets/js/components.js`) and **must mirror `tools/build-keywords.mjs` exactly** (same
trim/lowercase normalization, same md5 + base64 output). Never redefine it in a component template.

**Layer scoping (required when the search module splits indexes, R8).** The component queries the index of the audience whose page mounts it: public pages carry `data-index="data/keywords.surface.json"`; deep pages carry `data-index="data/keywords.secret.json"`. A public keyword routes to a public page or to a gate — never straight into a restricted document. When the fiction lists entries the visitor may not open (container D's archive list), each one shows a plain locked notice or resolves to its gate; it never opens the document. Result titles are catalog entries, written the way the issuing body files the document (R9). System forms do not split indexes by audience; they keep one index and resolve each hit through the account matrix (`references/structure/form-system.md` §1, R10).

System containers replace this search hub with their own shells — desktop Spotlight `FILE_DATABASE`, the archive query form, cross-site links; see `references/structure/form-system.md` §4.

**New tabs vs. session state (required reading for system containers).** `target="_blank"` opens each result in a fresh tab, and a fresh tab gets a fresh `sessionStorage` — so a `data-access`-protected document opened this way reads as locked even though the player is "logged in" on the original tab. Any container that crosses an account login with new-tab results (container D's `query → results → archive` chain) must hold session state in a **session cookie** (shared across tabs, cleared when the browser closes), not per-tab `sessionStorage`; the kernel's `session` store is exactly that (§3). `check-solvable.mjs` models identities as one global set and cannot see per-tab isolation, so it reports green while the real browser fails — the step-8 cross-tab manual test is the only thing that catches this (tooling.md §3 item 7).

## 3. Password Gate (`gate` Component)

Canonical code: **`assets/templates/js/modules/gate.js`** (component body, depends on the kernel's `hash()`
and `session` store — never redefine `ACCESS_KEY` / `SKIN_KEY` / the cookie helper in the component; the
starter kernel carries the session-cookie implementation) and three mount shapes:

- **Shape A** — `assets/templates/html/gate-a.html`: navigate away on success (`data-next`, `data-fail-hint`).
- **Shape B** — `assets/templates/html/gate-b.html`: unlock in place, no navigation. The post-gate block MUST open with `x-show="unlocked"` (or `<template x-if="unlocked">`): `tools/check-solvable.mjs` keys on that marker to know which text is readable before the gate and which only becomes readable after it.
- **Shape C** — `assets/templates/html/login-multi.html`: session login + per-account access (system containers B/C/D): `data-grant` on the login gate, `data-access` on the protected page, no privilege ladder (R10). The full pattern lives in `references/structure/form-system.md` §2–§3; the body reads `data-grants` (account→identity JSON map) first and falls back to the flat `data-grant` list.

One component, three shapes, plus one declared wildcard: `data-expect-any` marks a narrative gate whose
answer is not verified by design — any non-empty value passes, so the walk never hunts a hash for it
(`references/structure/form-device.md` §4). `data-expect-hash` sits on **each `<input>`** (comma-separated values = synonyms
accepted for that field, so a Chinese name and its pinyin both open the same lock); the rest of the
configuration sits on the **component root** (`<main>`), not on the `<form>`.

`hash()` is the shared helper from §2. When designing a gate, enforce the **credential triad**: the account is hidden on page A, the password clue on page B (requiring inference: zodiac year → 1977, child-photo date → 20201125), and the gate on page C. Hashing keeps plaintext out of casual view in the source (R3).

A credential may be **derived/composite** — an account assembled from parts (pinyin initials + license-year), never printed whole. `check-solvable.mjs` only matches a value that appears *verbatim* in a readable page, so it cannot prove a derived credential solvable and will report the gate STUCK. **Never print the credential to turn it green** — that leaks it to every visitor (a static site has no server auth; client-side masking is not privacy, R12) and collapses the puzzle. Declare the value, its composition rule, and its public-page components in `data/credentials.src.json` and prove it with `tools/check-credentials.mjs` (parts + rule + zero-plaintext); prove reachability-given-the-credential with `tools/check-reachability.mjs`. See tooling.md §1 and §3.

Gate design rules:

- **Failure hints point at the source obliquely and stop (R4).** `密码错误 🎂` passes; naming a page, restating the derivation, or spelling the field's content fails; a bare "error" is prohibited.
- **Inputs name the field only (R4).** `placeholder="Employee ID"` / `工号` pass; `placeholder="e.g. 1977"` leaks. The derivation rule stays off the gate page; the *account format* may be posted there.
- **Multi-field gates** are several `data-expect-hash` inputs; all must match. A gate page's own body is unreadable until the gate passes — a clue parked in its own `x-show="unlocked"` block is not counted before unlock, exactly the boundary the check models.
- **A wildcard gate is declared, never implied.** A gate that asks for no verifiable secret (an emotional input-and-pass ritual) marks its input `data-expect-any`; an unmarked input on a gate-mounted page raises the `check-solvable.mjs` NOTE and stays a leak class (workflow/05 Q4).
- **Session state is technical, not copy.** Accounts live in a **session cookie** (cross-tab, cleared on browser close; never per-tab `sessionStorage` behind `target="_blank"` results), and the site does not explain its storage to the player (`references/structure/form-system.md` §6). Progress and read-state storage follow the profile's state contract (R13; `references/structure/form-device.md` §3).

## 4. Staging Components (Lifecycle-Managed)

Canonical code: **`assets/templates/js/modules/staging.js`** — `blackout` / `typewriter` / `reveal`, each
with its mount shape in the file's tail comments. All timers and observers are registered in `init()` and
released in `destroy()`, so staged effects survive or die with their component.

## 5. Optional: Layer Reskin (M5; base.css Conventions)

The shared layout and the document-realism classes live in **`assets/starter/assets/css/base.css`** (the
invariant kernel CSS: sticky opaque header, `.sheet` document kit, gate form, entry shell). The deep-layer
skin template is **`assets/templates/css/secret.css`** — it retunes the custom properties base.css reads
(`--ink` / `--paper` / `--rule` / `--accent` / `--stamp` / `--bar` …) so the whole page shifts together when
deep pages link it (or when `session.skin()` applies `body.secret`). Texture classes other docs cite:
`.hidden-text` (black-on-black revealed by selection), `.blurred` (redaction as a clue), `.handwrite`,
`.spacer`. Client-side masking is not privacy — anything hidden this way is public (R12).

## 6. Optional: Collection Progress (`progress` Component)

Canonical code: **`assets/templates/js/modules/progress.js`**, mounted on the shared footer; `<body data-page data-total>` carries the numbering. The storage question follows the profile's state contract (references/guardrails.md R13, detail references/structure/form-device.md §3): progress persists ONLY when the profile records `persistent` (a player-owned device or a fiction that really saves). With `progress: session`, swap localStorage for sessionStorage; with `progress: none`, the module itself is out of the game. Login state is never here — it lives in the session cookie (§3), never localStorage.

World-response state (M14: an entry appears only after a page was read) is the sibling mechanism —
`readState` store in the starter kernel, `assets/templates/js/modules/read-state.js` (`markRead` mount on
the source page) plus the `data-after` attribute on the entry anchor (`assets/templates/html/read-entry.html`),
rules in `references/structure/form-device.md` §3–§4; the attribute is what the checkers walk, the JS is what the player sees.
