# Step 2 — Choose the Form and Assemble the System

Stays with the orchestrator: this step asks the user, then writes `docs/system-profile.md`. The form is one
decision bundle — five axes answered together, because each axis changes what steps 3–7 build: the device class
picks the shell components, the technical form picks the checker model, the state contract decides what may
persist and how an unlock is proved, the era fixes the texture kit. Recommend per axis, ask once and wait for
the decision; a change requested at a later step returns here before scaffolding (R12).

**Input:** `docs/story-canon.md`. **Output:** `docs/system-profile.md` — the assembly record every later
step reads. It carries no plot.

## 1. Axis 1 — the narrative container

Unless the user has already specified a format, guide them through the four containers below plus a
recommendation based on the story's traits, listed first and marked "(recommended)".

| Container | Player fantasy | Central interaction | Routing conditions (story traits) |
|---|---|---|---|
| **A Fake official website** | "I'm hacking into an organization's website." | The site's own IA plus the modules selected below | A single organization is the stage (restaurant / company / school / church); the secret hides in pages that should stay private; a missing-person or cover-up investigation |
| **B Fake computer desktop** | "I've obtained someone else's device — a desktop or a phone." | Device shell + app pages (chat / email / cloud drive / calendar) | A viewpoint character can plausibly access someone's device; clues scatter across multiple "apps"; progression depends on dense password gates |
| **C Simulated internet** | "I'm doing internet archaeology on a vanished person." | Multiple independent "websites" (forum / blog / Wayback Machine / intranet) cross-linked, with hand-typed URLs | A long time span (years of diaries / yearly blogs); clues spread across platforms; the fiction can break the fourth wall |
| **D Archive system** | "I'm opening a sealed case file." | Query form (name / ID / date) → archive list → detail pages, each opening only to the account it names | The story is primarily document-driven (case files / medical records / interrogation transcripts / household registry); cold bureaucratic narration; the investigator is a police officer / journalist / lawyer |

**Routing order.** Primary information carrier: chat logs and files → B; documents and archives → D; website
pages → A; cross-platform fragments → C. The player's narrative role must plausibly access the container — if
not, add an entry page explaining how it was obtained (borrowed / inherited / hacked / officially requested).
Mixing is allowed: one secondary container may nest inside the primary; nesting depth is one level.

**The medium argues the theme (axis 1 closes with one sentence, recorded in the profile).** Answer: what does
this container say *by being this container*? A script-fiction venue that receives real case material; a
fake browser whose every page the player "browses" was fabricated for them; a frozen 2007 site whose
stillness is the disappearance. A container picked only to "fit the plot" is a costume — if no sentence
emerges, reconsider the choice before the GDD inherits the mismatch.

## 2. Axis 2 — the device class

The container decides whose system this is; the device class decides what the player's eye sees. A system
fiction rendered with no device class reads as a plain website wearing a label.

| Device class | The look the player expects | Typical containers | Reference |
|---|---|---|---|
| **phone** | status bar, unread badges, chat bubbles, lock screen, "对方已关机" grey line | B mobile variant; C app-site | `references/structure/form-device.md` §2 |
| **desktop** | window chrome, icon grid, dock, OS login | B desktop variant | `references/structure/form-system.md` §4 + `references/structure/form-device.md` §2 |
| **browser-chrome** | an in-fiction address bar / tab strip / Wayback box; hand-typed URLs are the prop | A; C archaeology; D terminal | `references/structure/form-device.md` §2 |
| **pure-web** | the site is what it looks like | A; D web query | `references/structure/base.md` + container form doc |

The class fixes which shell components step 6a instantiates. Where axis 3 chooses the apparatus single-page,
browser-chrome is the usual partner — the chrome *is* the fiction (`references/structure/form-device.md` §5).

## 3. Axis 3 — the technical form

- **multi-page tree (default, R1).** Every narrative location is an independently openable HTML document.
- **chrome-as-apparatus single page (R1 exception via R12).** One HTML document whose drawn chrome is the
  fiction — a fake browser window, a frozen kiosk app. Permitted only when axis 1's sentence depends on the
  seamless single surface; the profile records what breaks and why the form serves the fiction. Convenience
  never earns it: "one file is easier" stays prohibited. Checker consequences: `references/structure/form-device.md` §5,
  `references/structure/tooling.md` §3 item 11.
