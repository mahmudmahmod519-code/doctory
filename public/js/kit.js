/*!
 * Doctory Kit — shared building blocks for the doctor and admin portals.
 *   Kit.list({...})    filter bar + table + pagination bound to a list endpoint ({items,page,limit,total})
 *   Kit.dialog({...})  form dialog (fields → values) rendered in #kit-dialog (partials/modal-form.ejs)
 *   Kit.tabs(el, items, onChange)   pill tabs
 *   Kit.badge(text, tone), Kit.avatar(name), Kit.ROLE, Kit.stat(...)
 * Depends on window.Doctory (core.js).
 */
(function () {
  'use strict';
  const D = window.Doctory; if (!D) return;
  const { api, html, raw, esc, fmt, statusChip, stateBlock, errorBlock, render, toast } = D;

  const TONES = {
    primary: 'bg-primary-fixed text-primary', success: 'bg-[#ECFDF5] text-[#047857]', warning: 'bg-[#FFFBEB] text-[#B45309]',
    danger: 'bg-error-container text-on-error-container', neutral: 'bg-[#F1F5F9] text-[#475569]', teal: 'bg-secondary-container/40 text-on-secondary-container'
  };
  const badge = (text, tone = 'neutral') => raw(`<span class="inline-flex items-center px-2.5 py-1 rounded-full font-label-sm text-label-sm ${TONES[tone] || TONES.neutral}">${esc(text)}</span>`);
  const ROLE = { admin: ['مدير', 'primary'], doctor: ['طبيب', 'teal'], patient: ['مريض', 'neutral'] };
  const roleBadge = (r) => badge((ROLE[r] || [r, 'neutral'])[0], (ROLE[r] || [0, 'neutral'])[1]);
  const avatar = (name) => raw(`<span class="w-9 h-9 shrink-0 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-label-md text-label-md font-bold">${esc(String(name || '؟').replace(/^د\.\s*/, '').trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join(''))}</span>`);
  const stat = (icon, label, value, tone = 'primary') => html`<div class="bg-surface-container-lowest rounded-xl shadow-card p-4 flex items-center gap-3" data-stagger-item><div class="w-11 h-11 rounded-lg ${TONES[tone] || TONES.primary} flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-[22px]">${icon}</span></div><div class="min-w-0"><p class="num text-2xl font-extrabold leading-none" ${raw(Number.isFinite(+value) ? `data-count="${+value}"` : '')}>${value ?? '—'}</p><p class="font-label-sm text-label-sm text-on-surface-variant mt-1">${label}</p></div></div>`;
  const iconBtn = (icon, label, attrs = '', tone = '') => raw(`<button type="button" ${attrs} title="${esc(label)}" aria-label="${esc(label)}" class="w-9 h-9 rounded-lg hover:bg-surface-container-low inline-flex items-center justify-center ${tone === 'danger' ? 'text-error hover:bg-error-container/50' : 'text-on-surface-variant hover:text-on-surface'}"><span class="material-symbols-outlined text-[20px]">${icon}</span></button>`);

  /* ---------- tabs ---------- */
  function tabs(el, items, onChange, initial) {
    if (typeof el === 'string') el = document.querySelector(el);
    let cur = initial ?? items[0][0];
    const paint = () => { el.innerHTML = items.map(([v, l]) => `<button type="button" role="tab" aria-selected="${v === cur}" data-t="${esc(v)}" class="px-4 py-2 rounded-full font-label-md text-label-md transition-colors ${v === cur ? 'bg-primary-container text-on-primary' : 'bg-surface-container-low hover:bg-surface-container'}">${esc(l)}</button>`).join(''); };
    el.setAttribute('role', 'tablist'); el.classList.add('flex', 'flex-wrap', 'gap-2');
    el.addEventListener('click', (e) => { const b = e.target.closest('[data-t]'); if (b && b.dataset.t !== cur) { cur = b.dataset.t; paint(); onChange(cur); } });
    paint(); return { get value() { return cur; } };
  }

  /* ---------- form dialog ---------- */
  function fieldHtml(f) {
    const id = 'kf-' + f.name, req = f.required ? ' <span class="text-error">*</span>' : '';
    const span = f.full || f.type === 'textarea' ? 'sm:col-span-2' : '';
    let input;
    if (f.type === 'select') input = `<select id="${id}" name="${f.name}" class="field">${(f.options || []).map(([v, l]) => `<option value="${esc(v)}" ${String(f.value ?? '') === String(v) ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select>`;
    else if (f.type === 'textarea') input = `<textarea id="${id}" name="${f.name}" rows="${f.rows || 3}" maxlength="${f.max || 2000}" placeholder="${esc(f.placeholder || '')}" class="field">${esc(f.value ?? '')}</textarea>`;
    else input = `<input id="${id}" name="${f.name}" type="${f.type || 'text'}" value="${esc(f.value ?? '')}" placeholder="${esc(f.placeholder || '')}" ${f.dir ? `dir="${f.dir}"` : ''} ${f.min != null ? `min="${f.min}"` : ''} class="field" />`;
    return `<div class="flex flex-col gap-1.5 ${span}"><label for="${id}" class="font-label-md text-label-md font-semibold">${esc(f.label)}${req}</label>${input}<p data-error-for="${f.name}" class="hidden font-label-sm text-label-sm text-error"></p></div>`;
  }
  function dialog({ title, text = '', fields = [], submitText = 'حفظ', danger = false, validate } = {}) {
    const dlg = document.getElementById('kit-dialog'); if (!dlg) return Promise.resolve(null);
    const form = dlg.querySelector('[data-kit-panel]');
    dlg.querySelector('[data-kit-title]').textContent = title;
    const t = dlg.querySelector('[data-kit-text]'); t.textContent = text; t.classList.toggle('hidden', !text);
    dlg.querySelector('[data-kit-fields]').innerHTML = fields.map(fieldHtml).join('');
    const sub = dlg.querySelector('[data-kit-submit]'); sub.textContent = submitText;
    sub.classList.toggle('bg-error', danger); sub.classList.toggle('bg-primary-container', !danger);
    dlg.classList.remove('hidden'); dlg.classList.add('flex');
    if (window.Motion && !D.reducedMotion()) window.Motion.animate(form, { opacity: [0, 1], scale: [0.97, 1], y: [10, 0] }, { type: 'spring', stiffness: 400, damping: 32 });
    const first = form.querySelector('input,select,textarea'); if (first) first.focus();
    return new Promise((resolve) => {
      const done = (v) => { dlg.classList.add('hidden'); dlg.classList.remove('flex'); form.removeEventListener('submit', onSubmit); dlg.removeEventListener('click', onBack); document.removeEventListener('keydown', onKey); dlg.querySelector('[data-kit-cancel]').removeEventListener('click', onCancel); resolve(v); };
      const onSubmit = (e) => {
        e.preventDefault(); const vals = D.formToObject(form), err = {};
        fields.forEach((f) => { if (f.required && !String(vals[f.name] ?? '').trim()) err[f.name] = 'هذا الحقل مطلوب'; if (f.minLength && String(vals[f.name] || '').trim().length < f.minLength && !err[f.name]) err[f.name] = `${f.minLength} أحرف على الأقل`; });
        Object.assign(err, validate ? (validate(vals) || {}) : {});
        D.showFieldErrors(form, err); if (Object.keys(err).length) return;
        done(vals);
      };
      const onCancel = () => done(null), onBack = (e) => { if (e.target === dlg) done(null); }, onKey = (e) => { if (e.key === 'Escape') done(null); };
      form.addEventListener('submit', onSubmit); dlg.addEventListener('click', onBack); document.addEventListener('keydown', onKey);
      dlg.querySelector('[data-kit-cancel]').addEventListener('click', onCancel);
    });
  }

  /* run an API action with busy toast handling */
  async function act(promiseFn, okMsg) {
    try { const r = await promiseFn(); toast(okMsg || r?.message || 'تم بنجاح', 'success'); return r; }
    catch (e) { toast(e.message, 'error'); return null; }
  }

  /* ---------- list (filters + table + pager) ---------- */
  /**
   * Kit.list({
   *   root: '#list', endpoint: '/api/admin/users', limit: 10, sort?: {...fixed query},
   *   tabs?: { param:'role', items:[['', 'الكل'],...] },
   *   filters?: [{ name, type:'search'|'select'|'date', label, placeholder, options:[[v,l]] }],
   *   columns: [{ label, cell:(row)=>string|raw, cls? }], rowKey?: 'id', rowHref?: (row)=>url,
   *   empty: { icon, title, text }, onLoaded?: (data)=>void
   * }) → { reload, setQuery(obj) }
   */
  function list(o) {
    const root = typeof o.root === 'string' ? document.querySelector(o.root) : o.root;
    const limit = o.limit || 10; let page = 1, seq = 0, timer; const q = { ...(o.query || {}) };
    root.innerHTML = `<div class="flex flex-col gap-4">
      ${o.tabs ? '<div data-k-tabs></div>' : ''}
      ${(o.filters || []).length ? `<form data-k-filters class="bg-surface-container-lowest rounded-2xl shadow-card p-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-${Math.min(o.filters.length, 4)}">${o.filters.map((f) => f.type === 'select'
        ? `<select name="${f.name}" aria-label="${esc(f.label)}" class="field">${f.options.map(([v, l]) => `<option value="${esc(v)}">${esc(l)}</option>`).join('')}</select>`
        : `<div class="relative">${f.type === 'search' ? '<span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">search</span>' : ''}<input name="${f.name}" type="${f.type === 'search' ? 'search' : f.type || 'text'}" aria-label="${esc(f.label)}" placeholder="${esc(f.placeholder || f.label)}" class="field ${f.type === 'search' ? 'pr-11' : ''}" /></div>`).join('')}</form>` : ''}
      <div class="flex items-center justify-between"><p data-k-count class="font-label-md text-label-md text-on-surface-variant" aria-live="polite"></p></div>
      <div data-k-table class="bg-surface-container-lowest rounded-2xl shadow-card overflow-hidden"></div>
      <nav data-k-pager class="flex justify-center gap-2 flex-wrap" aria-label="الصفحات"></nav></div>`;
    const tableEl = root.querySelector('[data-k-table]'), pager = root.querySelector('[data-k-pager]'), count = root.querySelector('[data-k-count]'), form = root.querySelector('[data-k-filters]');
    if (o.tabs) { const init = (o.tabs.items.find(([v]) => v === (o.tabs.initial ?? '')) || o.tabs.items[0])[0]; q[o.tabs.param] = init; tabs(root.querySelector('[data-k-tabs]'), o.tabs.items, (v) => { q[o.tabs.param] = v; page = 1; load(); }, init); }

    function table(items) {
      const head = o.columns.map((c) => `<th scope="col" class="px-4 py-3 text-right font-label-md text-label-md text-on-surface-variant font-semibold whitespace-nowrap ${c.cls || ''}">${esc(c.label)}</th>`).join('');
      const rows = items.map((r) => `<tr class="border-t border-surface-container-high hover:bg-surface-container-low/60 transition-colors ${o.rowHref ? 'cursor-pointer' : ''}" ${o.rowHref ? `data-href="${esc(o.rowHref(r))}"` : ''}>${o.columns.map((c) => { const v = c.cell(r); return `<td class="px-4 py-3 align-middle font-body-md text-body-md ${c.cls || ''}">${v && v.__raw ? v.value : esc(v ?? '—')}</td>`; }).join('')}</tr>`).join('');
      return `<div class="overflow-x-auto"><table class="w-full min-w-[640px]"><thead class="bg-surface-container-low/70"><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
    }
    async function load() {
      const my = ++seq; const query = { ...q, page, limit };
      if (form) new FormData(form).forEach((v, k) => { if (v) query[k] = v; });
      tableEl.setAttribute('aria-busy', 'true');
      tableEl.innerHTML = '<div class="p-4 flex flex-col gap-3">' + '<div class="skeleton h-12 rounded-lg"></div>'.repeat(4) + '</div>';
      try {
        const { data } = await api('GET', o.endpoint, null, { query });
        if (my !== seq) return;
        const items = data.items || [];
        count.textContent = items.length ? `${(data.total ?? items.length).toLocaleString('ar-EG')} نتيجة` : '';
        if (!items.length) tableEl.innerHTML = stateBlock(o.empty || { icon: 'search_off', title: 'لا توجد نتائج', text: 'جرّب تغيير الفلاتر.' });
        else render(tableEl, table(items));
        const pages = Math.ceil((data.total || 0) / limit);
        pager.innerHTML = pages > 1 ? Array.from({ length: Math.min(pages, 12) }, (_, i) => `<button type="button" data-p="${i + 1}" class="num w-10 h-10 rounded-lg font-label-md ${i + 1 === page ? 'bg-primary-container text-on-primary' : 'bg-surface-container-low hover:bg-surface-container'}" ${i + 1 === page ? 'aria-current="page"' : ''}>${i + 1}</button>`).join('') : '';
        if (o.onLoaded) o.onLoaded(data);
      } catch (e) { if (my === seq) { count.textContent = ''; tableEl.innerHTML = errorBlock(e, '__kitReload' + (o.id || '')); } }
      finally { tableEl.removeAttribute('aria-busy'); }
    }
    window['__kitReload' + (o.id || '')] = load;
    if (form) { form.addEventListener('submit', (e) => e.preventDefault()); form.addEventListener('input', (e) => { page = 1; clearTimeout(timer); timer = setTimeout(load, e.target.type === 'search' || e.target.type === 'text' ? 300 : 0); }); }
    pager.addEventListener('click', (e) => { const b = e.target.closest('[data-p]'); if (b) { page = +b.dataset.p; load(); } });
    tableEl.addEventListener('click', (e) => { const tr = e.target.closest('tr[data-href]'); if (tr && !e.target.closest('button,a,input,select')) location.href = tr.dataset.href; });
    if (o.actions) tableEl.addEventListener('click', (e) => { const b = e.target.closest('[data-act]'); if (b) o.actions(b.dataset.act, b.dataset.id, b, load); });
    load();
    return { reload: load, setQuery(obj) { Object.assign(q, obj); page = 1; load(); } };
  }


  /* ---------- queue groups (shared by the doctor and admin waiting lists) ---------- */
  function queueGroups(d, { canCall = false } = {}) {
    const c = d.counters || {};
    const col = (title, icon, tone, n, rows, empty) => `<section class="bg-surface-container-lowest rounded-2xl shadow-card p-5 flex flex-col gap-3" data-stagger-item><h2 class="font-title-md text-title-md font-bold flex items-center justify-between gap-2"><span class="flex items-center gap-2"><span class="material-symbols-outlined ${tone}">${icon}</span>${title}</span><span class="num px-2.5 py-0.5 rounded-full bg-surface-container text-label-md">${n ?? rows.length}</span></h2><ul class="flex flex-col gap-2">${rows.length ? rows.join('') : `<li class="py-6 text-center text-on-surface-variant font-body-md">${empty}</li>`}</ul></section>`;
    const no = (n) => `<span class="num w-9 h-9 shrink-0 rounded-lg bg-primary-fixed text-primary flex items-center justify-center font-bold">${fmt.ticket(n).replace('#', '')}</span>`;
    const waiting = (d.waiting || []).map((w, i) => `<li class="flex items-center gap-3 p-3 rounded-xl ${i === 0 ? 'bg-secondary-container/30' : 'bg-surface-container-low'}">${no(w.queue_number)}<div class="min-w-0 flex-1"><p class="font-bold truncate">${esc(w.name)}</p><p class="font-label-sm text-label-sm text-on-surface-variant">ينتظر <span class="num">${w.waiting_minutes}</span> د · المتوقع <span class="num">${w.estimated_wait_minutes}</span> د</p></div>${canCall ? `<button type="button" data-call="${esc(w.booking_item_id)}" class="h-9 px-3 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md inline-flex items-center gap-1"><span class="material-symbols-outlined text-[18px]">campaign</span>نادِ</button>` : ''}</li>`);
    const done = (d.completed || []).map((w) => `<li class="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low">${no(w.queue_number)}<div class="min-w-0 flex-1"><p class="font-bold truncate">${esc(w.name)}</p><p class="font-label-sm text-label-sm text-on-surface-variant">انتهى ${fmt.time(new Date(w.completed_at).toTimeString().slice(0, 5))}</p></div>${canCall && w.booking_item_id ? `<a href="/doctor/visits/${esc(w.booking_item_id)}/clinical-summary" class="h-9 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high font-label-md text-label-md inline-flex items-center">الزيارة</a>` : ''}</li>`);
    const gone = (d.removed || []).map((w) => `<li class="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low opacity-80">${no(w.queue_number)}<p class="font-bold truncate flex-1">${esc(w.name || w.patient_name)}</p>${statusChip(w.status).value}</li>`);
    return `<div class="grid lg:grid-cols-3 gap-5" data-stagger>${col('في الانتظار', 'hourglass_top', 'text-warning', c.waiting, waiting, 'لا يوجد مرضى في الانتظار')}${col('تمت خدمتهم', 'task_alt', 'text-success', c.completed, done, 'لا توجد زيارات منتهية بعد')}${col('محذوفون / ملغاة', 'person_off', 'text-error', c.removed, gone, 'لا يوجد')}</div>`;
  }

  window.Kit = { queueGroups, list, dialog, tabs, act, badge, roleBadge, avatar, stat, iconBtn, TONES };
})();
