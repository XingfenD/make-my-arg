// M14 read-state — the runtime side of world-response state (references/guardrails.md R13): an entry
// appears once its source page was read. The STORE (readState + READ_KEY) lives in the starter kernel
// (assets/starter/assets/js/components.js) — never redefine it here. This file adds only the mount
// component: the SOURCE page marks itself as read by carrying it.
// The CHECKER-visible contract is the data-after attribute on the entry anchor
// (assets/templates/html/read-entry.html): keep the page path written in data-after and in the
// markRead(...) argument identical, or the walk proves an order the DOM does not render
// (references/structure/form-device.md §4).
// Persist ONLY when docs/system-profile.md records the persistent/world-response contract; the kernel
// store is where `progress: session` swaps localStorage for sessionStorage.
//
// Mount on the SOURCE page's <main> so opening it marks the read:
//   <main x-data="markRead('pages/forum/thread-fenglou.html')">
Alpine.data('markRead', (page) => ({ init() { readState.mark(page); } }));
