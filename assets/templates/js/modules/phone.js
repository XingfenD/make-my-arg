// device class: phone — status-bar clock + offline affordance
// (references/structure/form-device.md §2). Copy into the project's components.js inside the
// alpine:init listener when the profile's device class is phone.
// Shell markup: assets/templates/html/phone-shell.html; styles: assets/templates/css/phone.css.
// Alpine calls init() automatically — mount with x-data="phone", no x-init needed.
Alpine.data('phone', () => ({
  clock: '',
  contactOffline: false,
  _t: null,
  init() {
    const el = this.$root;
    // The clock is fiction: freeze one timestamp for an era-locked device (data-frozen-time),
    // tick live otherwise. Never print a real-world date that contradicts the story.
    if (el.dataset.frozenTime) this.clock = el.dataset.frozenTime;
    else {
      const tick = () => { this.clock = new Date().toTimeString().slice(0, 5); };
      tick(); this._t = setInterval(tick, 20000);
    }
    // Grey system line — absence as narrative (references/design-playbook.md §4.7):
    // "对方手机已关机" / "该用户已注销".
    this.contactOffline = el.dataset.contactOffline === 'true';
  },
  destroy() { clearInterval(this._t); },
}));