- **encrypted-content tier (optional, R3).** Where the fiction needs privacy beyond hashed lookups — a
  private message that must not be greppable in the deployed tree — encrypt the payload (WebCrypto
  AES-GCM, PBKDF2 for the derived key) and assemble the key from life traces across pages. The hash table
  stays the baseline tier; this tier is selected, not assumed.

## 4. Axis 4 — the state contract

Three state families, each with its own storage answer (canonical: `references/guardrails.md` R13; detail:
`references/structure/form-device.md` §3):

- **Login state** (who am I) — session cookie everywhere, cross-tab, cleared when the browser closes.
  Never `localStorage`.
- **Progress state** (what have I read) — follows device ownership: a player-owned device (container B)
  persists visited pages and may carry an in-fiction save / continue / wipe; a remote system (A/C/D) clears
  on close unless the fiction really saves. Record `progress: persistent | session | none` and cite the
  container's ownership.
- **World-response state** (the site changed because you read X) — only when selected. Mechanically: the
  new entry carries `data-after="<source page>"` and `check-solvable.mjs` walks it as a conditional edge
  (`workflow/04-reachability.md` route 10). An entry that appears because the story says so, unmodelled,
  is the defect class R13 names.

Persistence may be the ending's blade: a sanction that survives closing the browser is a different story
than one that evaporates on refresh. The GDD decides, the profile records — the site never explains its
storage to the player.

## 5. Axis 5 — era and texture family

| Family | Decides |
|---|---|
| 2000s BBS / Win98 | table layouts, system fonts, 备案 absence vs. presence, broken-image rot as texture, Win98 dialog styling |
| Win10 desktop | taskbar, window drag, Explorer file lists |
| modern mobile | status bar, rounded sheets, IM bubbles, dark mode |
| institutional / bureaucratic | official-document typography, red headers, document numbers, seals |

The era decides whether ICP 备案 lines appear, whether links are http-only relics, which fonts are
period-true, and which fake external destinations exist (友情链接, 百度快照, 微博). A 2007 forum written in
2026 UI is a realism break at the shell level (R12).

## 6. Select the design modules

The container fixes the native reach model (A: search + gates; B/C/D: account login + per-account access);
every further mechanic is a module from `references/design-playbook.md` §2 — reskin, forbidden-word state,
progress numbering, collection carrier, endings, staging, telemetry, world-response state (M14, paired with
axis 4). Select with the user, recommendation first; do not enable a module the fiction does not use, and do
not ship account furniture in a story without identities. Ask explicitly about the reskin (M5): does the
story want a visible impact when the player crosses into the secret layer, or does the system never show a
seam? Either answer is valid — record it, and only offer a dramatic access-level restyle if the fiction
supports it. Sensory requirements (M12) are declared only when the site really implements them (headphones,
mouse, light).

## 7. Write `docs/system-profile.md`

```text
# System Profile
- Container: A/B/C/D (+ nested secondary) and why
- Medium-argument sentence: what this container says by being it
- Device class: phone / desktop / browser-chrome / pure-web
- Technical form: multi-page | apparatus-single-page (R12 record: what breaks, what it serves) | + encrypted-content tier
- State contract: login cookie · progress persistent/session/none (ownership cited) · world-response rows (data-after) or none · save/continue/wipe yes/no
- Era / texture family: one of the §5 rows (or the fiction's own words)
- Fiction: system type, organization, era, language, register
- Reach model: selected modules (M1…M14) and what crosses depth (search / gate / account / typed URL / read-state)
- Presentation: reskin, forbidden state, numbering, collection carrier — each yes/no
- Wrappers: entry page, endings, fourth-wall close, world texture — each yes/no
- Interaction: staged effects, fake interactions, sensory, telemetry — each yes/no
- Shell IA: top bar items, directory layout, page root, site roots (C); base pages every such system has
- Index/access convention: per-audience tables (A) or one index + the account matrix (B/C/D)
- Infrastructure: base.md sections, components.js, vendored Alpine, tools/, checker CONFIG knobs
- Open questions for the user
```

Whichever form is chosen, its docs are required reading for steps 3 and 6:
`references/structure/form-website.md` (A) or `references/structure/form-system.md` (B/C/D). When the device
class is not pure-web, the state contract selects persistence or world-response, or axis 3 chose the
apparatus form, `references/structure/form-device.md` joins the set.

Baseline-test traps for this step: `references/common-mistakes.md` §2 — check them before returning the artifact.
