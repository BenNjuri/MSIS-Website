/* ===== MUSTARD SEED INTERNATIONAL SCHOOLS — index.js (Premium Redesign) ===== */
'use strict';
(function () {

  /* ── Helpers ── */
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => [...(ctx || document).querySelectorAll(sel)];

  /* ─────────────────────────────────────────────
     PAGE LOADER
  ───────────────────────────────────────────── */
  const loader = $('#page-loader');
  const fill = $('#loader-fill');
  if (loader && fill) {
    let w = 0;
    const iv = setInterval(() => {
      w = Math.min(w + Math.random() * 18 + 5, 90);
      fill.style.width = w + '%';
    }, 120);
    window.addEventListener('load', () => {
      clearInterval(iv);
      fill.style.width = '100%';
      setTimeout(() => loader.classList.add('done'), 400);
      document.body.classList.remove('page-loading');
    });
  }

  /* ─────────────────────────────────────────────
     ANNOUNCEMENT RIBBON CLOSE
  ───────────────────────────────────────────── */
  $('#ribbon-close')?.addEventListener('click', () => {
    $('#ribbon')?.classList.add('hidden');
  });

  /* ─────────────────────────────────────────────
     STICKY HEADER
  ───────────────────────────────────────────── */
  const siteHeader = $('#site-header');
  window.addEventListener('scroll', () => {
    siteHeader?.classList.toggle('scrolled', window.scrollY > 60);
    // ToTop button
    $('#to-top')?.classList.toggle('show', window.scrollY > 500);
    // Active nav
    updateActiveNav();
    // Scroll reveal
    revealOnScroll();
  }, { passive: true });

  /* ─────────────────────────────────────────────
     MOBILE BURGER MENU
  ───────────────────────────────────────────── */
  const burger = $('#burger');
  const navMenu = $('#nav-menu');
  burger?.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
  });
  // Mobile dropdowns
  $$('.nav-has-sub > .nav-item').forEach(link => {
    link.addEventListener('click', (e) => {
      if (window.innerWidth > 700) return;
      e.preventDefault();
      link.closest('.nav-has-sub').classList.toggle('open');
    });
  });
  // Close on nav link click
  $$('#nav-menu a').forEach(a => {
    a.addEventListener('click', () => {
      navMenu?.classList.remove('open');
      burger?.classList.remove('open');
    });
  });

  /* ─────────────────────────────────────────────
     ACTIVE NAV — SCROLL SPY
  ───────────────────────────────────────────── */
  const navItems = $$('.nav-item[data-section]');
  const spySections = $$('section[id], .brand-strip');
  function updateActiveNav() {
    let current = '';
    spySections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navItems.forEach(ni => {
      ni.classList.toggle('active', ni.dataset.section === current);
    });
  }

  /* ─────────────────────────────────────────────
     SCROLL TO TOP
  ───────────────────────────────────────────── */
  $('#to-top')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ─────────────────────────────────────────────
     SMOOTH SCROLL for anchor links
  ───────────────────────────────────────────── */
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const offset = (siteHeader?.offsetHeight || 0) + 8;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });

  /* ─────────────────────────────────────────────
     HERO CINEMATIC SLIDER
  ───────────────────────────────────────────── */
  (function initHero() {
    const slides = $$('.hero-slide');
    const panels = $$('.hero-panel');
    const progItems = $$('.hero-prog-item');
    const fills = [0, 1, 2].map(i => $(`#p${i}`));
    let cur = 0, timer = null;
    const DELAY = 5000;

    function goTo(idx) {
      slides[cur].classList.remove('active');
      panels[cur].classList.remove('active');
      progItems[cur].classList.remove('active');
      if (fills[cur]) fills[cur].style.animation = 'none';

      cur = (idx + slides.length) % slides.length;

      slides[cur].classList.add('active');
      panels[cur].classList.add('active');
      progItems[cur].classList.add('active');
      // Restart progress animation
      if (fills[cur]) {
        fills[cur].style.animation = 'none';
        void fills[cur].offsetWidth; // reflow
        fills[cur].style.animation = `progFill ${DELAY}ms linear forwards`;
      }
    }

    function next() { goTo(cur + 1); }
    function prev() { goTo(cur - 1); }

    function startTimer() { timer = setInterval(next, DELAY); }
    function resetTimer() { clearInterval(timer); startTimer(); }

    $('#hero-next')?.addEventListener('click', () => { next(); resetTimer(); });
    $('#hero-prev')?.addEventListener('click', () => { prev(); resetTimer(); });
    progItems.forEach(p => {
      p.addEventListener('click', () => { goTo(+p.dataset.idx); resetTimer(); });
    });

    // Keyboard
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') { prev(); resetTimer(); }
      if (e.key === 'ArrowRight') { next(); resetTimer(); }
    });

    // Touch
    let tx = 0;
    const hero = $('.hero');
    hero?.addEventListener('touchstart', e => { tx = e.changedTouches[0].clientX; }, { passive: true });
    hero?.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - tx;
      if (Math.abs(dx) > 48) { dx < 0 ? next() : prev(); resetTimer(); }
    }, { passive: true });

    // Kick off
    goTo(0);
    startTimer();
  })();

  /* ─────────────────────────────────────────────
     SCHOOL TABS
  ───────────────────────────────────────────── */
  $$('.school-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.school-tab').forEach(b => b.classList.remove('active'));
      $$('.school-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      $(`#panel-${btn.dataset.tab}`)?.classList.add('active');
    });
  });

  /* ─────────────────────────────────────────────
     LIFE STRIP HORIZONTAL SLIDER
  ───────────────────────────────────────────── */
  (function initStrip() {
    const strip = $('#life-strip');
    if (!strip) return;
    const cards = $$('.life-card', strip);
    let cur = 0;

    function cardW() {
      const w = window.innerWidth;
      return w < 500 ? 290 : w < 800 ? 310 : 340;
    }
    const GAP = 22;

    function maxCur() {
      const cpv = window.innerWidth < 700 ? 1 : window.innerWidth < 1000 ? 2 : 3;
      return Math.max(0, cards.length - cpv);
    }

    function update() {
      strip.style.transform = `translateX(-${cur * (cardW() + GAP)}px)`;
    }

    $('#strip-next')?.addEventListener('click', () => { cur = Math.min(cur + 1, maxCur()); update(); });
    $('#strip-prev')?.addEventListener('click', () => { cur = Math.max(cur - 1, 0); update(); });

    let stx = 0;
    strip.addEventListener('touchstart', e => { stx = e.changedTouches[0].clientX; }, { passive: true });
    strip.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - stx;
      if (Math.abs(dx) > 40) {
        dx < 0 ? (cur = Math.min(cur + 1, maxCur())) : (cur = Math.max(cur - 1, 0));
        update();
      }
    }, { passive: true });

    window.addEventListener('resize', () => { cur = Math.min(cur, maxCur()); update(); });
  })();

  /* ─────────────────────────────────────────────
     ANIMATED STAT COUNTERS (brand strip + optional)
  ───────────────────────────────────────────── */
  let countersRun = false;
  function runCounters() {
    if (countersRun) return;
    const strip = $('.brand-strip');
    if (!strip) return;
    const rect = strip.getBoundingClientRect();
    if (rect.top > window.innerHeight) return;
    countersRun = true;
    $$('.bstrip-num[data-target]').forEach(el => {
      const target = +el.dataset.target;
      const dur = 1800;
      const step = target / (dur / 16);
      let c = 0;
      const iv = setInterval(() => {
        c = Math.min(c + step, target);
        el.textContent = Math.floor(c).toLocaleString();
        if (c >= target) clearInterval(iv);
      }, 16);
    });
  }
  window.addEventListener('scroll', runCounters, { passive: true });
  setTimeout(runCounters, 600);

  /* ─────────────────────────────────────────────
     CALENDAR WIDGET
  ───────────────────────────────────────────── */
  const EVENTS = [
    { date: '2026-03-05', name: 'Term 2 Opens', desc: 'Students return for Term 2.', type: 'g' },
    { date: '2026-03-10', name: 'Science Fair', desc: 'Annual inter-school science exhibition.', type: 'g' },
    { date: '2026-03-14', name: 'Sports Day', desc: 'Annual athletics day on our grounds.', type: 'y' },
    { date: '2026-03-19', name: 'Music Concert', desc: 'End-of-term student music showcase.', type: 'r' },
    { date: '2026-03-25', name: 'Parent-Teacher Meeting', desc: 'Progress review for all classes.', type: 'g' },
    { date: '2026-03-28', name: 'Nature Day', desc: 'Environmental awareness celebration.', type: 'y' },
    { date: '2026-04-03', name: 'Easter Break', desc: 'School closes for Easter holidays.', type: 'g' },
    { date: '2026-04-18', name: 'Art Exhibition', desc: 'Students display creative artwork.', type: 'r' },
    { date: '2026-04-24', name: 'IGCSE Mock Exams', desc: 'Senior school mocks begin.', type: 'g' },
    { date: '2026-05-01', name: 'Labour Day', desc: 'Public holiday — school closed.', type: 'y' },
  ];

  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  let calDate = new Date(2026, 2, 1);

  function buildCalendar() {
    const y = calDate.getFullYear(), m = calDate.getMonth();
    $('#cal-title').textContent = `${MONTHS[m]} ${y}`;
    const first = new Date(y, m, 1).getDay();
    const total = new Date(y, m + 1, 0).getDate();
    const prev = new Date(y, m, 0).getDate();
    const today = new Date();
    const mEvs = {};
    EVENTS.forEach(ev => {
      const d = new Date(ev.date);
      if (d.getFullYear() === y && d.getMonth() === m) mEvs[d.getDate()] = ev.type;
    });
    let html = DAYS.map(d => `<div class="cal-dh">${d}</div>`).join('');
    for (let i = first - 1; i >= 0; i--) html += `<div class="cal-d other">${prev - i}</div>`;
    for (let d = 1; d <= total; d++) {
      const isToday = y === today.getFullYear() && m === today.getMonth() && d === today.getDate();
      const ev = mEvs[d];
      let cls = 'cal-d';
      if (isToday) cls += ' today';
      if (ev === 'g' || ev === 'y') cls += ' has-ev';
      if (ev === 'r') cls += ' has-r';
      const evTitle = ev ? (EVENTS.find(e => new Date(e.date).getDate() === d && new Date(e.date).getMonth() === m)?.name || '') : '';
      html += `<div class="${cls}" title="${evTitle}">${d}</div>`;
    }
    const cells = Math.ceil((first + total) / 7) * 7;
    for (let d = 1; d <= cells - first - total; d++) html += `<div class="cal-d other">${d}</div>`;
    const calBody = $('#cal-body');
    if (calBody) calBody.innerHTML = `<div class="cal-grid">${html}</div>`;
  }

  $('#cal-prev')?.addEventListener('click', () => { calDate.setMonth(calDate.getMonth() - 1); buildCalendar(); });
  $('#cal-next')?.addEventListener('click', () => { calDate.setMonth(calDate.getMonth() + 1); buildCalendar(); });
  $$('.cal-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.cal-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
  buildCalendar();

  /* ─── Upcoming Events List ── */
  (function buildEventList() {
    const list = $('#ev-list');
    if (!list) return;
    const now = new Date();
    const upcoming = EVENTS.filter(e => new Date(e.date) >= now).slice(0, 5);
    if (!upcoming.length) {
      list.innerHTML = '<p style="color:var(--muted);font-size:.88rem">No upcoming events at this time.</p>';
      return;
    }
    list.innerHTML = upcoming.map(ev => {
      const d = new Date(ev.date);
      const ds = d.toLocaleDateString('en-KE', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
      const cls = ev.type === 'y' ? 'y-ev' : ev.type === 'r' ? 'r-ev' : '';
      return `<div class="ev-item ${cls}">
        <div class="ev-date">📅 ${ds}</div>
        <div class="ev-name">${ev.name}</div>
        <div class="ev-desc">${ev.desc}</div>
      </div>`;
    }).join('');
  })();

  /* ─────────────────────────────────────────────
     GALLERY LIGHTBOX
  ───────────────────────────────────────────── */
  (function initLightbox() {
    const lb = $('#lightbox');
    const lbImg = $('#lb-img');
    const mItems = $$('.m-item');
    const imgs = mItems.map(m => ({ src: m.querySelector('img')?.src, alt: m.querySelector('img')?.alt || '' }));
    let cur = 0;

    function open(idx) {
      cur = idx;
      lbImg.src = imgs[cur].src;
      lbImg.alt = imgs[cur].alt;
      lb.classList.add('open');
      lb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      lb.classList.remove('open');
      lb.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
    function prev() { cur = (cur - 1 + imgs.length) % imgs.length; lbImg.src = imgs[cur].src; }
    function next() { cur = (cur + 1) % imgs.length; lbImg.src = imgs[cur].src; }

    mItems.forEach((item, i) => item.addEventListener('click', () => open(i)));
    $('#lb-close')?.addEventListener('click', close);
    $('#lb-backdrop')?.addEventListener('click', close);
    $('#lb-left')?.addEventListener('click', prev);
    $('#lb-right')?.addEventListener('click', next);
    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    });
  })();

  /* ─────────────────────────────────────────────
     CONTACT FORM
  ───────────────────────────────────────────── */
  const form = $('#contact-form');
  const feedback = $('#form-feedback');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const btn = $('#cf-submit');
    btn.textContent = 'Sending…';
    btn.disabled = true;
    setTimeout(() => {
      feedback.textContent = '✅ Thank you! We\'ll be in touch shortly.';
      feedback.className = 'form-feedback success';
      feedback.style.display = 'block';
      form.reset();
      btn.textContent = 'Send Message';
      btn.disabled = false;
      setTimeout(() => { feedback.style.display = 'none'; }, 6000);
    }, 1400);
  });

  /* ─────────────────────────────────────────────
     SCROLL REVEAL (IntersectionObserver)
  ───────────────────────────────────────────── */
  function revealOnScroll() {
    $$('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 72) el.classList.add('revealed');
    });
  }
  // Prefer IntersectionObserver
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    $$('.reveal-up, .reveal-left, .reveal-right').forEach(el => obs.observe(el));
  } else {
    revealOnScroll();
    window.addEventListener('scroll', revealOnScroll, { passive: true });
  }

  /* ─────────────────────────────────────────────
     INITIAL TRIGGERS
  ───────────────────────────────────────────── */
  setTimeout(() => {
    revealOnScroll();
    runCounters();
    updateActiveNav();
  }, 300);

  /* ─────────────────────────────────────────────
     img_classroom fallback (alias)
  ───────────────────────────────────────────── */
  $$('img[src="img_classroom.png"]').forEach(img => {
    img.addEventListener('error', () => { img.src = 'img_hero3.png'; });
  });

})();
