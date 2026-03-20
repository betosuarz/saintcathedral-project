/* ═══════════════════════════════════════════════════════════════
   CATEDRAL DE SANTO DOMINGO DE LA CALZADA
   shared.js — JavaScript compartido por TODAS las páginas
   Incluye: cursor, navbar, side-menu, lang-selector + i18n,
            scroll-reveal, drag-scroll, info-bar, newsletter
═══════════════════════════════════════════════════════════════ */

/* ── TRADUCCIONES GLOBALES ───────────────────────────────────── */
/* Claves usadas en TODAS las páginas (navbar, menu, footer).
   Cada página puede ampliar con su propio objeto PAGE_T.         */
const SHARED_T = {
  es: {
    nav_tickets: 'Entradas',
    menu_1: 'Inicio', menu_2: 'Monumentos', menu_3: 'Visitas',
    menu_4: 'Reservas', menu_5: 'Actualidad', menu_6: 'Tienda',
    footer_desc: 'Ocho siglos de historia, arte y devoción en el corazón del Camino Francés. Patrimonio vivo de la humanidad.',
    footer_col_visit: 'Visita',
    footer_visit_1: 'Cómo llegar', footer_visit_2: 'Horarios', footer_visit_3: 'Tarifas',
    footer_visit_4: 'Visita accesible', footer_visit_5: 'Grupos',
    footer_col_discover: 'Descubre',
    footer_disc_1: 'Historia', footer_disc_2: 'Catedral', footer_disc_3: 'Torre Exenta',
    footer_disc_4: 'Convento', footer_disc_5: 'Monasterio Cañas',
    footer_col_info: 'Información',
    footer_info_1: 'Reservas', footer_info_2: 'Tienda', footer_info_3: 'Contacto',
    footer_info_4: 'Prensa', footer_info_5: 'Actualidad',
    footer_copy: '© 2026 Catedral de Santo Domingo de la Calzada · La Rioja · España',
    footer_legal_1: 'Aviso legal', footer_legal_2: 'Privacidad',
    footer_legal_3: 'Cookies', footer_legal_4: 'Accesibilidad',
    newsletter_eyebrow: 'Newsletter semanal',
    newsletter_title: 'El Camino en tu <em>bandeja de entrada</em>',
    newsletter_sub: 'Noticias, exposiciones, eventos y ofertas exclusivas cada semana.',
    newsletter_ph: 'tu@correo.com', newsletter_btn: 'Suscribirme',
    lamp_open: 'Abierto ahora', lamp_closed: 'Cerrado',
    day_names: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    open_prefix: 'Abierta hoy',
  },
  en: {
    nav_tickets: 'Tickets',
    menu_1: 'Home', menu_2: 'Monuments', menu_3: 'Visits',
    menu_4: 'Bookings', menu_5: 'News', menu_6: 'Shop',
    footer_desc: 'Eight centuries of history, art and devotion at the heart of the French Way. Living heritage of humanity.',
    footer_col_visit: 'Visit',
    footer_visit_1: 'How to get here', footer_visit_2: 'Opening hours', footer_visit_3: 'Admission',
    footer_visit_4: 'Accessible visit', footer_visit_5: 'Groups',
    footer_col_discover: 'Discover',
    footer_disc_1: 'History', footer_disc_2: 'Cathedral', footer_disc_3: 'Freestanding Tower',
    footer_disc_4: 'Convent', footer_disc_5: 'Cañas Monastery',
    footer_col_info: 'Information',
    footer_info_1: 'Bookings', footer_info_2: 'Shop', footer_info_3: 'Contact',
    footer_info_4: 'Press', footer_info_5: 'News',
    footer_copy: '© 2026 Cathedral of Santo Domingo de la Calzada · La Rioja · Spain',
    footer_legal_1: 'Legal notice', footer_legal_2: 'Privacy',
    footer_legal_3: 'Cookies', footer_legal_4: 'Accessibility',
    newsletter_eyebrow: 'Weekly newsletter',
    newsletter_title: 'The Way in your <em>inbox</em>',
    newsletter_sub: 'News, exhibitions, events and exclusive offers every week.',
    newsletter_ph: 'your@email.com', newsletter_btn: 'Subscribe',
    lamp_open: 'Open now', lamp_closed: 'Closed',
    day_names: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    open_prefix: 'Open today',
  },
  fr: {
    nav_tickets: 'Billets',
    menu_1: 'Accueil', menu_2: 'Monuments', menu_3: 'Visites',
    menu_4: 'Réservations', menu_5: 'Actualités', menu_6: 'Boutique',
    footer_desc: 'Huit siècles d\'histoire, d\'art et de dévotion au cœur du Chemin Français. Patrimoine vivant de l\'humanité.',
    footer_col_visit: 'Visite',
    footer_visit_1: 'Comment y aller', footer_visit_2: 'Horaires', footer_visit_3: 'Tarifs',
    footer_visit_4: 'Visite accessible', footer_visit_5: 'Groupes',
    footer_col_discover: 'Découvrir',
    footer_disc_1: 'Histoire', footer_disc_2: 'Cathédrale', footer_disc_3: 'Tour indépendante',
    footer_disc_4: 'Couvent', footer_disc_5: 'Monastère de Cañas',
    footer_col_info: 'Informations',
    footer_info_1: 'Réservations', footer_info_2: 'Boutique', footer_info_3: 'Contact',
    footer_info_4: 'Presse', footer_info_5: 'Actualités',
    footer_copy: '© 2026 Cathédrale de Santo Domingo de la Calzada · La Rioja · Espagne',
    footer_legal_1: 'Mentions légales', footer_legal_2: 'Confidentialité',
    footer_legal_3: 'Cookies', footer_legal_4: 'Accessibilité',
    newsletter_eyebrow: 'Lettre hebdomadaire',
    newsletter_title: 'Le Chemin dans votre <em>boîte mail</em>',
    newsletter_sub: 'Actualités, expositions, événements et offres exclusives chaque semaine.',
    newsletter_ph: 'votre@email.com', newsletter_btn: 'S\'abonner',
    lamp_open: 'Ouvert maintenant', lamp_closed: 'Fermé',
    day_names: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    open_prefix: 'Ouverte aujourd\'hui',
  },
  de: {
    nav_tickets: 'Tickets',
    menu_1: 'Startseite', menu_2: 'Denkmäler', menu_3: 'Besuche',
    menu_4: 'Buchungen', menu_5: 'Aktuelles', menu_6: 'Shop',
    footer_desc: 'Acht Jahrhunderte Geschichte, Kunst und Andacht im Herzen des Französischen Jakobsweges. Lebendiges Erbe der Menschheit.',
    footer_col_visit: 'Besuch',
    footer_visit_1: 'Anfahrt', footer_visit_2: 'Öffnungszeiten', footer_visit_3: 'Eintrittspreise',
    footer_visit_4: 'Barrierefreier Besuch', footer_visit_5: 'Gruppen',
    footer_col_discover: 'Entdecken',
    footer_disc_1: 'Geschichte', footer_disc_2: 'Kathedrale', footer_disc_3: 'Freistehender Turm',
    footer_disc_4: 'Kloster', footer_disc_5: 'Kloster Cañas',
    footer_col_info: 'Information',
    footer_info_1: 'Buchungen', footer_info_2: 'Shop', footer_info_3: 'Kontakt',
    footer_info_4: 'Presse', footer_info_5: 'Aktuelles',
    footer_copy: '© 2026 Kathedrale von Santo Domingo de la Calzada · La Rioja · Spanien',
    footer_legal_1: 'Impressum', footer_legal_2: 'Datenschutz',
    footer_legal_3: 'Cookies', footer_legal_4: 'Barrierefreiheit',
    newsletter_eyebrow: 'Wöchentlicher Newsletter',
    newsletter_title: 'Der Camino in Ihrem <em>Posteingang</em>',
    newsletter_sub: 'Neuigkeiten, Ausstellungen, Veranstaltungen und exklusive Angebote jede Woche.',
    newsletter_ph: 'ihre@email.com', newsletter_btn: 'Abonnieren',
    lamp_open: 'Jetzt geöffnet', lamp_closed: 'Geschlossen',
    day_names: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
    open_prefix: 'Heute geöffnet',
  },
  pt: {
    nav_tickets: 'Bilhetes',
    menu_1: 'Início', menu_2: 'Monumentos', menu_3: 'Visitas',
    menu_4: 'Reservas', menu_5: 'Notícias', menu_6: 'Loja',
    footer_desc: 'Oito séculos de história, arte e devoção no coração do Caminho Francês. Património vivo da humanidade.',
    footer_col_visit: 'Visita',
    footer_visit_1: 'Como chegar', footer_visit_2: 'Horários', footer_visit_3: 'Tarifas',
    footer_visit_4: 'Visita acessível', footer_visit_5: 'Grupos',
    footer_col_discover: 'Descobrir',
    footer_disc_1: 'História', footer_disc_2: 'Catedral', footer_disc_3: 'Torre independente',
    footer_disc_4: 'Convento', footer_disc_5: 'Mosteiro de Cañas',
    footer_col_info: 'Informação',
    footer_info_1: 'Reservas', footer_info_2: 'Loja', footer_info_3: 'Contacto',
    footer_info_4: 'Imprensa', footer_info_5: 'Notícias',
    footer_copy: '© 2026 Catedral de Santo Domingo de la Calzada · La Rioja · Espanha',
    footer_legal_1: 'Aviso legal', footer_legal_2: 'Privacidade',
    footer_legal_3: 'Cookies', footer_legal_4: 'Acessibilidade',
    newsletter_eyebrow: 'Newsletter semanal',
    newsletter_title: 'O Caminho na sua <em>caixa de entrada</em>',
    newsletter_sub: 'Notícias, exposições, eventos e ofertas exclusivas todas as semanas.',
    newsletter_ph: 'seu@email.com', newsletter_btn: 'Subscrever',
    lamp_open: 'Aberta agora', lamp_closed: 'Fechada',
    day_names: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    open_prefix: 'Aberta hoje',
  },
  it: {
    nav_tickets: 'Biglietti',
    menu_1: 'Home', menu_2: 'Monumenti', menu_3: 'Visite',
    menu_4: 'Prenotazioni', menu_5: 'Notizie', menu_6: 'Negozio',
    footer_desc: 'Otto secoli di storia, arte e devozione nel cuore del Cammino Francese. Patrimonio vivente dell\'umanità.',
    footer_col_visit: 'Visita',
    footer_visit_1: 'Come arrivare', footer_visit_2: 'Orari', footer_visit_3: 'Tariffe',
    footer_visit_4: 'Visita accessibile', footer_visit_5: 'Gruppi',
    footer_col_discover: 'Scopri',
    footer_disc_1: 'Storia', footer_disc_2: 'Cattedrale', footer_disc_3: 'Torre indipendente',
    footer_disc_4: 'Convento', footer_disc_5: 'Monastero di Cañas',
    footer_col_info: 'Informazioni',
    footer_info_1: 'Prenotazioni', footer_info_2: 'Negozio', footer_info_3: 'Contatto',
    footer_info_4: 'Stampa', footer_info_5: 'Notizie',
    footer_copy: '© 2026 Cattedrale di Santo Domingo de la Calzada · La Rioja · Spagna',
    footer_legal_1: 'Note legali', footer_legal_2: 'Privacy',
    footer_legal_3: 'Cookie', footer_legal_4: 'Accessibilità',
    newsletter_eyebrow: 'Newsletter settimanale',
    newsletter_title: 'Il Cammino nella tua <em>casella di posta</em>',
    newsletter_sub: 'Notizie, mostre, eventi e offerte esclusive ogni settimana.',
    newsletter_ph: 'tua@email.com', newsletter_btn: 'Iscriviti',
    lamp_open: 'Aperta ora', lamp_closed: 'Chiusa',
    day_names: ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'],
    open_prefix: 'Aperta oggi',
  },
  ko: {
    nav_tickets: '입장권',
    menu_1: '홈', menu_2: '유적', menu_3: '관람',
    menu_4: '예약', menu_5: '뉴스', menu_6: '샵',
    footer_desc: '프랑스 길의 중심에서 8세기의 역사, 예술, 신앙. 인류의 살아있는 유산.',
    footer_col_visit: '관람',
    footer_visit_1: '오시는 길', footer_visit_2: '운영 시간', footer_visit_3: '요금',
    footer_visit_4: '접근 가능한 관람', footer_visit_5: '단체',
    footer_col_discover: '탐색',
    footer_disc_1: '역사', footer_disc_2: '대성당', footer_disc_3: '독립 종탑',
    footer_disc_4: '수도원', footer_disc_5: '카냐스 수도원',
    footer_col_info: '정보',
    footer_info_1: '예약', footer_info_2: '샵', footer_info_3: '연락처',
    footer_info_4: '언론', footer_info_5: '뉴스',
    footer_copy: '© 2026 산티아고 데 라 칼사다 대성당 · 라 리오하 · 스페인',
    footer_legal_1: '법적 고지', footer_legal_2: '개인정보',
    footer_legal_3: '쿠키', footer_legal_4: '접근성',
    newsletter_eyebrow: '주간 뉴스레터',
    newsletter_title: '카미노를 당신의 <em>수신함으로</em>',
    newsletter_sub: '매주 뉴스, 이벤트 및 독점 할인을 안내해 드립니다.',
    newsletter_ph: 'your@email.com', newsletter_btn: '구독하기',
    lamp_open: '지금 개방', lamp_closed: '폐관',
    day_names: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
    open_prefix: '오늘 개방',
  }
};

