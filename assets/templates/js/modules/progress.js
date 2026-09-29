// M7 collection progress — Alpine component body.
// The storage question follows the profile's state contract (references/guardrails.md R13, detail
// references/structure/form-device.md §3): progress persists ONLY when the profile records `persistent`
// (a player-owned device or a fiction that really saves). With `progress: session`, swap localStorage
// for sessionStorage; with `progress: none`, the module itself is out of the game. Login state is never
// here — it lives in the session cookie (kernel), never localStorage.
// Mount on the shared footer so it runs on every page:
//   <footer x-data="progress"><small>© ... <span class="progress" x-text="seen.length + '/' + total"></span></small></footer>
//   <body data-page="14" data-total="36">   (deep footers may print anomalous numbers: ex/36, ?/36)
Alpine.data('progress', () => ({
  seen: [],
  init() {
    this.seen = JSON.parse(localStorage.getItem('seen') ?? '[]');
    const n = document.body.dataset.page;
    if (n && !this.seen.includes(n)) this.seen.push(n);
    localStorage.setItem('seen', JSON.stringify(this.seen));
  },
}));
