// M3 access — Alpine component body. Depends on the starter kernel's session store
// (assets/starter/assets/js/components.js — cookie-first, sessionStorage fallback in private mode);
// do NOT redefine session or hash here. Copy into the project's components.js inside the
// alpine:init listener when the profile selects M3 (system containers B/C/D).
// Mount shape: assets/templates/html/access-protected.html (references/structure/form-system.md §3).
// The x-show="unlocked" block is the marker check-solvable.mjs keys on; a page opens ONLY to the
// accounts it names — no privilege ladder (R10).
Alpine.data('access', () => ({
  unlocked: false,
  init() {
    const held = session.access();          // kernel helper: cross-tab session cookie
    const need = (this.$el.dataset.access || '').split(',').map((s) => s.trim()).filter(Boolean);
    this.unlocked = need.some((r) => (r === '*' ? held.length > 0 : held.includes(r)));
    const skin = session.skin();            // optional reskin token granted at login (M5)
    if (skin) document.body.classList.add(skin);
  },
}));
