// M2 gate — Alpine component body. Depends on the starter kernel's hash() and session store
// (assets/starter/assets/js/components.js) — do NOT redefine them here; the session cookie helper
// and ACCESS_KEY/SKIN_KEY live in the kernel, shared with the access component (references/structure/components.md §3).
// Shapes and mount markup: assets/templates/html/gate-a.html (navigate on success),
// gate-b.html (unlock in place — the post-gate block must carry x-show="unlocked", the marker
// check-solvable.mjs keys on), login-multi.html (system containers, data-grants map).
// Credential triad + design rules (R3, R4): references/structure/components.md §3.
Alpine.data('gate', () => ({
  error: '', busy: false, unlocked: false, successText: '', _t: null,
  init() { this.successText = this.$el.dataset.successText || ''; },
  submit() {
    const el = this.$root;          // data-* live on the component root; the submit event's target is the <form>
    const inputs = Array.from(el.querySelectorAll('input[data-expect-hash],input[data-expect-any]'));
    // Single-box multi-identity (login-multi.html). data-grants is a JSON map on the root:
    //   { "<account-hash>": { "id": "intern", "pw": ["<pw-hash>", …], "reskin": "secret" }, … }
    // It resolves WHICH identity the typed account grants and validates the password against that identity,
    // so one login box can serve several roles without splitting into several forms on the page. data-grant
    // stays on the root as the flat list of identities check-solvable walks; data-grants is the runtime truth.
    let ok, grantIds = [];
    if (el.dataset.grants) {
      const map = JSON.parse(el.dataset.grants);
      const acc = inputs.find((i) => i.type !== 'password');
      const pw = inputs.find((i) => i.type === 'password');
      const entry = acc ? map[hash(acc.value || '')] : null;
      ok = !!entry && (!pw || (entry.pw || []).includes(hash(pw.value || '')));   // account+password are paired
      if (ok) { grantIds = entry.id ? [entry.id] : []; session.reskin(entry.reskin); }
    } else {
      // Legacy / multi-field gates: every data-expect-hash input must match; data-expect-any accepts any
      // non-empty value (a declared wildcard, references/structure/form-device.md §4); data-grant is unconditional.
      ok = inputs.length > 0 && inputs.every((inp) => {
        if (inp.dataset.expectAny) return (inp.value || '').trim() !== '';
        const expects = (inp.dataset.expectHash || '').split(',').map((s) => s.trim()).filter(Boolean);
        return expects.includes(hash(inp.value || ''));
      });
      grantIds = (el.dataset.grant || '').split(',').map((s) => s.trim()).filter(Boolean);
    }
    if (ok) {
      if (grantIds.length) session.grant(grantIds);
      const next = el.dataset.next;
      const hold = parseInt(el.dataset.successHold || '0', 10);
      const staged = this.successText && hold > 0;
      const finish = () => { if (next) location.href = next; else { this.busy = false; this.unlocked = true; } };
      if (staged) { this.busy = true; this._t = setTimeout(finish, hold); } else finish();
      return;
    }
    this.error = el.dataset.failHint || 'Verification failed.';   // inline red text; a bare alert breaks the facade
    el.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' },
                { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }], 320);
  },
  destroy() { clearTimeout(this._t); },
}));