const FLAGS = { es: '🇪🇸', en: '🇬🇧', fr: '🇫🇷', de: '🇩🇪', pt: '🇵🇹', it: '🇮🇹', ko: '🇰🇷' };
let _currentLang = 'es';

/* ── APPLY SHARED TRANSLATIONS ───────────────────────────────── */
/* Llamada interna. Las páginas llaman a window.applyLang(lang)   */
function _applyShared(lang) {
  const t = SHARED_T[lang] || SHARED_T.es;

  // Navbar tickets button
  _setText('[data-i18n="nav_tickets"]', t.nav_tickets);

  // Side menu nav links
  const menuKeys = ['menu_1', 'menu_2', 'menu_3', 'menu_4', 'menu_5', 'menu_6'];
  document.querySelectorAll('.side-menu__nav-link').forEach((a, i) => {
    const key = menuKeys[i];
    if (!key || !t[key]) return;
    const span = a.querySelector('.nav-num');
    a.textContent = t[key];
    if (span) a.prepend(span);
  });

  // Footer
  _setHtml('[data-i18n="footer_col_visit"]', t.footer_col_visit);
  _setHtml('[data-i18n="footer_col_discover"]', t.footer_col_discover);
  _setHtml('[data-i18n="footer_col_info"]', t.footer_col_info);
  [1, 2, 3, 4, 5].forEach(n => {
    _setText(`[data-i18n="footer_visit_${n}"]`, t[`footer_visit_${n}`]);
    _setText(`[data-i18n="footer_disc_${n}"]`, t[`footer_disc_${n}`]);
    _setText(`[data-i18n="footer_info_${n}"]`, t[`footer_info_${n}`]);
  });
  _setText('[data-i18n="footer_copy"]', t.footer_copy);
  [1, 2, 3, 4].forEach(n => _setText(`[data-i18n="footer_legal_${n}"]`, t[`footer_legal_${n}`]));
  _setText('[data-i18n="footer_desc"]', t.footer_desc);

  // Newsletter
  _setText('[data-i18n="newsletter_eyebrow"]', t.newsletter_eyebrow);
  _setHtml('[data-i18n="newsletter_title"]', t.newsletter_title);
  _setText('[data-i18n="newsletter_sub"]', t.newsletter_sub);
  _setAttr('[data-i18n="newsletter_ph"]', 'placeholder', t.newsletter_ph);
  _setText('[data-i18n="newsletter_btn"]', t.newsletter_btn);

  // Info bar day label (if present) — always based on Madrid time
  const _madridParts = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
  const _madridH = parseInt(_madridParts.find(p => p.type === 'hour').value, 10);
  const _madridWd = _madridParts.find(p => p.type === 'weekday').value.toLowerCase();
  const _wdMap = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
  const dayIdx = _wdMap.indexOf(_madridWd) !== -1 ? _wdMap.indexOf(_madridWd) : new Date().getDay();
  const isSat = dayIdx === 6;
  const closeH = isSat ? 19 : 20;
  const dayLabel = document.getElementById('infobar-day-label');
  if (dayLabel) dayLabel.textContent = `${t.open_prefix} · ${t.day_names[dayIdx]}`;
  const hoursEl = document.getElementById('infobar-hours');
  if (hoursEl) hoursEl.textContent = `9:00 → ${closeH}:00 h`;

  // Lamp labels
  const lampLabel = document.getElementById('lamp-label');
  if (lampLabel) {
    const madridParts = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
    const mh = parseInt(madridParts.find(p => p.type === 'hour').value, 10);
    const mm = parseInt(madridParts.find(p => p.type === 'minute').value, 10);
    const isOpen = (mh > 9 || (mh === 9 && mm >= 0)) && mh < closeH;
    lampLabel.innerHTML = `<strong>${isOpen ? t.lamp_open : t.lamp_closed}</strong>`;
  }

  // Page title suffix
  const titles = {
    es: 'Catedral de Santo Domingo de la Calzada',
    en: 'Cathedral of Santo Domingo de la Calzada',
    fr: 'Cathédrale de Santo Domingo de la Calzada',
    de: 'Kathedrale von Santo Domingo de la Calzada',
    pt: 'Catedral de Santo Domingo de la Calzada',
    it: 'Cattedrale di Santo Domingo de la Calzada',
    ko: '산티아고 데 라 칼사다 대성당',
  };
  document.documentElement.lang = lang;
  // Let page-level handler update <title> if needed
  if (window.PAGE_applyLang) window.PAGE_applyLang(lang, SHARED_T[lang] || SHARED_T.es);
}

