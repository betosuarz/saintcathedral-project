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
    menu_4: 'Actualidad', menu_5: 'Institución', menu_6: 'Reservas',
    footer_desc: 'Ocho siglos de historia, arte y devoción en el corazón del Camino Francés. Patrimonio vivo de la humanidad.',
    footer_col_visit: 'Visita',
    footer_visit_1: 'Cómo llegar', footer_visit_2: 'Horarios', footer_visit_3: 'Tarifas',
    footer_visit_4: 'Visita accesible', footer_visit_5: 'Grupos',
    footer_col_discover: 'Descubre',
    footer_disc_1: 'Historia', footer_disc_2: 'Catedral', footer_disc_3: 'Torre Exenta',
    footer_disc_4: 'Convento', footer_disc_5: 'Monasterio Cañas',
    footer_col_info: 'Información',
    footer_info_1: 'Reservas', footer_info_2: 'Institución', footer_info_3: 'Contacto',
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
    a11y_title: 'Herramientas de accesibilidad', a11y_close: 'Cerrar panel de accesibilidad',
    a11y_text_increase: 'Aumentar texto', a11y_text_decrease: 'Disminuir texto',
    a11y_grayscale: 'Escala de grises', a11y_high_contrast: 'Alto contraste',
    a11y_invert: 'Invertir colores', a11y_underline_links: 'Subrayar enlaces',
    a11y_readable_font: 'Fuente legible', a11y_read_text: 'Leer texto',
    a11y_stop_read: 'Detener lectura', a11y_reset: 'Restablecer',
    a11y_not_supported: 'No soportado en este navegador',
    skip_to_content: 'Saltar al contenido principal',
    menu_legal_purchase: 'Compra', menu_legal_privacy: 'Privacidad',
    menu_legal_cookies: 'Cookies', menu_legal_notice: 'Aviso legal',
    menu_legal_a11y: 'Accesibilidad', menu_legal_contact: 'Contacto',
    cookie_title: 'Tu privacidad importa',
    cookie_desc: 'Usamos cookies para mejorar tu experiencia, analizar el tráfico y recordar tus preferencias. Puedes elegir qué cookies aceptas.',
    cookie_btn_necessary: 'Solo necesarias',
    cookie_btn_all: 'Aceptar todo',
    cookie_btn_customize: 'Personalizar',
    cookie_modal_title: 'Preferencias de cookies',
    cookie_cat_necessary: 'Necesarias',
    cookie_cat_necessary_desc: 'Imprescindibles para el funcionamiento del sitio: seguridad de sesión, idioma y configuración de accesibilidad.',
    cookie_cat_analytics: 'Analíticas',
    cookie_cat_analytics_desc: 'Nos ayudan a entender cómo se usa la web para mejorar su contenido. Los datos son anónimos.',
    cookie_cat_marketing: 'Marketing',
    cookie_cat_marketing_desc: 'Permiten personalizar la publicidad que ves en otras webs según tu visita a nuestra web.',
    cookie_cat_prefs: 'Preferencias',
    cookie_cat_prefs_desc: 'Recuerdan tus ajustes personales como el idioma y el modo visual para futuras visitas.',
    cookie_always_on: 'Siempre activas',
    cookie_save: 'Guardar preferencias',
    cookie_reject_all: 'Rechazar opcionales',
    cookie_modal_close: 'Cerrar',
    cookie_link: 'Política de cookies',
  },
  en: {
    nav_tickets: 'Tickets',
    menu_1: 'Home', menu_2: 'Monuments', menu_3: 'Visits',
    menu_4: 'News', menu_5: 'Institution', menu_6: 'Bookings',
    footer_desc: 'Eight centuries of history, art and devotion at the heart of the French Way. Living heritage of humanity.',
    footer_col_visit: 'Visit',
    footer_visit_1: 'How to get here', footer_visit_2: 'Opening hours', footer_visit_3: 'Admission',
    footer_visit_4: 'Accessible visit', footer_visit_5: 'Groups',
    footer_col_discover: 'Discover',
    footer_disc_1: 'History', footer_disc_2: 'Cathedral', footer_disc_3: 'Freestanding Tower',
    footer_disc_4: 'Convent', footer_disc_5: 'Cañas Monastery',
    footer_col_info: 'Information',
    footer_info_1: 'Bookings', footer_info_2: 'Institution', footer_info_3: 'Contact',
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
    a11y_title: 'Accessibility tools', a11y_close: 'Close accessibility panel',
    a11y_text_increase: 'Increase text', a11y_text_decrease: 'Decrease text',
    a11y_grayscale: 'Grayscale', a11y_high_contrast: 'High contrast',
    a11y_invert: 'Invert colours', a11y_underline_links: 'Underline links',
    a11y_readable_font: 'Readable font', a11y_read_text: 'Read text',
    a11y_stop_read: 'Stop reading', a11y_reset: 'Reset',
    a11y_not_supported: 'Not supported in this browser',
    skip_to_content: 'Skip to main content',
    menu_legal_purchase: 'Purchase', menu_legal_privacy: 'Privacy',
    menu_legal_cookies: 'Cookies', menu_legal_notice: 'Legal notice',
    menu_legal_a11y: 'Accessibility', menu_legal_contact: 'Contact',
    cookie_title: 'Your privacy matters',
    cookie_desc: 'We use cookies to improve your experience, analyse traffic and remember your preferences. You can choose which cookies you accept.',
    cookie_btn_necessary: 'Necessary only',
    cookie_btn_all: 'Accept all',
    cookie_btn_customize: 'Customize',
    cookie_modal_title: 'Cookie preferences',
    cookie_cat_necessary: 'Necessary',
    cookie_cat_necessary_desc: 'Essential for the site to work: session security, language and accessibility settings.',
    cookie_cat_analytics: 'Analytics',
    cookie_cat_analytics_desc: 'Help us understand how the site is used so we can improve its content. Data is anonymous.',
    cookie_cat_marketing: 'Marketing',
    cookie_cat_marketing_desc: 'Allow us to personalise the adverts you see on other websites based on your visit.',
    cookie_cat_prefs: 'Preferences',
    cookie_cat_prefs_desc: 'Remember your personal settings such as language and display mode for future visits.',
    cookie_always_on: 'Always on',
    cookie_save: 'Save preferences',
    cookie_reject_all: 'Reject optional',
    cookie_modal_close: 'Close',
    cookie_link: 'Cookie policy',
  },
  fr: {
    nav_tickets: 'Billets',
    menu_1: 'Accueil', menu_2: 'Monuments', menu_3: 'Visites',
    menu_4: 'Actualités', menu_5: 'Institution', menu_6: 'Réservations',
    footer_desc: 'Huit siècles d\'histoire, d\'art et de dévotion au cœur du Chemin Français. Patrimoine vivant de l\'humanité.',
    footer_col_visit: 'Visite',
    footer_visit_1: 'Comment y aller', footer_visit_2: 'Horaires', footer_visit_3: 'Tarifs',
    footer_visit_4: 'Visite accessible', footer_visit_5: 'Groupes',
    footer_col_discover: 'Découvrir',
    footer_disc_1: 'Histoire', footer_disc_2: 'Cathédrale', footer_disc_3: 'Tour indépendante',
    footer_disc_4: 'Couvent', footer_disc_5: 'Monastère de Cañas',
    footer_col_info: 'Informations',
    footer_info_1: 'Réservations', footer_info_2: 'Institution', footer_info_3: 'Contact',
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
    a11y_title: 'Outils d\'accessibilité', a11y_close: 'Fermer le panneau d\'accessibilité',
    a11y_text_increase: 'Agrandir le texte', a11y_text_decrease: 'Réduire le texte',
    a11y_grayscale: 'Niveaux de gris', a11y_high_contrast: 'Contraste élevé',
    a11y_invert: 'Inverser les couleurs', a11y_underline_links: 'Souligner les liens',
    a11y_readable_font: 'Police lisible', a11y_read_text: 'Lire le texte',
    a11y_stop_read: 'Arrêter la lecture', a11y_reset: 'Réinitialiser',
    a11y_not_supported: 'Non pris en charge par ce navigateur',
    skip_to_content: 'Aller au contenu principal',
    menu_legal_purchase: 'Achats', menu_legal_privacy: 'Confidentialité',
    menu_legal_cookies: 'Cookies', menu_legal_notice: 'Mentions légales',
    menu_legal_a11y: 'Accessibilité', menu_legal_contact: 'Contact',
    cookie_title: 'Votre vie privée compte',
    cookie_desc: 'Nous utilisons des cookies pour améliorer votre expérience, analyser le trafic et mémoriser vos préférences. Vous pouvez choisir les cookies que vous acceptez.',
    cookie_btn_necessary: 'Nécessaires seulement',
    cookie_btn_all: 'Tout accepter',
    cookie_btn_customize: 'Personnaliser',
    cookie_modal_title: 'Préférences cookies',
    cookie_cat_necessary: 'Nécessaires',
    cookie_cat_necessary_desc: 'Indispensables au fonctionnement du site : sécurité de session, langue et accessibilité.',
    cookie_cat_analytics: 'Analytiques',
    cookie_cat_analytics_desc: 'Nous aident à comprendre comment le site est utilisé pour améliorer son contenu. Les données sont anonymes.',
    cookie_cat_marketing: 'Marketing',
    cookie_cat_marketing_desc: 'Permettent de personnaliser les publicités affichées sur d\'autres sites selon votre visite.',
    cookie_cat_prefs: 'Préférences',
    cookie_cat_prefs_desc: 'Mémorisent vos réglages personnels comme la langue et le mode d\'affichage pour vos prochaines visites.',
    cookie_always_on: 'Toujours actives',
    cookie_save: 'Enregistrer les préférences',
    cookie_reject_all: 'Refuser les optionnels',
    cookie_modal_close: 'Fermer',
    cookie_link: 'Politique des cookies',
  },
  de: {
    nav_tickets: 'Tickets',
    menu_1: 'Startseite', menu_2: 'Denkmäler', menu_3: 'Besuche',
    menu_4: 'Aktuelles', menu_5: 'Institution', menu_6: 'Buchungen',
    footer_desc: 'Acht Jahrhunderte Geschichte, Kunst und Andacht im Herzen des Französischen Jakobsweges. Lebendiges Erbe der Menschheit.',
    footer_col_visit: 'Besuch',
    footer_visit_1: 'Anfahrt', footer_visit_2: 'Öffnungszeiten', footer_visit_3: 'Eintrittspreise',
    footer_visit_4: 'Barrierefreier Besuch', footer_visit_5: 'Gruppen',
    footer_col_discover: 'Entdecken',
    footer_disc_1: 'Geschichte', footer_disc_2: 'Kathedrale', footer_disc_3: 'Freistehender Turm',
    footer_disc_4: 'Kloster', footer_disc_5: 'Kloster Cañas',
    footer_col_info: 'Information',
    footer_info_1: 'Buchungen', footer_info_2: 'Institution', footer_info_3: 'Kontakt',
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
    a11y_title: 'Barrierefreiheit-Tools', a11y_close: 'Barrierefreiheits-Panel schließen',
    a11y_text_increase: 'Text vergrößern', a11y_text_decrease: 'Text verkleinern',
    a11y_grayscale: 'Graustufen', a11y_high_contrast: 'Hoher Kontrast',
    a11y_invert: 'Farben invertieren', a11y_underline_links: 'Links unterstreichen',
    a11y_readable_font: 'Lesbare Schrift', a11y_read_text: 'Text vorlesen',
    a11y_stop_read: 'Vorlesen stoppen', a11y_reset: 'Zurücksetzen',
    a11y_not_supported: 'In diesem Browser nicht unterstützt',
    skip_to_content: 'Zum Hauptinhalt springen',
    menu_legal_purchase: 'Kauf', menu_legal_privacy: 'Datenschutz',
    menu_legal_cookies: 'Cookies', menu_legal_notice: 'Impressum',
    menu_legal_a11y: 'Barrierefreiheit', menu_legal_contact: 'Kontakt',
    cookie_title: 'Ihre Privatsphäre liegt uns am Herzen',
    cookie_desc: 'Wir verwenden Cookies, um Ihre Erfahrung zu verbessern, den Datenverkehr zu analysieren und Ihre Einstellungen zu speichern. Sie können wählen, welche Cookies Sie akzeptieren.',
    cookie_btn_necessary: 'Nur notwendige',
    cookie_btn_all: 'Alle akzeptieren',
    cookie_btn_customize: 'Anpassen',
    cookie_modal_title: 'Cookie-Einstellungen',
    cookie_cat_necessary: 'Notwendige',
    cookie_cat_necessary_desc: 'Unverzichtbar für den Betrieb der Website: Sitzungssicherheit, Sprache und Barrierefreiheitseinstellungen.',
    cookie_cat_analytics: 'Analytische',
    cookie_cat_analytics_desc: 'Helfen uns zu verstehen, wie die Website genutzt wird, um den Inhalt zu verbessern. Daten sind anonym.',
    cookie_cat_marketing: 'Marketing',
    cookie_cat_marketing_desc: 'Ermöglichen personalisierte Werbung auf anderen Websites basierend auf Ihrem Besuch.',
    cookie_cat_prefs: 'Einstellungen',
    cookie_cat_prefs_desc: 'Speichern Ihre persönlichen Einstellungen wie Sprache und Anzeigemodus für zukünftige Besuche.',
    cookie_always_on: 'Immer aktiv',
    cookie_save: 'Einstellungen speichern',
    cookie_reject_all: 'Optionale ablehnen',
    cookie_modal_close: 'Schließen',
    cookie_link: 'Cookie-Richtlinie',
  },
  pt: {
    nav_tickets: 'Bilhetes',
    menu_1: 'Início', menu_2: 'Monumentos', menu_3: 'Visitas',
    menu_4: 'Notícias', menu_5: 'Instituição', menu_6: 'Reservas',
    footer_desc: 'Oito séculos de história, arte e devoção no coração do Caminho Francês. Património vivo da humanidade.',
    footer_col_visit: 'Visita',
    footer_visit_1: 'Como chegar', footer_visit_2: 'Horários', footer_visit_3: 'Tarifas',
    footer_visit_4: 'Visita acessível', footer_visit_5: 'Grupos',
    footer_col_discover: 'Descobrir',
    footer_disc_1: 'História', footer_disc_2: 'Catedral', footer_disc_3: 'Torre independente',
    footer_disc_4: 'Convento', footer_disc_5: 'Mosteiro de Cañas',
    footer_col_info: 'Informação',
    footer_info_1: 'Reservas', footer_info_2: 'Instituição', footer_info_3: 'Contacto',
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
    a11y_title: 'Ferramentas de acessibilidade', a11y_close: 'Fechar painel de acessibilidade',
    a11y_text_increase: 'Aumentar texto', a11y_text_decrease: 'Diminuir texto',
    a11y_grayscale: 'Escala de cinza', a11y_high_contrast: 'Alto contraste',
    a11y_invert: 'Inverter cores', a11y_underline_links: 'Sublinhar ligações',
    a11y_readable_font: 'Fonte legível', a11y_read_text: 'Ler texto',
    a11y_stop_read: 'Parar leitura', a11y_reset: 'Repor',
    a11y_not_supported: 'Não suportado neste navegador',
    skip_to_content: 'Saltar para o conteúdo principal',
    menu_legal_purchase: 'Compra', menu_legal_privacy: 'Privacidade',
    menu_legal_cookies: 'Cookies', menu_legal_notice: 'Aviso legal',
    menu_legal_a11y: 'Acessibilidade', menu_legal_contact: 'Contacto',
    cookie_title: 'A sua privacidade importa',
    cookie_desc: 'Utilizamos cookies para melhorar a sua experiência, analisar o tráfego e lembrar as suas preferências. Pode escolher quais cookies aceita.',
    cookie_btn_necessary: 'Só necessários',
    cookie_btn_all: 'Aceitar tudo',
    cookie_btn_customize: 'Personalizar',
    cookie_modal_title: 'Preferências de cookies',
    cookie_cat_necessary: 'Necessários',
    cookie_cat_necessary_desc: 'Indispensáveis para o funcionamento do site: segurança de sessão, idioma e acessibilidade.',
    cookie_cat_analytics: 'Analíticos',
    cookie_cat_analytics_desc: 'Ajudam-nos a perceber como o site é utilizado para melhorar o seu conteúdo. Os dados são anónimos.',
    cookie_cat_marketing: 'Marketing',
    cookie_cat_marketing_desc: 'Permitem personalizar a publicidade que vê noutros sites com base na sua visita.',
    cookie_cat_prefs: 'Preferências',
    cookie_cat_prefs_desc: 'Lembram as suas configurações pessoais como idioma e modo de visualização para futuras visitas.',
    cookie_always_on: 'Sempre ativas',
    cookie_save: 'Guardar preferências',
    cookie_reject_all: 'Rejeitar opcionais',
    cookie_modal_close: 'Fechar',
    cookie_link: 'Política de cookies',
  },
  it: {
    nav_tickets: 'Biglietti',
    menu_1: 'Home', menu_2: 'Monumenti', menu_3: 'Visite',
    menu_4: 'Notizie', menu_5: 'Istituzione', menu_6: 'Prenotazioni',
    footer_desc: 'Otto secoli di storia, arte e devozione nel cuore del Cammino Francese. Patrimonio vivente dell\'umanità.',
    footer_col_visit: 'Visita',
    footer_visit_1: 'Come arrivare', footer_visit_2: 'Orari', footer_visit_3: 'Tariffe',
    footer_visit_4: 'Visita accessibile', footer_visit_5: 'Gruppi',
    footer_col_discover: 'Scopri',
    footer_disc_1: 'Storia', footer_disc_2: 'Cattedrale', footer_disc_3: 'Torre indipendente',
    footer_disc_4: 'Convento', footer_disc_5: 'Monastero di Cañas',
    footer_col_info: 'Informazioni',
    footer_info_1: 'Prenotazioni', footer_info_2: 'Istituzione', footer_info_3: 'Contatto',
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
    a11y_title: 'Strumenti di accessibilità', a11y_close: 'Chiudi pannello accessibilità',
    a11y_text_increase: 'Aumenta testo', a11y_text_decrease: 'Riduci testo',
    a11y_grayscale: 'Scala di grigi', a11y_high_contrast: 'Alto contrasto',
    a11y_invert: 'Inverti colori', a11y_underline_links: 'Sottolinea link',
    a11y_readable_font: 'Carattere leggibile', a11y_read_text: 'Leggi testo',
    a11y_stop_read: 'Ferma lettura', a11y_reset: 'Ripristina',
    a11y_not_supported: 'Non supportato in questo browser',
    skip_to_content: 'Vai al contenuto principale',
    menu_legal_purchase: 'Acquisto', menu_legal_privacy: 'Privacy',
    menu_legal_cookies: 'Cookie', menu_legal_notice: 'Note legali',
    menu_legal_a11y: 'Accessibilità', menu_legal_contact: 'Contatto',
    cookie_title: 'La tua privacy è importante',
    cookie_desc: 'Utilizziamo cookie per migliorare la tua esperienza, analizzare il traffico e ricordare le tue preferenze. Puoi scegliere quali cookie accettare.',
    cookie_btn_necessary: 'Solo necessari',
    cookie_btn_all: 'Accetta tutti',
    cookie_btn_customize: 'Personalizza',
    cookie_modal_title: 'Preferenze cookie',
    cookie_cat_necessary: 'Necessari',
    cookie_cat_necessary_desc: 'Indispensabili per il funzionamento del sito: sicurezza della sessione, lingua e accessibilità.',
    cookie_cat_analytics: 'Analitici',
    cookie_cat_analytics_desc: 'Ci aiutano a capire come il sito viene utilizzato per migliorarne il contenuto. I dati sono anonimi.',
    cookie_cat_marketing: 'Marketing',
    cookie_cat_marketing_desc: 'Consentono di personalizzare la pubblicità che vedi su altri siti in base alla tua visita.',
    cookie_cat_prefs: 'Preferenze',
    cookie_cat_prefs_desc: 'Ricordano le tue impostazioni personali come lingua e modalità di visualizzazione per le visite future.',
    cookie_always_on: 'Sempre attivi',
    cookie_save: 'Salva preferenze',
    cookie_reject_all: 'Rifiuta opzionali',
    cookie_modal_close: 'Chiudi',
    cookie_link: 'Politica sui cookie',
  },
  ko: {
    nav_tickets: '입장권',
    menu_1: '홈', menu_2: '유적', menu_3: '관람',
    menu_4: '뉴스', menu_5: '기관', menu_6: '예약',
    footer_desc: '프랑스 길의 중심에서 8세기의 역사, 예술, 신앙. 인류의 살아있는 유산.',
    footer_col_visit: '관람',
    footer_visit_1: '오시는 길', footer_visit_2: '운영 시간', footer_visit_3: '요금',
    footer_visit_4: '접근 가능한 관람', footer_visit_5: '단체',
    footer_col_discover: '탐색',
    footer_disc_1: '역사', footer_disc_2: '대성당', footer_disc_3: '독립 종탑',
    footer_disc_4: '수도원', footer_disc_5: '카냐스 수도원',
    footer_col_info: '정보',
    footer_info_1: '예약', footer_info_2: '기관', footer_info_3: '연락처',
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
    a11y_title: '접근성 도구', a11y_close: '접근성 패널 닫기',
    a11y_text_increase: '텍스트 크기 늘리기', a11y_text_decrease: '텍스트 크기 줄이기',
    a11y_grayscale: '회색조', a11y_high_contrast: '고대비',
    a11y_invert: '색 반전', a11y_underline_links: '링크 밑줄',
    a11y_readable_font: '읽기 쉬운 글꼴', a11y_read_text: '텍스트 읽기',
    a11y_stop_read: '읽기 중지', a11y_reset: '초기화',
    a11y_not_supported: '이 브라우저에서 지원되지 않음',
    skip_to_content: '주요 콘텐츠로 건너뛰기',
    menu_legal_purchase: '구매', menu_legal_privacy: '개인정보',
    menu_legal_cookies: '쿠키', menu_legal_notice: '법적 고지',
    menu_legal_a11y: '접근성', menu_legal_contact: '연락처',
    cookie_title: '개인정보 보호가 중요합니다',
    cookie_desc: '경험 개선, 트래픽 분석 및 설정 저장을 위해 쿠키를 사용합니다. 수락할 쿠키를 선택할 수 있습니다.',
    cookie_btn_necessary: '필수 항목만',
    cookie_btn_all: '모두 수락',
    cookie_btn_customize: '설정',
    cookie_modal_title: '쿠키 설정',
    cookie_cat_necessary: '필수',
    cookie_cat_necessary_desc: '세션 보안, 언어 및 접근성 설정 등 사이트 운영에 꼭 필요한 쿠키입니다.',
    cookie_cat_analytics: '분석',
    cookie_cat_analytics_desc: '콘텐츠 개선을 위해 사이트 이용 방식을 파악하는 데 도움을 줍니다. 데이터는 익명으로 처리됩니다.',
    cookie_cat_marketing: '마케팅',
    cookie_cat_marketing_desc: '귀하의 방문을 기반으로 다른 웹사이트에서 맞춤형 광고를 표시할 수 있습니다.',
    cookie_cat_prefs: '환경 설정',
    cookie_cat_prefs_desc: '향후 방문을 위해 언어 및 표시 모드 등 개인 설정을 기억합니다.',
    cookie_always_on: '항상 활성화',
    cookie_save: '설정 저장',
    cookie_reject_all: '선택 항목 거부',
    cookie_modal_close: '닫기',
    cookie_link: '쿠키 정책',
  },
  eu: {
    nav_tickets: 'Sarrerak',
    menu_1: 'Hasiera', menu_2: 'Monumentuak', menu_3: 'Bisitaldiak',
    menu_4: 'Albisteak', menu_5: 'Erakundea', menu_6: 'Erreserbak',
    footer_desc: 'Zortzi mende historia, arte eta debozio Frantziako Bidearen bihotzean. Gizadiaren ondare bizia.',
    footer_col_visit: 'Bisita',
    footer_visit_1: 'Nola iritsi', footer_visit_2: 'Ordutegia', footer_visit_3: 'Tarifak',
    footer_visit_4: 'Bisita irisgarria', footer_visit_5: 'Taldeak',
    footer_col_discover: 'Aurkitu',
    footer_disc_1: 'Historia', footer_disc_2: 'Katedrala', footer_disc_3: 'Dorre Exentua',
    footer_disc_4: 'Komentua', footer_disc_5: 'Cañasetako Monasterioa',
    footer_col_info: 'Informazioa',
    footer_info_1: 'Erreserbak', footer_info_2: 'Erakundea', footer_info_3: 'Kontaktua',
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
    a11y_title: 'Irisgarritasun tresnak', a11y_close: 'Itxi irisgarritasun panela',
    a11y_text_increase: 'Testua handitu', a11y_text_decrease: 'Testua txikitu',
    a11y_grayscale: 'Gris eskala', a11y_high_contrast: 'Kontraste altua',
    a11y_invert: 'Koloreak alderantzikatu', a11y_underline_links: 'Estekak azpimarratu',
    a11y_readable_font: 'Letra-tipo irakurgarria', a11y_read_text: 'Testua irakurri',
    a11y_stop_read: 'Irakurketa gelditu', a11y_reset: 'Berrezarri',
    a11y_not_supported: 'Nabigatzaile honetan ez da onartzen',
    skip_to_content: 'Joan eduki nagusira',
    menu_legal_purchase: 'Erosketak', menu_legal_privacy: 'Pribatutasuna',
    menu_legal_cookies: 'Cookieak', menu_legal_notice: 'Lege oharra',
    menu_legal_a11y: 'Irisgarritasuna', menu_legal_contact: 'Kontaktua',
    cookie_title: 'Zure pribatutasuna garrantzitsua da',
    cookie_desc: 'Cookieak erabiltzen ditugu zure esperientzia hobetzeko, trafikoa aztertzeko eta ezarpenak gordetzeko. Zein cookie onartzen dituzun aukera dezakezu.',
    cookie_btn_necessary: 'Beharrezkoak bakarrik',
    cookie_btn_all: 'Guztiak onartu',
    cookie_btn_customize: 'Pertsonalizatu',
    cookie_modal_title: 'Cookie-hobespenak',
    cookie_cat_necessary: 'Beharrezkoak',
    cookie_cat_necessary_desc: 'Webgunearen funtzionamenduarako ezinbestekoak: saioaren segurtasuna, hizkuntza eta irisgarritasun ezarpenak.',
    cookie_cat_analytics: 'Analitikoak',
    cookie_cat_analytics_desc: 'Webgunea nola erabiltzen den ulertzen laguntzen digute edukia hobetzeko. Datuak anonimoak dira.',
    cookie_cat_marketing: 'Marketina',
    cookie_cat_marketing_desc: 'Beste webguneetan iragarki pertsonalizatuak erakusten uzten dute zure bisitaldiaren arabera.',
    cookie_cat_prefs: 'Hobespenak',
    cookie_cat_prefs_desc: 'Zure ezarpen pertsonalak gordetzen dituzte, hala nola hizkuntza eta erakusteko modua, etorkizuneko bisitaldietarako.',
    cookie_always_on: 'Beti aktibo',
    cookie_save: 'Hobespenak gorde',
    cookie_reject_all: 'Aukerakoak ukatu',
    cookie_modal_close: 'Itxi',
    cookie_link: 'Cookie politika',
  },
  ca: {
    nav_tickets: 'Entrades',
    menu_1: 'Inici', menu_2: 'Monuments', menu_3: 'Visites',
    menu_4: 'Actualitat', menu_5: 'Institució', menu_6: 'Reserves',
    footer_desc: 'Vuit segles d\'història, art i devoció al cor del Camí Francès. Patrimoni viu de la humanitat.',
    footer_col_visit: 'Visita',
    footer_visit_1: 'Com arribar', footer_visit_2: 'Horaris', footer_visit_3: 'Tarifes',
    footer_visit_4: 'Visita accessible', footer_visit_5: 'Grups',
    footer_col_discover: 'Descobreix',
    footer_disc_1: 'Història', footer_disc_2: 'Catedral', footer_disc_3: 'Torre Exempta',
    footer_disc_4: 'Convent', footer_disc_5: 'Monestir de Cañas',
    footer_col_info: 'Informació',
    footer_info_1: 'Reserves', footer_info_2: 'Institució', footer_info_3: 'Contacte',
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
    a11y_title: 'Eines d\'accessibilitat', a11y_close: 'Tanca el panell d\'accessibilitat',
    a11y_text_increase: 'Augmentar text', a11y_text_decrease: 'Reduir text',
    a11y_grayscale: 'Escala de grisos', a11y_high_contrast: 'Alt contrast',
    a11y_invert: 'Invertir colors', a11y_underline_links: 'Subratllar enllaços',
    a11y_readable_font: 'Lletra llegible', a11y_read_text: 'Llegir text',
    a11y_stop_read: 'Aturar lectura', a11y_reset: 'Restablir',
    a11y_not_supported: 'No compatible amb aquest navegador',
    skip_to_content: 'Anar al contingut principal',
    menu_legal_purchase: 'Compra', menu_legal_privacy: 'Privadesa',
    menu_legal_cookies: 'Cookies', menu_legal_notice: 'Avís legal',
    menu_legal_a11y: 'Accessibilitat', menu_legal_contact: 'Contacte',
    cookie_title: 'La teva privacitat importa',
    cookie_desc: 'Utilitzem cookies per millorar la teva experiència, analitzar el tràfic i recordar les teves preferències. Pots triar quines cookies acceptes.',
    cookie_btn_necessary: 'Només necessàries',
    cookie_btn_all: 'Acceptar-ho tot',
    cookie_btn_customize: 'Personalitzar',
    cookie_modal_title: 'Preferències de cookies',
    cookie_cat_necessary: 'Necessàries',
    cookie_cat_necessary_desc: 'Indispensables per al funcionament del lloc: seguretat de sessió, idioma i accessibilitat.',
    cookie_cat_analytics: 'Analítiques',
    cookie_cat_analytics_desc: 'Ens ajuden a entendre com s\'utilitza el lloc per millorar-ne el contingut. Les dades són anònimes.',
    cookie_cat_marketing: 'Màrqueting',
    cookie_cat_marketing_desc: 'Permeten personalitzar la publicitat que veus en altres llocs web en funció de la teva visita.',
    cookie_cat_prefs: 'Preferències',
    cookie_cat_prefs_desc: 'Recorden la teva configuració personal com l\'idioma i el mode de visualització per a futures visites.',
    cookie_always_on: 'Sempre actives',
    cookie_save: 'Desar preferències',
    cookie_reject_all: 'Rebutjar opcionals',
    cookie_modal_close: 'Tancar',
    cookie_link: 'Política de cookies',
  }
};

