/* Doctory — preview data for the patient flow (ONLY used when the page is opened with ?mock=1).
 * Shapes follow the contracts documented in routes/<module>/index.js so swapping to the real
 * backend needs no frontend change. Safe to delete once every API is implemented. */
(function () {
  'use strict';
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const ok = (data, message) => ({ status: 'success', message, data });
  const list = (items, page = 1, limit = 10) => ok({ items: items.slice((page - 1) * limit, page * limit), page, limit, total: items.length });
  const today = new Date();
  const day = (offset) => { const d = new Date(today); d.setDate(d.getDate() + offset); return d.toISOString(); };

  const doctors = [
    { portfolio_id: 'p1', doctor_name: 'د. طارق حسن', specialty: 'أطفال وحديثي الولادة', specialty_key: 'pediatrics', title: 'استشاري', city: 'القاهرة', address: 'مصر الجديدة - ميدان الحجاز', average_rating: 4.9, reviews_count: 142, sessions_count: 1240, min_price: 300, years_experience: 15, live_queue: { current_number: 4, waiting: 6 }, next_available: day(0) },
    { portfolio_id: 'p2', doctor_name: 'د. ليلى نور', specialty: 'جلدية وتجميل', specialty_key: 'dermatology', title: 'استشارية', city: 'الجيزة', address: 'الدقي - شارع مصدق', average_rating: 4.95, reviews_count: 184, sessions_count: 980, min_price: 350, years_experience: 12, live_queue: null, next_available: day(0) },
    { portfolio_id: 'p3', doctor_name: 'د. أمير المنصوري', specialty: 'قلب وأوعية دموية', specialty_key: 'cardiology', title: 'أستاذ', city: 'القاهرة', address: 'العباسية - برج الأطباء', average_rating: 4.8, reviews_count: 96, sessions_count: 2100, min_price: 500, years_experience: 22, live_queue: { current_number: 9, waiting: 3 }, next_available: day(1) },
    { portfolio_id: 'p4', doctor_name: 'د. منى زهران', specialty: 'أسنان', specialty_key: 'dentistry', title: 'أخصائي', city: 'الإسكندرية', address: 'سموحة - شارع فوزي معاذ', average_rating: 4.7, reviews_count: 61, sessions_count: 430, min_price: 250, years_experience: 8, live_queue: null, next_available: day(2) },
    { portfolio_id: 'p5', doctor_name: 'د. حسام الشريف', specialty: 'عيون', specialty_key: 'ophthalmology', title: 'استشاري', city: 'القاهرة', address: 'المعادي - شارع 9', average_rating: 4.6, reviews_count: 77, sessions_count: 760, min_price: 400, years_experience: 14, live_queue: { current_number: 2, waiting: 8 }, next_available: day(0) },
    { portfolio_id: 'p6', doctor_name: 'د. رانيا النجار', specialty: 'باطنة', specialty_key: 'internal', title: 'استشارية', city: 'المنصورة', address: 'المنصورة - شارع الجمهورية', average_rating: 4.85, reviews_count: 120, sessions_count: 1500, min_price: 300, years_experience: 17, live_queue: null, next_available: day(1) }
  ];
  const services = [
    { service_id: 's1', title: 'كشف عيادة', description: 'فحص سريري متكامل وتشخيص وكتابة الروشتة.', price: 350, duration_minutes: 25, type: 'booking' },
    { service_id: 's2', title: 'استشارة متابعة', description: 'متابعة نتائج العلاج خلال أسبوعين من الكشف السابق.', price: 150, duration_minutes: 15, type: 'consulting' }
  ];
  const notifications = [
    { notification_id: 'n1', type: 'turn_warning', title: 'اقترب دورك عند د. طارق حسن', message: 'رقم دورك #06 ويتم الكشف الآن على #04. توجّه لصالة الانتظار.', is_read: false, related_entity_type: 'booking_item', related_entity_id: 'bi1', created_at: new Date(Date.now() - 2 * 60000).toISOString() },
    { notification_id: 'n2', type: 'booking_accepted', title: 'تم تأكيد حجزك', message: 'وافقت د. ليلى نور على حجزك يوم الغد الساعة 06:00 م.', is_read: false, related_entity_type: 'booking_item', related_entity_id: 'bi2', created_at: new Date(Date.now() - 2 * 3600000).toISOString() },
    { notification_id: 'n3', type: 'report_ready', title: 'روشتة جديدة متاحة', message: 'أصدر د. أمير المنصوري تقرير الكشف والروشتة.', is_read: false, related_entity_type: 'report', related_entity_id: 'r1', created_at: new Date(Date.now() - 26 * 3600000).toISOString() },
    { notification_id: 'n4', type: 'booking_rejected', title: 'تعذّر قبول الحجز', message: 'اعتذر د. حسام الشريف عن موعد الأحد لاكتمال العدد.', is_read: true, related_entity_type: 'booking_item', related_entity_id: 'bi4', created_at: new Date(Date.now() - 3 * 86400000).toISOString() },
    { notification_id: 'n5', type: 'system', title: 'تسجيل دخول من جهاز جديد', message: 'تم تسجيل الدخول إلى حسابك من Chrome على Windows.', is_read: true, related_entity_type: null, related_entity_id: null, created_at: new Date(Date.now() - 5 * 86400000).toISOString() }
  ];
  const bookings = [
    { booking_id: 'b1', booking_item_id: 'bi1', portfolio_id: 'p1', doctor: 'د. طارق حسن', specialty: 'أطفال وحديثي الولادة', date: day(0), time: '18:30', queue_number: 6, type: 'booking', status: 'accepted' },
    { booking_id: 'b2', booking_item_id: 'bi2', portfolio_id: 'p2', doctor: 'د. ليلى نور', specialty: 'جلدية وتجميل', date: day(1), time: '18:00', queue_number: 3, type: 'consulting', status: 'pending' },
    { booking_id: 'b3', booking_item_id: 'bi3', portfolio_id: 'p3', doctor: 'د. أمير المنصوري', specialty: 'قلب وأوعية دموية', date: day(-12), time: '17:15', queue_number: 7, type: 'booking', status: 'completed', report_id: 'r1' },
    { booking_id: 'b4', booking_item_id: 'bi4', portfolio_id: 'p5', doctor: 'د. حسام الشريف', specialty: 'عيون', date: day(-3), time: '19:00', queue_number: 11, type: 'booking', status: 'rejected' }
  ];
  let queueCurrent = 3;

  const routes = [
    ['POST', /^\/api\/auth\/login$/, (b) => {
      if (!b?.email || !b?.password) return { status: 'error', code: 400, message: 'البريد الإلكتروني وكلمة المرور مطلوبان' };
      if (b.password === 'wrong') return { status: 'error', code: 401, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
      const role = /admin/.test(b.email) ? 'admin' : /doctor|dr\./.test(b.email) ? 'doctor' : 'patient';
      return ok({ user: { user_id: 'u1', name: 'أحمد محمود', email: b.email, role }, requires_2fa: role !== 'patient' }, 'تم تسجيل الدخول بنجاح');
    }],
    ['POST', /^\/api\/auth\/2fa\/verify$/, (b) => (/^\d{6}$/.test(b?.token || '') && b.token !== '000000'
      ? ok({ user: { role: 'doctor' } }, 'تم التحقق بنجاح') : { status: 'error', code: 400, message: 'رمز التحقق غير صحيح أو منتهي الصلاحية' })],
    ['POST', /^\/api\/auth\/logout$/, () => ok(null, 'تم تسجيل الخروج')],
    ['GET', /^\/api\/auth\/me$/, () => ok({ user: { user_id: 'u1', name: 'أحمد محمود', email: 'ahmed@example.com', role: 'patient', status: 'active' } })],

    ['GET', /^\/api\/notifications\/unread-count$/, () => ok({ unread_count: notifications.filter((n) => !n.is_read).length })],
    ['GET', /^\/api\/notifications$/, (_, q) => {
      let items = notifications.slice();
      if (q.get('is_read') === 'false') items = items.filter((n) => !n.is_read);
      if (q.get('type')) items = items.filter((n) => q.get('type').split(',').includes(n.type));
      return list(items, +q.get('page') || 1, +q.get('limit') || 20);
    }],
    ['PATCH', /^\/api\/notifications\/read-all$/, () => { const c = notifications.filter((n) => !n.is_read).length; notifications.forEach((n) => (n.is_read = true)); return ok({ updated_count: c }, 'تم تحديد الكل كمقروء'); }],
    ['PATCH', /^\/api\/notifications\/([^/]+)\/read$/, (b, q, m) => { const n = notifications.find((x) => x.notification_id === m[1]); if (n) n.is_read = b?.is_read ?? true; return ok({ notification: n }); }],
    ['DELETE', /^\/api\/notifications\/([^/]+)$/, (b, q, m) => { const i = notifications.findIndex((x) => x.notification_id === m[1]); if (i > -1) notifications.splice(i, 1); return ok(null, 'تم حذف الإشعار'); }],

    ['GET', /^\/api\/public\/doctors$/, (_, q) => {
      let items = doctors.slice();
      const term = (q.get('q') || '').trim();
      if (term) items = items.filter((d) => d.doctor_name.includes(term) || d.specialty.includes(term));
      if (q.get('specialty')) items = items.filter((d) => d.specialty_key === q.get('specialty'));
      if (q.get('city')) items = items.filter((d) => d.city === q.get('city'));
      if (q.get('min_rating')) items = items.filter((d) => d.average_rating >= +q.get('min_rating'));
      if (q.get('available') === 'true') items = items.filter((d) => new Date(d.next_available).toDateString() === today.toDateString());
      if (q.get('sort') === 'price') items.sort((a, b) => a.min_price - b.min_price);
      if (q.get('sort') === 'rating') items.sort((a, b) => b.average_rating - a.average_rating);
      return list(items, +q.get('page') || 1, +q.get('limit') || 12);
    }],
    ['GET', /^\/api\/public\/doctors\/([^/]+)$/, (b, q, m) => {
      const d = doctors.find((x) => x.portfolio_id === m[1]); if (!d) return { status: 'error', code: 404, message: 'الطبيب غير موجود' };
      return ok({ doctor: d, services, rating: d.average_rating, working_hours: [{ day: 'السبت - الخميس', from: '17:00', to: '21:00' }], reviews: [] });
    }],
    ['GET', /^\/api\/public\/portfolios\/([^/]+)\/services$/, () => ok({ services })],
    ['GET', /^\/api\/bookings\/slots$/, (_, q) => {
      const d = new Date(q.get('date')); const seed = d.getDate();
      const times = ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'];
      return ok({ slots: times.map((t, i) => ({ appointment_time: t, total_patients: 10, remaining: (seed * (i + 3)) % 7 === 0 ? 0 : ((seed + i) % 6) + 1 })) });
    }],
    ['POST', /^\/api\/patient\/bookings$/, (b) => {
      if (!b?.portfolio_id || !b?.appointment_date || !b?.appointment_time) return { status: 'error', code: 400, message: 'من فضلك اختر الخدمة والموعد' };
      return ok({ booking: { booking_id: 'b9', booking_item_id: 'bi1', status: 'pending', queue_number: 6, ...b } }, 'تم إرسال طلب الحجز وفي انتظار موافقة الطبيب');
    }],

    ['GET', /^\/api\/patient\/dashboard$/, () => ok({
      upcoming: bookings[0],
      queue: { booking_item_id: 'bi1', queue_number: 6, current_number: queueCurrent, patients_ahead: 6 - queueCurrent - 1, estimated_wait_minutes: (6 - queueCurrent) * 9 },
      counts: { upcoming: 2, completed: 12, pending: 1, cancelled: 1 },
      recent_notifications: notifications.slice(0, 3)
    })],
    ['GET', /^\/api\/patient\/bookings$/, (_, q) => {
      let items = bookings.slice(); const s = q.get('status');
      if (s) items = items.filter((x) => s.split(',').includes(x.status));
      return list(items, +q.get('page') || 1, +q.get('limit') || 10);
    }],
    ['PATCH', /^\/api\/patient\/bookings\/([^/]+)\/cancel$/, (b, q, m) => { const x = bookings.find((k) => k.booking_id === m[1]); if (x) x.status = 'cancelled'; return ok({ booking: x }, 'تم إلغاء الحجز'); }],
    ['GET', /^\/api\/patient\/queue\/([^/]+)$/, () => {
      if (queueCurrent < 5 && Math.random() > 0.55) queueCurrent++;
      const mine = 6;
      return ok({ queue_number: mine, current_number: queueCurrent, patients_ahead: Math.max(0, mine - queueCurrent - 1), estimated_wait_minutes: Math.max(0, (mine - queueCurrent - 1) * 9), status: 'accepted', doctor: { name: 'د. طارق حسن', specialty: 'أطفال وحديثي الولادة', address: 'مصر الجديدة - ميدان الحجاز', phone: '0223456789' }, appointment_date: day(0), appointment_time: '18:30', attempts_remaining: 1, total_today: 18, completed_today: queueCurrent - 1 });
    }],
    ['PATCH', /^\/api\/patient\/queue\/([^/]+)\/confirm$/, () => ok({ booking_item: { status: 'accepted' } }, 'تم تأكيد حضورك')],
    ['PATCH', /^\/api\/patient\/queue\/([^/]+)\/decline$/, () => ok({ attempts_remaining: 0, booking_item: { status: 'accepted' } }, 'تم تأجيل دورك')],

    ['GET', /^\/api\/patient\/medical-history$/, () => ok({
      chronic_diseases: [{ name: 'ارتفاع ضغط الدم', since: '2022-05-01', status: 'مستقر', doctor: 'د. طارق حسن' }, { name: 'ربو قصبي موسمي', since: '2019-10-01', status: 'موسمي', doctor: 'د. منى عبد الرؤوف' }],
      allergies: [{ name: 'البنسلين ومشتقاته', severity: 'critical', reaction: 'طفح جلدي حاد وضيق تنفس' }],
      medications: [{ name: 'كونكور 5 ملغ', dosage: 'قرص واحد', frequency: 'صباحاً بعد الإفطار', doctor: 'د. طارق حسن', since: '2023-06-15', ongoing: true }, { name: 'فنتولين 100mcg', dosage: 'بخة إلى بختين', frequency: 'عند اللزوم', doctor: 'مركز رعاية الصدر', ongoing: false }],
      past_history: [{ title: 'استئصال الزائدة الدودية', date: '2015-03-10', note: 'مستشفى القصر العيني' }],
      visits: [{ booking_item_id: 'bi3', report_id: 'r1', doctor: 'د. أمير المنصوري', specialty: 'قلب وأوعية دموية', date: day(-12), diagnosis: 'نبضات أذينية زائدة حميدة' }, { booking_item_id: 'bi7', report_id: 'r2', doctor: 'د. حسام الشريف', specialty: 'عيون', date: day(-70), diagnosis: 'جفاف بالعين' }]
    })],
    ['GET', /^\/api\/patient\/reports$/, () => list([{ report_id: 'r1', doctor: 'د. أمير المنصوري', specialty: 'قلب وأوعية دموية', date: day(-12) }, { report_id: 'r2', doctor: 'د. حسام الشريف', specialty: 'عيون', date: day(-70) }])],
    ['GET', /^\/api\/(?:patient\/)?reports\/([^/]+)$/, (b, q, m) => ok({ report: {
      report_id: m[1], created_at: day(-12), booking_item_id: 'bi3', queue_number: 7, type: 'booking',
      doctor: { name: 'د. أمير المنصوري', specialty: 'قلب وأوعية دموية', title: 'أستاذ أمراض القلب', syndicate_number: '19842', portfolio_id: 'p3' },
      patient: { name: 'أحمد محمود', age: 38, phone: '01012345678' },
      symptoms: 'خفقان متقطع وضيق تنفس خفيف بعد المجهود منذ أسبوعين.',
      diagnosis: 'نبضات فوق بطينية زائدة حميدة، رسم القلب والإيكو سليمان.',
      description: 'تقليل الكافيين والمنبهات، النوم المنتظم 7-8 ساعات، والمتابعة بعد شهرين.',
      medicines: [
        { name: 'Concor 2.5 mg', dosage: 'قرص واحد', frequency: 'صباحاً قبل الإفطار', duration: '30 يوماً', instructions: 'لا يُوقف فجأة دون استشارة الطبيب' },
        { name: 'Magnesium Plus', dosage: 'كبسولة واحدة', frequency: 'مساءً بعد العشاء', duration: '60 يوماً', instructions: 'مكمل غذائي' }
      ],
      reviewed: false
    } })]
  ];

  async function handle(method, url, body) {
    const u = new URL(url, location.origin);
    for (const [m, re, fn] of routes) {
      const match = m === method.toUpperCase() && u.pathname.match(re);
      if (match) { await wait(250 + Math.random() * 350); return fn(body, u.searchParams, match); }
    }
    return null; // fall through to the real network
  }

  window.DoctoryMock = { handle, doctors };
})();