function _setText(sel, val) {
  if (!val) return;
  document.querySelectorAll(sel).forEach(el => { el.textContent = val; });
}
function _setHtml(sel, val) {
  if (!val) return;
  document.querySelectorAll(sel).forEach(el => { el.innerHTML = val; });
}
function _setAttr(sel, attr, val) {
  if (!val) return;
  document.querySelectorAll(sel).forEach(el => { el.setAttribute(attr, val); });
}

/* ── PUBLIC: applyLang ───────────────────────────────────────── */
window.applyLang = function (lang) {
  if (!SHARED_T[lang]) lang = 'es';
  _currentLang = lang;
  try { localStorage.setItem('cat-lang', lang); } catch (e) { }
  // Update dropdown UI
  const flagEl = document.getElementById('lang-current-flag');
  const codeEl = document.getElementById('lang-current-code');
  if (flagEl) flagEl.textContent = FLAGS[lang] || '🇪🇸';
  if (codeEl) codeEl.textContent = lang.toUpperCase();
  document.querySelectorAll('.lang-selector__option').forEach(o =>
    o.classList.toggle('active', o.dataset.lang === lang)
  );
  _applyShared(lang);
};

/* ── CURSOR ──────────────────────────────────────────────────── */
function initCursor() {
  const cursor = document.getElementById('cursor');
  if (!cursor) return;
  const ring = cursor.querySelector('.cursor__ring');
  const dot = cursor.querySelector('.cursor__dot');
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  });
  (function ani() { rx += (mx - rx) * .12; ry += (my - ry) * .12; ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; requestAnimationFrame(ani); })();
  document.querySelectorAll('a,button,.monument-card-hp,.visit-card,.audio-card,.pdf-card,.hero__dot').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });
}