const FLAGS = { es: '🇪🇸', en: '🇬🇧', fr: '🇫🇷', de: '🇩🇪', pt: '🇵🇹', it: '🇮🇹', ko: '🇰🇷', eu: 'ᴇᴜ', ca: 'ᴄᴀ' };
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

  // Accessibility panel labels
  const a11yToggle = document.getElementById('a11y-toggle');
  if (a11yToggle) a11yToggle.setAttribute('aria-label', t.a11y_title);
  const a11yCloseBtn = document.getElementById('a11y-panel-close');
  if (a11yCloseBtn) a11yCloseBtn.setAttribute('aria-label', t.a11y_close);
  _setText('[data-i18n="a11y_title"]', t.a11y_title);
  _setText('[data-i18n="a11y_text_increase"]', t.a11y_text_increase);
  _setText('[data-i18n="a11y_text_decrease"]', t.a11y_text_decrease);
  _setText('[data-i18n="a11y_grayscale"]', t.a11y_grayscale);
  _setText('[data-i18n="a11y_high_contrast"]', t.a11y_high_contrast);
  _setText('[data-i18n="a11y_invert"]', t.a11y_invert);
  _setText('[data-i18n="a11y_underline_links"]', t.a11y_underline_links);
  _setText('[data-i18n="a11y_readable_font"]', t.a11y_readable_font);
  _setText('[data-i18n="a11y_read_text"]', t.a11y_read_text);
  _setText('[data-i18n="a11y_reset"]', t.a11y_reset);
  const readerBtnEl = document.getElementById('a11y-text-reader');
  if (readerBtnEl) readerBtnEl.title = t.a11y_not_supported;

  // Side menu legal links
  _setText('[data-i18n="menu_legal_purchase"]', t.menu_legal_purchase);
  _setText('[data-i18n="menu_legal_privacy"]', t.menu_legal_privacy);
  _setText('[data-i18n="menu_legal_cookies"]', t.menu_legal_cookies);
  _setText('[data-i18n="menu_legal_notice"]', t.menu_legal_notice);
  _setText('[data-i18n="menu_legal_a11y"]', t.menu_legal_a11y);
  _setText('[data-i18n="menu_legal_contact"]', t.menu_legal_contact);

  // Cookie banner / modal labels
  _cookieApplyLang(t);

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

  const a11yShortcut = sideMenu.querySelector('.side-menu__a11y-btn');
  if (a11yShortcut) {
    a11yShortcut.addEventListener('click', () => {
      closeMenu();
      const toggle = document.getElementById('a11y-toggle');
      if (toggle) setTimeout(() => toggle.click(), 320);
    });
  }
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
      readerBtn.title = (SHARED_T[_currentLang] || SHARED_T.es).a11y_not_supported;
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
  if (btn) { btn.classList.add('is-active'); btn.setAttribute('aria-pressed', 'true'); btn.textContent = ''; const _tR = SHARED_T[_currentLang] || SHARED_T.es; btn.insertAdjacentHTML('afterbegin', `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> ${_tR.a11y_stop_read}`); }
}

