// M1 search — Alpine component body. Depends on the starter kernel's hash()
// (assets/starter/assets/js/components.js, byte-identical to tools/hash.mjs).
// Copy into the project's components.js inside the alpine:init listener when the profile selects M1.
// Mount shape: assets/templates/html/search.html (layer scoping, R8; result titles are catalog
// entries, R9; see references/structure/components.md §2).
Alpine.data('search', () => ({
  q: '',
  state: 'empty',            // empty | forbidden | hit | miss
  results: [],
  forbidden: null,

  async init() {             // Alpine lifecycle: runs before the component renders
    this.q = new URLSearchParams(location.search).get('q')?.trim().toLowerCase() ?? '';
    if (!this.q) return;
    const enc = hash(this.q);

    const forbiddenTable = await (await fetch('data/forbidden.json')).json();
    const hit = Object.values(forbiddenTable).find(f => f.keywords.includes(enc));
    if (hit) {               // State 3: forbidden — full-page reskin (background/title/logo/footer)
      this.forbidden = hit;
      this.state = 'forbidden';
      document.body.classList.add('body-forbidden');
      document.querySelector('.progress').textContent = 'ex/36';
      return;
    }

    const map = await (await fetch(this.$el.dataset.index)).json();
    this.results = map[enc] ?? [];
    this.state = this.results.length ? 'hit' : 'miss';
  },
}));
