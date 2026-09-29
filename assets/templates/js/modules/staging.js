// M12 interaction staging — Alpine component bodies: blackout / typewriter / reveal.
// All timers and observers are registered in init() and released in destroy(), so a staged
// effect survives or dies with its component. Copy the selected bodies into the project's
// components.js inside the alpine:init listener when the profile selects M12.
// Sensory variants (audio puzzle, flashlight mask) live in the fiction's own page; the same
// lifecycle rule holds. references/design-playbook.md §2 M12; declare hardware on the entry page (step 8).

// "The system has noticed you": delayed blackout after unlock; optional `next` navigates 5s later.
Alpine.data('blackout', (delay = 3000, text = '', next = null) => ({
  visible: false, text, showTimer: null, exitTimer: null,
  init() {
    this.showTimer = setTimeout(() => {
      this.visible = true;
      if (next) this.exitTimer = setTimeout(() => (location.href = next), 5000);
    }, delay);
  },
  destroy() { clearTimeout(this.showTimer); clearTimeout(this.exitTimer); },
}));
// mount: <div class="blackout" x-data="blackout(4000, 'The system has noticed you')" x-show="visible" x-transition x-cloak x-text="text"></div>

// Delete the element's original text character by character, then retype newText — ceremonial effect.
Alpine.data('typewriter', (newText, speed = 60) => ({
  output: '', timer: null,
  init() {
    const original = this.$el.textContent;
    let i = original.length;
    this.output = original;
    this.timer = setInterval(() => {
      this.output = original.slice(0, --i);
      if (i > 0) return;
      clearInterval(this.timer);
      let j = 0;
      this.timer = setInterval(() => {
        this.output = newText.slice(0, ++j);
        if (j >= newText.length) clearInterval(this.timer);
      }, speed);
    }, speed);
  },
  destroy() { clearInterval(this.timer); },
}));
// mount: <p x-data="typewriter('Access granted. Do not look back.')" x-text="output"></p>

// Scroll reveal: IntersectionObserver owned by the component, controlling reading pace.
Alpine.data('reveal', () => ({
  shown: false, observer: null,
  init() {
    this.observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      this.shown = true;
      this.observer.disconnect();
    });
    this.observer.observe(this.$el);
  },
  destroy() { this.observer?.disconnect(); },
}));
// mount: <div class="reveal" :class="{ shown }" x-data="reveal">…</div>  .reveal{opacity:0;transition:opacity .6s}.reveal.shown{opacity:1}