/* ── NAVBAR ──────────────────────────────────────────────────── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  // Only add scroll listener if navbar starts transparent
  if (navbar.classList.contains('navbar--transparent')) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }
}

/* ── SIDE MENU ───────────────────────────────────────────────── */
function initMenu() {
  const sideMenu = document.getElementById('side-menu');
  const overlay = document.getElementById('menu-overlay');
  const openBtn = document.getElementById('menu-open');
  const closeBtn = document.getElementById('menu-close');
  if (!sideMenu) return;

  function openMenu() { sideMenu.classList.add('open'); overlay.classList.add('open'); document.body.classList.add('nav-open'); }
  function closeMenu() { sideMenu.classList.remove('open'); overlay.classList.remove('open'); document.body.classList.remove('nav-open'); }

  if (openBtn) openBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (overlay) overlay.addEventListener('click', closeMenu);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  sideMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
}

/* ── LANG SELECTOR ───────────────────────────────────────────── */
function initLangSelector() {
  const langSelector = document.getElementById('lang-selector');
  const langBtn = document.getElementById('lang-btn');
  if (!langSelector || !langBtn) return;

  langBtn.addEventListener('click', e => {
    e.stopPropagation();
    langSelector.classList.toggle('open');
    langBtn.setAttribute('aria-expanded', langSelector.classList.contains('open'));
  });
  document.querySelectorAll('.lang-selector__option').forEach(opt => {
    opt.addEventListener('click', () => {
      window.applyLang(opt.dataset.lang);
      langSelector.classList.remove('open');
      langBtn.setAttribute('aria-expanded', 'false');
    });
  });
  document.addEventListener('click', e => {
    if (!langSelector.contains(e.target)) {
      langSelector.classList.remove('open');
      langBtn.setAttribute('aria-expanded', 'false');
    }
  });
  // Restore saved language
  try {
    const saved = localStorage.getItem('cat-lang');
    window.applyLang(saved && SHARED_T[saved] ? saved : 'es');
  } catch (e) { window.applyLang('es'); }
}

