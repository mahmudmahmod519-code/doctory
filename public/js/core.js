/* Doctory — shared frontend helpers (no build step, plain browser JS).
 * Exposes window.Doctory: api(), toast(), confirm(), fmt, ui helpers.
 *
 * API contract (see routes/<module>/index.js): every JSON endpoint answers
 *   { status: 'success' | 'error', message?, data? }  — lists use { items, page, limit, total }.
 * Auth is the HTTP-only cookie `session_token`, so fetch only needs credentials: 'same-origin'.
 *
 * Mock mode: open any page with ?mock=1 (persists for the tab, ?mock=0 turns it off) to serve
 * responses from public/js/mock-api.js — lets the UI be reviewed before the APIs are implemented. */
(function () {
  'use strict';

  // ---------- mock switch ----------
  const qs = new URLSearchParams(location.search);
  if (qs.has('mock')) {
    try { qs.get('mock') === '0' ? sessionStorage.removeItem('doctory:mock') : sessionStorage.setItem('doctory:mock', '1'); } catch (_) {}
  }
  let mockOn = false;
  try { mockOn = sessionStorage.getItem('doctory:mock') === '1'; } catch (_) {}

  class ApiError extends Error {
    constructor(message, status, payload) { super(message); this.status = status; this.payload = payload; }
  }

  const MESSAGES = {
    network: 'تعذّر الاتصال بالخادم، تأكد من اتصالك بالإنترنت وحاول مرة أخرى.',
    notImplemented: 'هذه الخدمة لم تُفعَّل بعد على الخادم.',
    server: 'حدث خطأ غير متوقع، حاول مرة أخرى بعد قليل.',
    forbidden: 'ليس لديك صلاحية لتنفيذ هذا الإجراء.'
  };

  /**
   * api('GET', '/api/patient/dashboard')
   * api('POST', '/api/auth/login', { email, password })
   * api('POST', '/api/user/upload-image', formDataInstance)
   * Options: { query: {..}, redirectOn401: true }
   */
  async function api(method, url, body, opts = {}) {
    const { query, redirectOn401 = true } = opts;
    if (query) {
      const p = new URLSearchParams();
      Object.entries(query).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') p.append(k, v); });
      const s = p.toString();
      if (s) url += (url.includes('?') ? '&' : '?') + s;
    }

    if (mockOn && window.DoctoryMock) {
      const res = await window.DoctoryMock.handle(method, url, body);
      if (res) {
        if (res.status === 'error') throw new ApiError(res.message || MESSAGES.server, res.code || 400, res);
        return res;
      }
    }

    const init = { method, credentials: 'same-origin', headers: { Accept: 'application/json' } };
    if (body instanceof FormData) init.body = body;
    else if (body !== undefined) { init.headers['Content-Type'] = 'application/json'; init.body = JSON.stringify(body); }

    let res;
    try { res = await fetch(url, init); } catch (_) { throw new ApiError(MESSAGES.network, 0); }

    let payload = null;
    const type = res.headers.get('content-type') || '';
    if (type.includes('application/json')) { try { payload = await res.json(); } catch (_) {} }

    if (res.ok && (!payload || payload.status !== 'error')) return payload || { status: 'success' };

    if (res.status === 401 && redirectOn401) {
      location.href = '/auth/login?next=' + encodeURIComponent(location.pathname + location.search);
      throw new ApiError(payload?.message || 'يجب تسجيل الدخول', 401, payload);
    }
    const msg = payload?.message
      || (res.status === 501 || res.status === 404 && !payload ? MESSAGES.notImplemented
        : res.status === 403 ? MESSAGES.forbidden : MESSAGES.server);
    throw new ApiError(msg, res.status, payload);
  }

  // ---------- escaping / templating ----------
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  /** html`<p>${value}</p>` escapes every interpolation; wrap trusted markup with raw(). */
  function html(strings, ...values) {
    return strings.reduce((out, s, i) => {
      if (i >= values.length) return out + s;
      const v = values[i];
      const str = Array.isArray(v) ? v.map((x) => (x && x.__raw ? x.value : esc(x))).join('')
        : v && v.__raw ? v.value : esc(v);
      return out + s + str;
    }, '');
  }
  const raw = (value) => ({ __raw: true, value: String(value ?? '') });

  // ---------- formatting ----------
  const AR = 'ar-EG';
  const fmt = {
    date(d, opts = { weekday: 'long', day: 'numeric', month: 'long' }) {
      if (!d) return '—'; const x = new Date(d); return isNaN(x) ? String(d) : x.toLocaleDateString(AR, opts);
    },
    shortDate(d) { return fmt.date(d, { day: 'numeric', month: 'short', year: 'numeric' }); },
    /** "14:30" → "02:30 م" */
    time(t) {
      if (!t) return '—';
      const m = String(t).match(/^(\d{1,2}):(\d{2})/);
      if (!m) return String(t);
      let h = +m[1]; const suffix = h >= 12 ? 'م' : 'ص'; h = h % 12 || 12;
      return `${String(h).padStart(2, '0')}:${m[2]} ${suffix}`;
    },
    money(v) { return v == null ? '—' : `${Number(v).toLocaleString(AR)} ج.م`; },
    num(v) { return v == null ? '—' : Number(v).toLocaleString(AR); },
    ticket(n) { return n == null ? '—' : '#' + String(n).padStart(2, '0'); },
    relative(d) {
      if (!d) return '';
      const diff = (Date.now() - new Date(d).getTime()) / 1000;
      const rtf = new Intl.RelativeTimeFormat(AR, { numeric: 'auto' });
      const steps = [[60, 'second'], [3600, 'minute'], [86400, 'hour'], [604800, 'day'], [2629800, 'week'], [31557600, 'month']];
      const units = { second: 1, minute: 60, hour: 3600, day: 86400, week: 604800, month: 2629800 };
      for (const [limit, unit] of steps) if (Math.abs(diff) < limit) return rtf.format(-Math.round(diff / units[unit]), unit);
      return rtf.format(-Math.round(diff / 31557600), 'year');
    },
    isoDate(d) { const x = new Date(d); return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`; }
  };

  // Booking item statuses → label + chip classes (design system "Chips & Badges")
  const STATUS = {
    pending:   { label: 'قيد المراجعة', cls: 'bg-[#FFFBEB] text-[#B45309]', dot: 'bg-warning' },
    accepted:  { label: 'مؤكد',          cls: 'bg-[#ECFDF5] text-[#047857]', dot: 'bg-success' },
    rejected:  { label: 'مرفوض',         cls: 'bg-error-container text-on-error-container', dot: 'bg-error' },
    completed: { label: 'مكتمل',         cls: 'bg-[#F1F5F9] text-[#475569]', dot: 'bg-outline' },
    cancelled: { label: 'ملغي',          cls: 'bg-error-container text-on-error-container', dot: 'bg-error' },
    active:    { label: 'نشط',           cls: 'bg-[#ECFDF5] text-[#047857]', dot: 'bg-success' },
    expired:   { label: 'منتهي',         cls: 'bg-[#F1F5F9] text-[#475569]', dot: 'bg-outline' }
  };
  function statusChip(status) {
    const s = STATUS[status] || { label: status || '—', cls: 'bg-surface-container text-on-surface-variant', dot: 'bg-outline' };
    return raw(`<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-label-sm font-label-sm ${s.cls}"><span class="w-1.5 h-1.5 rounded-full ${s.dot}"></span>${esc(s.label)}</span>`);
  }

  // ---------- toast ----------
  function toast(message, type = 'info', ms = 4200) {
    let root = document.getElementById('toast-root');
    if (!root) { root = document.createElement('div'); root.id = 'toast-root'; document.body.appendChild(root); }
    const icons = { success: 'check_circle', error: 'error', info: 'info', warning: 'warning' };
    const tones = {
      success: 'bg-navy text-white', error: 'bg-error text-on-error',
      info: 'bg-navy text-white', warning: 'bg-[#B45309] text-white'
    };
    const el = document.createElement('div');
    el.setAttribute('role', type === 'error' ? 'alert' : 'status');
    el.className = `flex items-center gap-3 max-w-[92vw] sm:max-w-md px-4 py-3 rounded-xl shadow-modal font-body-md text-body-md ${tones[type] || tones.info}`;
    el.innerHTML = html`<span class="material-symbols-outlined text-[20px]">${icons[type] || 'info'}</span><span class="flex-1">${message}</span><button type="button" class="opacity-70 hover:opacity-100" aria-label="إغلاق"><span class="material-symbols-outlined text-[18px]">close</span></button>`;
    root.appendChild(el);
    const M = window.Motion;
    if (M && !reducedMotion()) M.animate(el, { opacity: [0, 1], y: [16, 0], scale: [0.98, 1] }, { type: 'spring', stiffness: 380, damping: 30 });
    const close = () => {
      if (!el.isConnected) return;
      if (M && !reducedMotion()) M.animate(el, { opacity: 0, y: 8 }, { duration: 0.18 }).finished.then(() => el.remove());
      else el.remove();
    };
    el.querySelector('button').addEventListener('click', close);
    setTimeout(close, ms);
  }

  // ---------- confirm modal (markup in views/partials/modal-confirm.ejs) ----------
  function confirmDialog({ title = 'تأكيد الإجراء', message = '', confirmText = 'تأكيد', cancelText = 'إلغاء', danger = false, withReason = false } = {}) {
    const dlg = document.getElementById('confirm-modal');
    if (!dlg) return Promise.resolve(window.confirm(message || title) ? { ok: true, reason: '' } : { ok: false });
    dlg.querySelector('[data-confirm-title]').textContent = title;
    dlg.querySelector('[data-confirm-message]').textContent = message;
    const ok = dlg.querySelector('[data-confirm-ok]');
    const cancel = dlg.querySelector('[data-confirm-cancel]');
    const reasonWrap = dlg.querySelector('[data-confirm-reason-wrap]');
    const reason = dlg.querySelector('[data-confirm-reason]');
    ok.textContent = confirmText; cancel.textContent = cancelText;
    ok.className = ok.className.replace(/\bbg-\S+/g, '') + (danger ? ' bg-error' : ' bg-primary-container');
    reasonWrap.classList.toggle('hidden', !withReason); reason.value = '';
    dlg.classList.remove('hidden'); dlg.classList.add('flex');
    const panel = dlg.querySelector('[data-confirm-panel]');
    if (window.Motion && !reducedMotion()) {
      window.Motion.animate(dlg, { opacity: [0, 1] }, { duration: 0.18 });
      window.Motion.animate(panel, { opacity: [0, 1], scale: [0.96, 1], y: [12, 0] }, { type: 'spring', stiffness: 420, damping: 32 });
    }
    (withReason ? reason : ok).focus();
    return new Promise((resolve) => {
      const done = (val) => {
        dlg.classList.add('hidden'); dlg.classList.remove('flex');
        ok.removeEventListener('click', onOk); cancel.removeEventListener('click', onCancel);
        dlg.removeEventListener('click', onBackdrop); document.removeEventListener('keydown', onKey);
        resolve(val);
      };
      const onOk = () => done({ ok: true, reason: reason.value.trim() });
      const onCancel = () => done({ ok: false });
      const onBackdrop = (e) => { if (e.target === dlg) onCancel(); };
      const onKey = (e) => { if (e.key === 'Escape') onCancel(); };
      ok.addEventListener('click', onOk); cancel.addEventListener('click', onCancel);
      dlg.addEventListener('click', onBackdrop); document.addEventListener('keydown', onKey);
    });
  }

  // ---------- small UI helpers ----------
  function reducedMotion() { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }

  /** Button busy state that keeps the width stable. */
  function setBusy(btn, busy, label = 'جارٍ التنفيذ...') {
    if (!btn) return;
    if (busy) {
      btn.dataset.idleHtml = btn.innerHTML; btn.style.minWidth = btn.offsetWidth + 'px';
      btn.disabled = true; btn.setAttribute('aria-busy', 'true');
      btn.innerHTML = html`<span class="material-symbols-outlined text-[20px] animate-spin">progress_activity</span><span>${label}</span>`;
    } else {
      btn.disabled = false; btn.removeAttribute('aria-busy');
      if (btn.dataset.idleHtml) btn.innerHTML = btn.dataset.idleHtml;
    }
  }

  function formToObject(form) {
    const out = {};
    new FormData(form).forEach((v, k) => { if (typeof v === 'string') v = v.trim(); out[k] = v; });
    return out;
  }

  /** Show server/Joi validation errors next to fields: <p data-error-for="email"></p> */
  function showFieldErrors(form, errors = {}) {
    form.querySelectorAll('[data-error-for]').forEach((p) => { p.textContent = ''; p.classList.add('hidden'); });
    form.querySelectorAll('[aria-invalid]').forEach((i) => i.removeAttribute('aria-invalid'));
    Object.entries(errors).forEach(([name, msg]) => {
      const input = form.elements[name]; const p = form.querySelector(`[data-error-for="${name}"]`);
      if (input) input.setAttribute('aria-invalid', 'true');
      if (p) { p.textContent = msg; p.classList.remove('hidden'); }
    });
    const first = form.querySelector('[aria-invalid="true"]'); if (first) first.focus();
  }

  /** Empty / error state block used by every list. */
  function stateBlock({ icon = 'inbox', title, text = '', action = '' } = {}) {
    return html`<div class="flex flex-col items-center justify-center text-center gap-3 py-12 px-6">
      <div class="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center text-on-surface-variant"><span class="material-symbols-outlined text-[28px]">${icon}</span></div>
      <p class="font-title-md text-title-md text-on-surface">${title}</p>
      ${text ? raw(html`<p class="font-body-md text-body-md text-on-surface-variant max-w-sm">${text}</p>`) : ''}
      ${raw(action)}
    </div>`;
  }
  function errorBlock(err, retryFnName) {
    return stateBlock({
      icon: err?.status === 501 ? 'construction' : 'cloud_off',
      title: err?.status === 501 ? 'الخدمة قيد التجهيز' : 'تعذّر تحميل البيانات',
      text: err?.message || MESSAGES.server,
      action: retryFnName ? `<button type="button" onclick="${retryFnName}()" class="mt-1 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container-lowest border border-outline-variant/60 text-on-surface font-label-md text-label-md hover:bg-surface-container-low"><span class="material-symbols-outlined text-[18px]">refresh</span>إعادة المحاولة</button>` : ''
    });
  }

  /** Swap content of a container and re-run reveal animations on the new nodes. */
  function render(el, markup) {
    if (typeof el === 'string') el = document.querySelector(el);
    if (!el) return;
    el.innerHTML = markup;
    el.removeAttribute('aria-busy');
    if (window.DoctoryMotion) window.DoctoryMotion.reveal(el);
  }

  // ---------- global wiring ----------
  function wireGlobal() {
    // Logout buttons
    document.querySelectorAll('[data-logout]').forEach((b) => b.addEventListener('click', async (e) => {
      e.preventDefault();
      try { await api('POST', '/api/auth/logout', undefined, { redirectOn401: false }); } catch (_) {}
      location.href = '/auth/login';
    }));

    // Mobile sidebar toggle
    const sidebar = document.querySelector('[data-sidebar]');
    const scrim = document.querySelector('[data-sidebar-scrim]');
    const setOpen = (open) => {
      if (!sidebar) return;
      sidebar.classList.toggle('translate-x-full', !open);
      scrim?.classList.toggle('hidden', !open);
      document.body.classList.toggle('overflow-hidden', open);
    };
    document.querySelectorAll('[data-sidebar-toggle]').forEach((b) => b.addEventListener('click', () => setOpen(sidebar.classList.contains('translate-x-full'))));
    scrim?.addEventListener('click', () => setOpen(false));

    // Guest navbar mobile menu
    const menuBtn = document.querySelector('[data-menu-toggle]');
    const menu = document.querySelector('[data-menu]');
    menuBtn?.addEventListener('click', () => {
      const open = menu.classList.toggle('hidden') === false;
      menuBtn.setAttribute('aria-expanded', String(open));
      if (open && window.Motion && !reducedMotion()) window.Motion.animate(menu, { opacity: [0, 1], y: [-8, 0] }, { duration: 0.2 });
    });

    // Password visibility toggles: <button data-toggle-password="inputId">
    document.querySelectorAll('[data-toggle-password]').forEach((b) => b.addEventListener('click', () => {
      const input = document.getElementById(b.dataset.togglePassword); if (!input) return;
      const show = input.type === 'password'; input.type = show ? 'text' : 'password';
      const icon = b.querySelector('.material-symbols-outlined'); if (icon) icon.textContent = show ? 'visibility_off' : 'visibility';
      b.setAttribute('aria-label', show ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور');
    }));

    // Notification bell badge (only when the bell exists = logged-in layouts)
    const badges = document.querySelectorAll('[data-unread-badge]');
    if (badges.length) {
      const refresh = async () => {
        try {
          const r = await api('GET', '/api/notifications/unread-count', undefined, { redirectOn401: false });
          const n = r?.data?.unread_count || 0;
          badges.forEach((b) => { b.textContent = n > 9 ? '9+' : n; b.classList.toggle('hidden', n === 0); });
        } catch (_) { /* silent: the bell is decorative when the API is unavailable */ }
      };
      refresh(); setInterval(() => { if (!document.hidden) refresh(); }, 60000);
    }

    if (mockOn) {
      const tag = document.createElement('div');
      tag.className = 'fixed bottom-3 left-3 z-[90] px-3 py-1.5 rounded-full bg-warning text-navy text-label-sm font-label-sm shadow-card no-print';
      tag.textContent = 'وضع المعاينة: بيانات تجريبية';
      document.body.appendChild(tag);
    }
  }
  document.addEventListener('DOMContentLoaded', wireGlobal);

  window.Doctory = { api, ApiError, html, raw, esc, fmt, statusChip, STATUS, toast, confirm: confirmDialog, setBusy, formToObject, showFieldErrors, stateBlock, errorBlock, render, reducedMotion, get mock() { return mockOn; } };
})();