function _a11yStopReader() {
  window.speechSynthesis?.cancel();
  window.getSelection()?.removeAllRanges();
  document.body.classList.remove('a11y-reading');
  const btn = document.getElementById('a11y-text-reader');
  if (btn) { btn.classList.remove('is-active'); btn.setAttribute('aria-pressed', 'false'); btn.textContent = ''; const _tS = SHARED_T[_currentLang] || SHARED_T.es; btn.insertAdjacentHTML('afterbegin', `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg> ${_tS.a11y_read_text}`); }
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

function initScrollTop() {
  const btn = document.createElement('button');
  btn.className = 'scroll-top-btn';
  btn.setAttribute('aria-label', 'Volver arriba');
  btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="18 15 12 9 6 15"/></svg>';
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    btn.classList.toggle('is-visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── COOKIES ─────────────────────────────────────────────────── */
function _cookieSet(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = name + '=' + encodeURIComponent(JSON.stringify(value)) + ';expires=' + expires + ';path=/;SameSite=Lax';
}

function _cookieGet(name) {
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  if (!match) return null;
  try { return JSON.parse(decodeURIComponent(match[1])); } catch (e) { return null; }
}

function _cookieApplyLang(t) {
  const banner = document.getElementById('cookie-banner');
  const modal = document.getElementById('cookie-modal');
  if (!banner && !modal) return;
  if (banner) {
    _setText('#cookie-banner-title', t.cookie_title);
    _setText('#cookie-banner-desc', t.cookie_desc);
    _setText('#cookie-btn-necessary', t.cookie_btn_necessary);
    _setText('#cookie-btn-all', t.cookie_btn_all);
    _setText('#cookie-btn-customize', t.cookie_btn_customize);
    const link = banner.querySelector('.cookie-banner__link');
    if (link) link.textContent = t.cookie_link;
  }
  if (modal) {
    _setText('#cookie-modal-title', t.cookie_modal_title);
    const closeBtn = document.getElementById('cookie-modal-close');
    if (closeBtn) closeBtn.setAttribute('aria-label', t.cookie_modal_close);
    _setText('#cookie-cat-necessary-name', t.cookie_cat_necessary);
    _setText('#cookie-cat-necessary-desc', t.cookie_cat_necessary_desc);
    _setText('#cookie-cat-analytics-name', t.cookie_cat_analytics);
    _setText('#cookie-cat-analytics-desc', t.cookie_cat_analytics_desc);
    _setText('#cookie-cat-marketing-name', t.cookie_cat_marketing);
    _setText('#cookie-cat-marketing-desc', t.cookie_cat_marketing_desc);
    _setText('#cookie-cat-prefs-name', t.cookie_cat_prefs);
    _setText('#cookie-cat-prefs-desc', t.cookie_cat_prefs_desc);
    document.querySelectorAll('.cookie-cat__badge').forEach(el => { el.textContent = t.cookie_always_on; });
    _setText('#cookie-modal-save', t.cookie_save);
    _setText('#cookie-modal-reject', t.cookie_reject_all);
  }
}

function initCookieBanner() {
  const banner = document.getElementById('cookie-banner');
  const modal = document.getElementById('cookie-modal');
  if (!banner) return;

  const consent = _cookieGet('cat-cookies');
  const t = SHARED_T[_currentLang] || SHARED_T.es;

  // Fix cookie policy link href based on page depth
  const policyLink = banner.querySelector('[data-cookie-link]');
  if (policyLink) {
    const slashes = (window.location.pathname.match(/\//g) || []).length;
    const prefix = slashes > 1 ? '../'.repeat(slashes - 1) : '';
    policyLink.href = prefix + 'legal/cookies.html';
  }

  _cookieApplyLang(t);

  // Show banner only if no consent recorded yet
  if (!consent) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { banner.classList.add('is-visible'); });
    });
  }

  function hideBanner() { banner.classList.remove('is-visible'); }
  function showModal() { if (modal) { modal.classList.add('is-visible'); modal.querySelector('.cookie-modal__dialog')?.focus(); } }
  function hideModal() { if (modal) modal.classList.remove('is-visible'); }

  function saveConsent(analytics, marketing, prefs) {
    _cookieSet('cat-cookies', { necessary: true, analytics, marketing, prefs, date: new Date().toISOString().slice(0, 10) }, 365);
    hideBanner();
    hideModal();
  }

  // Banner buttons
  document.getElementById('cookie-btn-necessary')?.addEventListener('click', () => saveConsent(false, false, false));
  document.getElementById('cookie-btn-all')?.addEventListener('click', () => saveConsent(true, true, true));
  document.getElementById('cookie-btn-customize')?.addEventListener('click', showModal);

  // Modal buttons
  document.getElementById('cookie-modal-save')?.addEventListener('click', () => {
    const analytics = document.getElementById('cookie-toggle-analytics')?.checked || false;
    const marketing = document.getElementById('cookie-toggle-marketing')?.checked || false;
    const prefs = document.getElementById('cookie-toggle-prefs')?.checked || false;
    saveConsent(analytics, marketing, prefs);
  });
  document.getElementById('cookie-modal-reject')?.addEventListener('click', () => saveConsent(false, false, false));
  document.getElementById('cookie-modal-close')?.addEventListener('click', hideModal);

  // Close modal on backdrop click
  modal?.querySelector('.cookie-modal__backdrop')?.addEventListener('click', hideModal);

  // If existing consent, restore toggle states
  if (consent && modal) {
    const an = document.getElementById('cookie-toggle-analytics');
    const mk = document.getElementById('cookie-toggle-marketing');
    const pr = document.getElementById('cookie-toggle-prefs');
    if (an) an.checked = !!consent.analytics;
    if (mk) mk.checked = !!consent.marketing;
    if (pr) pr.checked = !!consent.prefs;
  }

  // Trap focus inside modal
  modal?.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const focusable = [...modal.querySelectorAll('button, input, a[href]')].filter(el => !el.disabled);
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  // Expose opener for "Cookies" footer link
  window.openCookieModal = function () {
    const c = _cookieGet('cat-cookies');
    if (c) {
      const an = document.getElementById('cookie-toggle-analytics');
      const mk = document.getElementById('cookie-toggle-marketing');
      const pr = document.getElementById('cookie-toggle-prefs');
      if (an) an.checked = !!c.analytics;
      if (mk) mk.checked = !!c.marketing;
      if (pr) pr.checked = !!c.prefs;
    }
    showModal();
  };
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
  initScrollTop();
  initCookieBanner();
});