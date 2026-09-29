# Form — Device, State, Apparatus (Axes 2 / 4 / 3 of Step 2)

> Required reading when `docs/system-profile.md` carries a non-pure-web device class, a persistent or
> world-response state contract, or the apparatus single-page form (`workflow/02-container.md`). Canonical
> rule texts live in `references/guardrails.md` (R1, R3, R12, R13); this file is the detail and the
> code templates ship as files under `assets/templates/` (index: `assets/templates/README.md`). The desktop (B) shell and the RBAC matrix stay in
> `references/structure/form-system.md`.

## 1. What the device class decides

The container answers *whose* system this is; the device class answers what the player's eye sees. It fixes:

- the shell components step 6a instantiates (status bar / window chrome / address bar / nav header);
- the sensory inputs that exist (touch targets; a speaker for audio puzzles; a cursor for the flashlight mask);
- the progress idiom: **screens** on a phone (album, chat), **pages** on the web (M7 counts accordingly);
- the persistence story (R13): a device that stays in the player's pocket keeps state; a remote system does not.

A B-variant on a phone is still container B — reach stays account/desktop logic while the *skin* is iOS:
the class is presentation plus state, not a new reach model.

## 2. Shell reference components

Canonical shells ship as files under `assets/templates/` (index: `assets/templates/README.md`); the
subsections name their own files. Same script order as every page (`references/structure/base.md` §2);
no component routes or switches scenes (R1).

### Phone (`phone.css` + `x-data="phone"`)

- **status bar**: fixed top strip — time, signal, battery. The clock is fiction: freeze one timestamp (an
  era-locked device) or tick it live; never print a real-world date that contradicts the story.
- **app chrome**: title bar with a back affordance; tab-bar bottom nav. Chat bubbles left/right; an unread
  badge count is a diegetic progress device (M7's phone idiom). Absence renders as a grey system line —
  "对方手机已关机" / "该用户已注销" — which is `references/design-playbook.md` §4.7 (absence) made visible.
- **home screen**: icon grid + dock; this is the desktop shell's sibling, not the same component — the
  grid holds apps, the apps are pages.
- **lock screen as gate**: a passcode keypad shaped like the OS lock; `data-expect-hash` sits on the code
  input. The unlock transition is M12 staging (a swipe, a shake) — not a page navigation.

Mount shape, clock affordances and the grey absence line: `assets/templates/html/phone-shell.html` +
`assets/templates/js/modules/phone.js`; structure CSS: `assets/templates/css/phone.css`.

### Browser chrome (`chrome.css`)

- The site draws its own address bar / tab strip; the player types into a **fake URL input**. A Wayback
  shape accepts one whitelisted origin (a credential-triad H-type gate: `data-expect-hash` on the URL field);
  anything else answers a period-true error page. Styles: `assets/templates/css/chrome.css`.
- **The 604 pattern** (apparatus single page, §5): one document containing hand-drawn chrome plus hidden
  templates; the bar never leaves view because the fiction is one tab of one fabricated session.

### Pure web — nothing to add; `references/structure/base.md` plus the container form doc.

## 3. The state contract (R13)

Three families, one storage answer each:

| Family | The question it answers | Storage | Rule |
|---|---|---|---|
| login | who am I | session cookie | the `session` store in the starter kernel (`assets/starter/assets/js/components.js`); cross-tab; cleared on close; never localStorage — rules: `references/structure/components.md` §3 |
| progress | what have I read / visited | localStorage **only when** the profile records `persistent`; else session-only or none | a player-owned device keeps state (R13); `NN/total` footers and unread badges read it |
| world-response | the site changed because a page was read | LS read-keys **plus the `data-after` attribute**, which is the checker-visible contract | route 10 in `workflow/04-reachability.md`; an entry without `data-after` is an unconditional link and loses its story reason |

The code ships as files, not prose: the `readState` store lives in the starter kernel
(`assets/starter/assets/js/components.js`); the source-page mount is `assets/templates/js/modules/read-state.js`
(`x-data="markRead('<page>')`); the conditional entry markup is `assets/templates/html/read-entry.html` —
`href` is the target, `data-after` names the page whose READING makes this exist. Until then the block
renders nothing: a missing row, not a locked row. Keep the two page paths (`data-after` and `markRead`) in
sync by construction — the attribute is what the checkers walk, the JS is what the player sees.

**Save / continue / wipe, in-fiction**: one boot surface lists the three (a boot menu, a "继续上次调查"
notice, a registry reset). Wipe deletes exactly the keys the boot surface reads. The player never sees the
word localStorage; a wipe is the OS reset / 清档公告 / "记录已被删除". When the profile says `none`, the
boot surface itself is out of the game — and so is any entry whose existence depends on reading.

Persistence may be the ending's blade (604): a sanction that survives the browser close — the group still
muted, the badge still revoked — is a different ending than one that evaporates on refresh. Record it in
the profile at step 2; the GDD and the endings inherit it.

## 4. Event-driven unlocks and the checkers

- `data-after` is parsed like `data-next` (`tools/config.mjs` knobs `afterAttr` / `nextAttr`);
  `check-solvable.mjs` fires the edge only once the **source page** is visited, so the cold-start walk
  proves the same order the player must live through.
- The read-marking itself lives in JS and is invisible to the walk — the DOM contract is the edge.
  A page that shows an entry by checking LS at runtime without the `data-after` attribute is invisible to
  the graph; step 8's re-walk and the chrome sweep catch the mismatch (`references/structure/tooling.md`
  §3 item 7 extends here).
- Gates that ask for no verifiable secret (the "请输入需要修复的记忆" that accepts anything) mark each
  input `data-expect-any` — the component accepts any non-empty value and the walk never hunts a hash
  for it. An unmarked input on a `gate` page stays a leak (workflow/05 Q4): the wildcard is declared,
  never implied.

## 5. The apparatus carve-out (R1 via R12)

One HTML document whose drawn chrome is the fiction. All conditions must hold, recorded in
`docs/system-profile.md` ("Technical form" line) and re-quoted in `docs/self-check.md`:

1. the medium-argument sentence (`workflow/02-container.md` §1) **depends** on the seamless single
   surface — name the dependency in one line;
2. the chrome is diegetic furniture: the drawn bar/window never navigates for real;
3. every location stays independently openable *to the player* (back button and deep state survive; no
   lost-on-refresh content);
4. the GDD still registers each location as its own row — the page map does not collapse with the file
   count;
5. the profile records what the checker model loses and what replaces it: the page walk finds one document,
   so gate/keyword provenance is verified by hand (`references/structure/tooling.md` §3 item 11) and `check-links` only proves
   the single document parses.

Convenience never earns it ("one file is easier" is the rationalization table's first row); an apparatus
site that fails any condition backtracks to the multi-page tree — a `register(type, panel)` engine is still
prohibited.

## 6. Anti-patterns

| Anti-pattern | Why it fails |
|---|---|
| Persistence copied from a reference site with no fiction warrant (R13) | A remote system that never saves matches its fiction; saving there breaks it |
| Login state persisted to localStorage | The remote system must forget you on close; login clears — that is the session fiction (`references/structure/form-system.md` §6) |
| A conditional entry planted as a plain link while the copy claims "appears only after…" | The claim must be mechanical: `data-after` names the source (§4) |
| Phone class declared, pure-web shell shipped | The device class is a promise the skin keeps: §2 components or change the class |
| A save/continue/wipe surface on a profile with `progress: none` | Unselected machinery is module drift (`references/common-mistakes.md` §6) |
| An apparatus single page without the five recorded conditions | The exception is R12'd, never tacit; R1's first rationalization row still applies |
