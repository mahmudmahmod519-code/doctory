/* Doctory — declarative animations powered by Motion (https://motion.dev, UMD global `Motion`).
 *
 * Markup API (works on server-rendered and on dynamically injected content):
 *   data-animate="fade-up | fade | scale | slide-start | pop"   reveal when scrolled into view
 *   data-delay="0.15"                                            extra delay in seconds
 *   data-stagger                                                 reveal direct children one after another
 *   data-count="128"                                             count up to the number when visible
 *   data-progress="65"                                           animate a bar's width (or ring) to N%
 *   data-tilt                                                    subtle hover lift with a spring
 *
 * The <head> adds html.motion-ready before first paint (so nothing flashes) and removes it after 2.5s
 * if Motion never loaded, which keeps every element visible when the CDN is blocked. */
(function () {
  'use strict';
  const M = window.Motion;
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!M || reduced) {
    root.classList.remove('motion-ready');
    window.DoctoryMotion = { reveal() {}, pulse() {}, countTo(el, to) { el.textContent = Number(to).toLocaleString('ar-EG') + (el.dataset.suffix || ''); } };
    document.querySelectorAll('[data-count]').forEach((el) => { el.textContent = Number(el.dataset.count).toLocaleString('ar-EG') + (el.dataset.suffix || ''); });
    document.querySelectorAll('[data-progress]').forEach((el) => setProgress(el, +el.dataset.progress));
    return;
  }
  root.classList.add('motion-ready');
  clearTimeout(window.__motionFailsafe);

  const { animate, inView, stagger } = M;
  const EASE = [0.22, 1, 0.36, 1]; // easeOutQuint — calm, clinical
  const isRTL = root.dir === 'rtl';

  const PRESETS = {
    'fade-up':     { opacity: [0, 1], y: [24, 0] },
    'fade':        { opacity: [0, 1] },
    'scale':       { opacity: [0, 1], scale: [0.94, 1] },
    'pop':         { opacity: [0, 1], scale: [0.6, 1.06, 1] },
    'slide-start': { opacity: [0, 1], x: [isRTL ? 32 : -32, 0] },
    'slide-end':   { opacity: [0, 1], x: [isRTL ? -32 : 32, 0] }
  };

  function revealOne(el) {
    if (el.__revealed) return; el.__revealed = true;
    const preset = PRESETS[el.dataset.animate] || PRESETS['fade-up'];
    animate(el, preset, { duration: 0.6, delay: parseFloat(el.dataset.delay || 0), ease: EASE });
  }

  function revealGroup(el) {
    if (el.__revealed) return; el.__revealed = true;
    const kids = Array.from(el.children);
    if (!kids.length) return;
    const preset = PRESETS[el.dataset.stagger] || PRESETS['fade-up'];
    animate(kids, preset, { duration: 0.5, delay: stagger(0.06, { startDelay: parseFloat(el.dataset.delay || 0) }), ease: EASE });
  }

  function countTo(el, to) {
    const target = Number(to); if (isNaN(target)) { el.textContent = to; return; }
    const decimals = (String(to).split('.')[1] || '').length; const suffix = el.dataset.suffix || '';
    animate(0, target, {
      duration: Math.min(1.6, 0.6 + target / 400), ease: EASE,
      onUpdate: (v) => { el.textContent = v.toLocaleString('ar-EG', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix; }
    });
  }

  function setProgress(el, pct, animated) {
    pct = Math.max(0, Math.min(100, pct || 0));
    if (el.tagName.toLowerCase() === 'path' || el.tagName.toLowerCase() === 'circle') {
      if (animated) animate(el, { strokeDasharray: [`0, 100`, `${pct}, 100`] }, { duration: 1, ease: EASE });
      else el.setAttribute('stroke-dasharray', `${pct}, 100`);
    } else if (animated) animate(el, { width: ['0%', pct + '%'] }, { duration: 1, ease: EASE });
    else el.style.width = pct + '%';
  }

  function wireTilt(el) {
    if (el.__tilt) return; el.__tilt = true;
    el.addEventListener('pointerenter', () => animate(el, { y: -4 }, { type: 'spring', stiffness: 400, damping: 28 }));
    el.addEventListener('pointerleave', () => animate(el, { y: 0 }, { type: 'spring', stiffness: 400, damping: 28 }));
  }

  /** Attach observers inside `scope` (document or a freshly rendered container). */
  function reveal(scope = document) {
    scope.querySelectorAll('[data-animate]').forEach((el) => inView(el, () => revealOne(el), { amount: 0.15 }));
    scope.querySelectorAll('[data-stagger]').forEach((el) => inView(el, () => revealGroup(el), { amount: 0.1 }));
    scope.querySelectorAll('[data-count]').forEach((el) => inView(el, () => { if (!el.__counted) { el.__counted = true; countTo(el, el.dataset.count); } }, { amount: 0.6 }));
    scope.querySelectorAll('[data-progress]').forEach((el) => inView(el, () => setProgress(el, +el.dataset.progress, true), { amount: 0.4 }));
    scope.querySelectorAll('[data-tilt]').forEach(wireTilt);
    if (scope !== document && scope.matches) {
      if (scope.matches('[data-stagger]')) { scope.__revealed = false; inView(scope, () => revealGroup(scope)); }
    }
  }

  /** Attention pulse used when a live value changes (queue number, unread badge...). */
  function pulse(el) {
    if (!el) return;
    animate(el, { scale: [1, 1.12, 1] }, { duration: 0.45, ease: EASE });
  }

  window.DoctoryMotion = { reveal, pulse, countTo, setProgress, animate, stagger, EASE };
  document.addEventListener('DOMContentLoaded', () => reveal(document));
  if (document.readyState !== 'loading') reveal(document);
})();
