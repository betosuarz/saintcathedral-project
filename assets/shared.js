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
    newsletter_already: 'Este correo ya está suscrito.',
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
    newsletter_already: 'This email is already subscribed.',
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
    newsletter_already: 'Cet e-mail est déjà abonné.',
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
    newsletter_already: 'Diese E-Mail ist bereits angemeldet.',
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
    newsletter_already: 'Este email já está subscrito.',
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
    newsletter_already: 'Questa email è già iscritta.',
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
    newsletter_already: '이미 구독된 이메일입니다.',
    lamp_open: '지금 개방', lamp_closed: '폐관',
    day_names: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
    open_prefix: '오늘 개방',
  },
  eu: {
    nav_tickets: 'Sarrerak',
    menu_1: 'Hasiera', menu_2: 'Monumentuak', menu_3: 'Bisitaldiak',
    menu_4: 'Erreserbak', menu_5: 'Albisteak', menu_6: 'Denda',
    footer_desc: 'Zortzi mende historia, arte eta debozio Frantziako Bidearen bihotzean. Gizadiaren ondare bizia.',
    footer_col_visit: 'Bisita',
    footer_visit_1: 'Nola iritsi', footer_visit_2: 'Ordutegia', footer_visit_3: 'Tarifak',
    footer_visit_4: 'Bisita irisgarria', footer_visit_5: 'Taldeak',
    footer_col_discover: 'Aurkitu',
    footer_disc_1: 'Historia', footer_disc_2: 'Katedrala', footer_disc_3: 'Dorre Exentua',
    footer_disc_4: 'Komentua', footer_disc_5: 'Cañasetako Monasterioa',
    footer_col_info: 'Informazioa',
    footer_info_1: 'Erreserbak', footer_info_2: 'Denda', footer_info_3: 'Kontaktua',
    footer_info_4: 'Prentsa', footer_info_5: 'Albisteak',
    footer_copy: '© 2026 Santo Domingoko Katedrala · Errioxa · Espainia',
    footer_legal_1: 'Lege oharra', footer_legal_2: 'Pribatutasuna',
    footer_legal_3: 'Cookieak', footer_legal_4: 'Irisgarritasuna',
    newsletter_eyebrow: 'Asteko buletina',
    newsletter_title: 'Bidea zure <em>sarreran</em>',
    newsletter_sub: 'Albisteak, erakusketak, ekitaldiak eta eskaintza bereziak astero.',
    newsletter_ph: 'zure@helbidea.com', newsletter_btn: 'Harpidetu',
    newsletter_already: 'Helbide elektroniko hau dagoeneko harpideduna da.',
    lamp_open: 'Irekita orain', lamp_closed: 'Itxita',
    day_names: ['Igandea', 'Astelehena', 'Asteartea', 'Asteazkena', 'Osteguna', 'Ostirala', 'Larunbata'],
    open_prefix: 'Gaur irekita',
  },
  ca: {
    nav_tickets: 'Entrades',
    menu_1: 'Inici', menu_2: 'Monuments', menu_3: 'Visites',
    menu_4: 'Reserves', menu_5: 'Actualitat', menu_6: 'Botiga',
    footer_desc: 'Vuit segles d\'història, art i devoció al cor del Camí Francès. Patrimoni viu de la humanitat.',
    footer_col_visit: 'Visita',
    footer_visit_1: 'Com arribar', footer_visit_2: 'Horaris', footer_visit_3: 'Tarifes',
    footer_visit_4: 'Visita accessible', footer_visit_5: 'Grups',
    footer_col_discover: 'Descobreix',
    footer_disc_1: 'Història', footer_disc_2: 'Catedral', footer_disc_3: 'Torre Exempta',
    footer_disc_4: 'Convent', footer_disc_5: 'Monestir de Cañas',
    footer_col_info: 'Informació',
    footer_info_1: 'Reserves', footer_info_2: 'Botiga', footer_info_3: 'Contacte',
    footer_info_4: 'Premsa', footer_info_5: 'Actualitat',
    footer_copy: '© 2026 Catedral de Santo Domingo de la Calzada · La Rioja · Espanya',
    footer_legal_1: 'Avís legal', footer_legal_2: 'Privacitat',
    footer_legal_3: 'Cookies', footer_legal_4: 'Accessibilitat',
    newsletter_eyebrow: 'Butlletí setmanal',
    newsletter_title: 'El Camí a la teva <em>safata d\'entrada</em>',
    newsletter_sub: 'Notícies, exposicions, esdeveniments i ofertes exclusives cada setmana.',
    newsletter_ph: 'el-teu@correu.com', newsletter_btn: 'Subscriure\'m',
    newsletter_already: 'Aquest correu ja està subscrit.',
    lamp_open: 'Obert ara', lamp_closed: 'Tancat',
    day_names: ['Diumenge', 'Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres', 'Dissabte'],
    open_prefix: 'Obert avui',
  }
};