/* ── INFO BAR STATUS LAMP ────────────────────────────────────── */
function initLamp() {
  const lamp = document.getElementById('lamp-dot');
  if (!lamp) return;
  const madridParts = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
  const dayIdx = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'].indexOf(madridParts.find(p => p.type === 'weekday').value.toLowerCase());
  const isSat = (dayIdx !== -1 ? dayIdx : new Date().getDay()) === 6;
  const closeH = isSat ? 19 : 20;
  const mh = parseInt(madridParts.find(p => p.type === 'hour').value, 10);
  const mm = parseInt(madridParts.find(p => p.type === 'minute').value, 10);
  const isOpen = (mh > 9 || (mh === 9 && mm >= 0)) && mh < closeH;
  lamp.classList.add(isOpen ? 'lamp-dot--open' : 'lamp-dot--closed');
}

/* ── SCROLL REVEAL ───────────────────────────────────────────── */
function initReveal() {
  const ro = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => ro.observe(el));
}

/* ── DRAG-TO-SCROLL ──────────────────────────────────────────── */
function initDragScroll(selector) {
  document.querySelectorAll(selector || '.h-scroll-track,.img-scroll-track').forEach(track => {
    let down = false, sx, sl;
    track.addEventListener('mousedown', e => { down = true; sx = e.pageX - track.offsetLeft; sl = track.scrollLeft; track.classList.add('is-dragging'); });
    const stop = () => { down = false; track.classList.remove('is-dragging'); };
    track.addEventListener('mouseleave', stop);
    track.addEventListener('mouseup', stop);
    window.addEventListener('mouseup', stop);
    track.addEventListener('mousemove', e => { if (!down) return; e.preventDefault(); track.scrollLeft = sl - (e.pageX - track.offsetLeft - sx) * 1.8; });
    track.addEventListener('wheel', e => { if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) { e.preventDefault(); track.scrollLeft += e.deltaY * 1.2; } }, { passive: false });
  });
}

/* ── NEWSLETTER ──────────────────────────────────────────────── */
function initNewsletter() {
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('input');
      const btn = form.querySelector('button');
      const orig = btn.textContent;
      btn.textContent = '✓';
      btn.style.background = '#6a9e4f';
      if (input) input.value = '';
      setTimeout(() => { btn.textContent = orig; btn.style.background = ''; }, 3000);
    });
  });
}

/* ── TOOLTIP KEYBOARD SUPPORT ────────────────────────────────── */
function initTooltips() {
  document.querySelectorAll('.info-icon').forEach(icon => {
    icon.addEventListener('focus', () => icon.classList.add('focused'));
    icon.addEventListener('blur', () => icon.classList.remove('focused'));
  });
}

/* ── INIT ALL ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initNavbar();
  initMenu();
  initLangSelector();  // también llama a applyLang que ejecuta _applyShared
  initLamp();
  initReveal();
  initDragScroll();
  initNewsletter();
  initTooltips();
});