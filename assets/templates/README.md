# Front-End Templates (`assets/templates/`)

Real files, not markdown code blocks: step 6a copies what `docs/system-profile.md` selects and deletes
the rest. Shipping machinery the profile did not select is module drift (`references/common-mistakes.md` §6).
The prose rules for every template stay in the reference docs cited per file — a template without its
profile row is never pasted "to be safe".

## js/modules/*.js — Alpine component bodies

Each file is the body of one `Alpine.data(...)` registration. Paste it into the project's
`components.js` inside the `alpine:init` listener, per the profile. **Never redefine `hash`, `session`,
or `readState` in a component file** — they live in the starter kernel
(`assets/starter/assets/js/components.js`) and are shared.

| File | Module | Depends on | Mount / rules |
|---|---|---|---|
| `search.js` | M1 | `hash()` kernel | `assets/templates/html/search.html` · `references/structure/components.md` §2 |
| `gate.js` | M2 | `hash()` + `session` kernel | `assets/templates/html/gate-a.html` / `gate-b.html` / `login-multi.html` · `references/structure/components.md` §3 |
| `access.js` | M3 | `session` kernel | `assets/templates/html/access-protected.html` · `references/structure/form-system.md` §3 |
| `staging.js` | M12 | — | inline mounts in the file's tail comments · `references/structure/components.md` §4 |
| `progress.js` | M7 | footer mount (skeleton footer slot) | `assets/templates/html/page-skeleton.html` · `references/structure/components.md` §6 · `references/guardrails.md` R13 |
| `read-state.js` | M14 | `readState` kernel | `assets/templates/html/read-entry.html` · `references/structure/form-device.md` §3–4 · `references/guardrails.md` R13 |
| `phone.js` | device class: phone | — | `assets/templates/html/phone-shell.html` + `assets/templates/css/phone.css` · `references/structure/form-device.md` §2 |

## html/*.html — mount shapes

`page-skeleton.html` is the uniform skeleton for every page (rules: `references/structure/base.md` §2).
The gate / search / access mounts are the component's host markup; keep the marker attributes
(`x-show="unlocked"`, `data-expect-hash`, `data-index`) exactly as written — they are what
`tools/check-solvable.mjs` and `tools/check-links.mjs` read.

## css/*.css — skins and shells

| File | Selected by | Content |
|---|---|---|
| `secret.css` | M5 | deep-layer skin: retunes the base.css custom properties + `body.secret` |
| `forbidden.css` | M6 | the forbidden-word full-page state (`body-forbidden`) |
| `phone.css` | device class: phone | status bar / app chrome / chat bubbles / grey line / phone frame |
| `chrome.css` | device class: browser-chrome | drawn address bar / tab strip / apparatus single page |

`base.css` and `surface.css` ship inside the starter (`assets/starter/assets/css/`) and are not duplicated
here. Every skin file retunes the same custom properties base.css reads (`--ink`, `--paper`, `--rule`,
`--accent`, …) — a project edits colors in the skin, never in the kernel CSS.