const FLAGS = { es: '🇪🇸', en: '🇬🇧', fr: '🇫🇷', de: '🇩🇪', pt: '🇵🇹', it: '🇮🇹', ko: '🇰🇷', eu: 'EU', ca: 'CA' };
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
// Pega aquí la URL del Web App de Google Apps Script tras desplegarlo
const NEWSLETTER_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzK99LUYg5jY-gTY3JCUQiwDRopGnu6NcmASbilDcq5o9lUcLOuu6SCjKmzPlk2DS-9/exec';

function initNewsletter() {
  document.querySelectorAll('.newsletter-form').forEach(form => {
    // Envolver el formulario en un wrapper de columna
    const wrap = document.createElement('div');
    wrap.className = 'newsletter-form-wrap';
    form.before(wrap);
    wrap.appendChild(form);

    // Mensaje debajo del input, dentro del wrapper
    const msg = document.createElement('p');
    msg.className = 'newsletter-msg';
    wrap.appendChild(msg);

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const input = form.querySelector('input');
      const btn   = form.querySelector('button');
      const email = input ? input.value.trim() : '';
      if (!email) return;

      msg.textContent = '';
      const orig = btn.textContent;
      btn.textContent = '...';
      btn.disabled = true;

      try {
        const url  = `${NEWSLETTER_SCRIPT_URL}?action=subscribe&email=${encodeURIComponent(email)}`;
        const res  = await fetch(url);
        const data = await res.json();

        if (data.alreadySubscribed) {
          const lang = localStorage.getItem('lang') || 'es';
          msg.textContent = (SHARED_T[lang] || SHARED_T.es).newsletter_already;
          msg.style.color = '#c9a84c';
          btn.textContent = orig;
          btn.disabled = false;
        } else {
          btn.textContent = '✓';
          btn.style.background = '#6a9e4f';
          if (input) input.value = '';
          setTimeout(() => {
            btn.textContent = orig;
            btn.style.background = '';
            btn.disabled = false;
            msg.textContent = '';
          }, 3000);
        }
      } catch (_) {
        // Red caída — éxito optimista
        btn.textContent = '✓';
        btn.style.background = '#6a9e4f';
        if (input) input.value = '';
        setTimeout(() => {
          btn.textContent = orig;
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      }
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

/* ── ACCESSIBILITY WIDGET ─────────────────────────────────────── */
function initA11y() {
  const toggle   = document.getElementById('a11y-toggle');
  const panel    = document.getElementById('a11y-panel');
  const overlay  = document.getElementById('a11y-overlay');
  const closeBtn = document.getElementById('a11y-panel-close');
  if (!toggle || !panel) return;

  function openPanel() {
    panel.classList.add('is-open');
    overlay?.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    panel.setAttribute('aria-hidden', 'false');
  }

  function closePanel() {
    panel.classList.remove('is-open');
    overlay?.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    panel.setAttribute('aria-hidden', 'true');
  }

  toggle.addEventListener('click', e => {
    e.stopPropagation();
    panel.classList.contains('is-open') ? closePanel() : openPanel();
  });

  closeBtn?.addEventListener('click', closePanel);
  overlay?.addEventListener('click', closePanel);

  document.addEventListener('click', e => {
    if (!panel.contains(e.target) && e.target !== toggle) closePanel();
  });

  // ── Tamaño de texto ──────────────────────────────────────────
  let textLevel = parseInt(localStorage.getItem('a11y-text') || '0', 10);
  _a11yApplyText(textLevel);

  document.getElementById('a11y-text-increase')?.addEventListener('click', () => {
    if (textLevel < 3) { textLevel++; _a11yApplyText(textLevel); }
  });
  document.getElementById('a11y-text-decrease')?.addEventListener('click', () => {
    if (textLevel > -2) { textLevel--; _a11yApplyText(textLevel); }
  });

  document.getElementById('a11y-reset')?.addEventListener('click', _a11yReset);

  // ── Leer texto ───────────────────────────────────────────────
  const readerBtn = document.getElementById('a11y-text-reader');
  if (readerBtn) {
    if (!window.speechSynthesis) {
      readerBtn.disabled = true;
      readerBtn.title = 'No soportado en este navegador';
    } else {
      readerBtn.addEventListener('click', () => {
        _a11yToggleReader();
      });
      window.speechSynthesis.addEventListener?.('end', () => _a11yStopReader());
    }
  }

  // ── Fuente legible ───────────────────────────────────────────
  if (localStorage.getItem('a11y-readable-font') === '1') _a11yApplyReadableFont(true);

  document.getElementById('a11y-readable-font')?.addEventListener('click', () => {
    _a11yApplyReadableFont(!document.body.classList.contains('a11y-readable-font'));
  });

  // ── Subrayar enlaces ─────────────────────────────────────────
  if (localStorage.getItem('a11y-underline-links') === '1') _a11yApplyUnderlineLinks(true);

  document.getElementById('a11y-underline-links')?.addEventListener('click', () => {
    _a11yApplyUnderlineLinks(!document.body.classList.contains('a11y-underline-links'));
  });

  // ── Invertir colores ─────────────────────────────────────────
  if (localStorage.getItem('a11y-invert') === '1') _a11yApplyInvert(true);

  document.getElementById('a11y-invert')?.addEventListener('click', () => {
    _a11yApplyInvert(!document.getElementById('a11y-invert-layer'));
  });

  // ── Alto contraste ───────────────────────────────────────────
  if (localStorage.getItem('a11y-high-contrast') === '1') _a11yApplyHighContrast(true);

  document.getElementById('a11y-high-contrast')?.addEventListener('click', () => {
    _a11yApplyHighContrast(!document.body.classList.contains('a11y-high-contrast'));
  });

  // ── Escala de grises ─────────────────────────────────────────
  if (localStorage.getItem('a11y-grayscale') === '1') _a11yApplyGrayscale(true);

  document.getElementById('a11y-grayscale')?.addEventListener('click', () => {
    _a11yApplyGrayscale(!document.body.classList.contains('a11y-grayscale'));
  });
}

function _a11yApplyText(level) {
  document.documentElement.style.fontSize = (16 + level * 2) + 'px';
  if (level === 0) localStorage.removeItem('a11y-text');
  else localStorage.setItem('a11y-text', level);

  const inc = document.getElementById('a11y-text-increase');
  const dec = document.getElementById('a11y-text-decrease');
  if (inc) { inc.classList.toggle('is-active', level > 0); inc.setAttribute('aria-pressed', level > 0 ? 'true' : 'false'); }
  if (dec) { dec.classList.toggle('is-active', level < 0); dec.setAttribute('aria-pressed', level < 0 ? 'true' : 'false'); }
}

function _a11yApplyGrayscale(on) {
  document.body.classList.toggle('a11y-grayscale', on);
  if (on) localStorage.setItem('a11y-grayscale', '1');
  else localStorage.removeItem('a11y-grayscale');
  const btn = document.getElementById('a11y-grayscale');
  if (btn) { btn.classList.toggle('is-active', on); btn.setAttribute('aria-pressed', String(on)); }
}

function _buildReaderContent() {
  const sections = [...document.querySelectorAll('section')];
  const roots = sections.length ? sections : [document.body];
  const SKIP = '#a11y-panel,.a11y-toggle,nav,.side-menu,footer,.cursor,script,style,noscript';
  const map = [];
  let text = '';

  function walk(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      map.push({ node, start: text.length, end: text.length + node.textContent.length });
      text += node.textContent;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.matches(SKIP)) return;
      for (const child of node.childNodes) walk(child);
    }
  }
  roots.forEach(root => walk(root));
  return { text, map };
}

function _highlightReaderWord(charIndex, charLength, map) {
  const endIndex = charIndex + charLength;
  let startEntry = null, endEntry = null;

  for (const entry of map) {
    if (!startEntry && charIndex < entry.end && charIndex >= entry.start) startEntry = entry;
    if (startEntry && endIndex <= entry.end) { endEntry = entry; break; }
  }
  if (!startEntry) return;
  if (!endEntry) endEntry = map[map.length - 1];

  try {
    const range = document.createRange();
    range.setStart(startEntry.node, charIndex - startEntry.start);
    range.setEnd(endEntry.node, Math.min(endIndex - endEntry.start, endEntry.node.textContent.length));
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    startEntry.node.parentElement?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } catch (e) { /* swallow range errors */ }
}

function _a11yToggleReader() {
  if (document.body.classList.contains('a11y-reading')) {
    _a11yStopReader();
    return;
  }

  const sel = window.getSelection();
  const selectedText = sel && sel.toString().trim();

  if (selectedText) {
    _a11yStartReader(selectedText, null);
  } else {
    const content = _buildReaderContent();
    _a11yStartReader(content.text, content.map);
  }
}

function _a11yStartReader(text, map) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();

  const langMap = { es:'es-ES', en:'en-GB', fr:'fr-FR', de:'de-DE', pt:'pt-PT', it:'it-IT', ko:'ko-KR' };
  const lang = langMap[localStorage.getItem('cat-lang')] || 'es-ES';

  const utterance = new SpeechSynthesisUtterance(text.trim());
  utterance.lang = lang;
  utterance.rate = 0.92;

  if (map) {
    utterance.addEventListener('boundary', e => {
      _highlightReaderWord(e.charIndex, e.charLength || 1, map);
    });
  }

  utterance.onend = _a11yStopReader;
  utterance.onerror = _a11yStopReader;

  window.speechSynthesis.speak(utterance);
  document.body.classList.add('a11y-reading');
  const btn = document.getElementById('a11y-text-reader');
  if (btn) { btn.classList.add('is-active'); btn.setAttribute('aria-pressed', 'true'); btn.textContent = ''; btn.insertAdjacentHTML('afterbegin', '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Detener lectura'); }
}

function _a11yStopReader() {
  window.speechSynthesis?.cancel();
  window.getSelection()?.removeAllRanges();
  document.body.classList.remove('a11y-reading');
  const btn = document.getElementById('a11y-text-reader');
  if (btn) { btn.classList.remove('is-active'); btn.setAttribute('aria-pressed', 'false'); btn.textContent = ''; btn.insertAdjacentHTML('afterbegin', '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg> Leer texto'); }
}

function _a11yApplyReadableFont(on) {
  document.body.classList.toggle('a11y-readable-font', on);
  if (on) localStorage.setItem('a11y-readable-font', '1');
  else localStorage.removeItem('a11y-readable-font');
  const btn = document.getElementById('a11y-readable-font');
  if (btn) { btn.classList.toggle('is-active', on); btn.setAttribute('aria-pressed', String(on)); }
}

function _a11yApplyUnderlineLinks(on) {
  document.body.classList.toggle('a11y-underline-links', on);
  if (on) localStorage.setItem('a11y-underline-links', '1');
  else localStorage.removeItem('a11y-underline-links');
  const btn = document.getElementById('a11y-underline-links');
  if (btn) { btn.classList.toggle('is-active', on); btn.setAttribute('aria-pressed', String(on)); }
}

function _a11yApplyInvert(on) {
  let layer = document.getElementById('a11y-invert-layer');
  if (on) {
    if (!layer) {
      layer = document.createElement('div');
      layer.id = 'a11y-invert-layer';
      document.body.appendChild(layer);
    }
    localStorage.setItem('a11y-invert', '1');
  } else {
    layer?.remove();
    localStorage.removeItem('a11y-invert');
  }
  const btn = document.getElementById('a11y-invert');
  if (btn) { btn.classList.toggle('is-active', on); btn.setAttribute('aria-pressed', String(on)); }
}

function _a11yApplyHighContrast(on) {
  document.body.classList.toggle('a11y-high-contrast', on);
  if (on) localStorage.setItem('a11y-high-contrast', '1');
  else localStorage.removeItem('a11y-high-contrast');
  const btn = document.getElementById('a11y-high-contrast');
  if (btn) { btn.classList.toggle('is-active', on); btn.setAttribute('aria-pressed', String(on)); }
}

function _a11yReset() {
  _a11yApplyText(0);
  _a11yApplyGrayscale(false);
  _a11yApplyInvert(false);
  _a11yApplyHighContrast(false);
  _a11yApplyUnderlineLinks(false);
  _a11yApplyReadableFont(false);
  _a11yStopReader();
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
  initA11y();
});