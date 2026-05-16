/* ═══════════════════════════════════════════════════════════════
   SEO DATA — Catedral de Santo Domingo de la Calzada
   Per-page meta data in 9 languages (es, en, fr, de, pt, it, ko, eu, ca)
   Used by: shared.js to update <title>, <meta description>, og:* y twitter:*
   on language change.
   Static defaults are also injected into each HTML <head> in Spanish.
═══════════════════════════════════════════════════════════════ */

window.SITE_SEO = {
  domain: 'https://catedralsantodomingo.org',
  brand: 'Catedral de Santo Domingo de la Calzada',
  default_og_image: 'assets/img/catedral-institucion.webp',
  twitter_handle: '@catedralSDC'
};

window.PAGE_SEO = {

  /* ── ROOT PAGES ──────────────────────────────────────────────── */

  'index.html': {
    canonical_path: '',
    og_image: 'assets/img/catedral-institucion.webp',
    es: {
      title: 'Catedral de Santo Domingo de la Calzada — Camino de Santiago en La Rioja',
      description: 'Catedral de Santo Domingo de la Calzada, en el corazón del Camino de Santiago. Vive el milagro del gallo y la gallina, único en el mundo. Reserva entradas online.'
    },
    en: {
      title: 'Cathedral of Santo Domingo de la Calzada — Way of St. James, La Rioja',
      description: 'Cathedral of Santo Domingo de la Calzada, at the heart of the Way of St. James. Experience the unique miracle of the rooster and hen. Book your tickets online.'
    },
    fr: {
      title: 'Cathédrale de Santo Domingo de la Calzada — Chemin de Saint-Jacques',
      description: 'Cathédrale de Santo Domingo de la Calzada, au cœur du Chemin de Saint-Jacques. Vivez le miracle unique du coq et de la poule. Réservez vos billets en ligne.'
    },
    de: {
      title: 'Kathedrale Santo Domingo de la Calzada — Jakobsweg in La Rioja',
      description: 'Kathedrale Santo Domingo de la Calzada, im Herzen des Jakobswegs. Erleben Sie das einzigartige Wunder des Hahns und der Henne. Tickets online buchen.'
    },
    pt: {
      title: 'Catedral de Santo Domingo de la Calzada — Caminho de Santiago, La Rioja',
      description: 'Catedral de Santo Domingo de la Calzada, no coração do Caminho de Santiago. Viva o milagre único do galo e da galinha. Reserve as suas entradas online.'
    },
    it: {
      title: 'Cattedrale di Santo Domingo de la Calzada — Cammino di Santiago',
      description: 'Cattedrale di Santo Domingo de la Calzada, nel cuore del Cammino di Santiago. Vivi il miracolo unico del gallo e della gallina. Prenota i biglietti online.'
    },
    ko: {
      title: '산토 도밍고 데 라 칼사다 대성당 — 라 리오하의 산티아고 순례길',
      description: '산티아고 순례길의 중심, 산토 도밍고 데 라 칼사다 대성당. 세계 유일의 수탉과 암탉의 기적을 만나보세요. 온라인으로 입장권을 예약하세요.'
    },
    eu: {
      title: 'Santo Domingo de la Calzadako Katedrala — Donejakue Bidea, Errioxa',
      description: 'Santo Domingo de la Calzadako Katedrala, Donejakue Bidearen bihotzean. Bizi ezazu oilarra eta oiloaren mirakulu bakarra. Sarrerak online erreserbatu.'
    },
    ca: {
      title: 'Catedral de Santo Domingo de la Calzada — Camí de Santiago, La Rioja',
      description: 'Catedral de Santo Domingo de la Calzada, al cor del Camí de Santiago. Viu el miracle únic del gall i la gallina. Reserva les teves entrades en línia.'
    }
  },

  'actualidad.html': {
    og_image: 'assets/img/catedral-actualidad.webp',
    es: {
      title: 'Actualidad y Agenda · Catedral de Santo Domingo de la Calzada',
      description: 'Noticias, agenda cultural, conciertos y celebraciones litúrgicas de la Catedral de Santo Domingo de la Calzada. Toda la actualidad del Camino Francés.'
    },
    en: {
      title: 'News & Events · Cathedral of Santo Domingo de la Calzada',
      description: 'News, cultural agenda, concerts and liturgical celebrations at the Cathedral of Santo Domingo de la Calzada. Stay updated on the French Way of St. James.'
    },
    fr: {
      title: 'Actualités et Agenda · Cathédrale de Santo Domingo de la Calzada',
      description: 'Actualités, agenda culturel, concerts et célébrations liturgiques de la Cathédrale de Santo Domingo de la Calzada. Toute l\'actualité du Chemin français.'
    },
    de: {
      title: 'Aktuelles und Termine · Kathedrale Santo Domingo de la Calzada',
      description: 'Nachrichten, Kulturkalender, Konzerte und liturgische Feiern der Kathedrale Santo Domingo de la Calzada. Alle Neuigkeiten vom Französischen Jakobsweg.'
    },
    pt: {
      title: 'Atualidade e Agenda · Catedral de Santo Domingo de la Calzada',
      description: 'Notícias, agenda cultural, concertos e celebrações litúrgicas da Catedral de Santo Domingo de la Calzada. Toda a atualidade do Caminho Francês.'
    },
    it: {
      title: 'Attualità e Agenda · Cattedrale di Santo Domingo de la Calzada',
      description: 'Notizie, agenda culturale, concerti e celebrazioni liturgiche della Cattedrale di Santo Domingo de la Calzada. Tutta l\'attualità del Cammino Francese.'
    },
    ko: {
      title: '소식과 행사 · 산토 도밍고 데 라 칼사다 대성당',
      description: '산토 도밍고 데 라 칼사다 대성당의 소식, 문화 행사, 콘서트 및 전례 행사. 프랑스 길의 모든 최신 정보를 만나보세요.'
    },
    eu: {
      title: 'Albisteak eta Agenda · Santo Domingo de la Calzadako Katedrala',
      description: 'Santo Domingo de la Calzadako Katedralaren albisteak, agenda kulturala, kontzertuak eta liturgia ospakizunak. Bide Frantsesaren albiste guztiak.'
    },
    ca: {
      title: 'Actualitat i Agenda · Catedral de Santo Domingo de la Calzada',
      description: 'Notícies, agenda cultural, concerts i celebracions litúrgiques de la Catedral de Santo Domingo de la Calzada. Tota l\'actualitat del Camí Francès.'
    }
  },

  'institucion.html': {
    og_image: 'assets/img/catedral-institucion.webp',
    es: {
      title: 'Institución · Cabildo y Parroquia · Catedral de Santo Domingo de la Calzada',
      description: 'Conoce el Cabildo y la Parroquia de la Catedral de Santo Domingo de la Calzada: gestión patrimonial, acción social y vida espiritual en el Camino Francés.'
    },
    en: {
      title: 'Institution · Chapter & Parish · Cathedral of Santo Domingo de la Calzada',
      description: 'Discover the Chapter and Parish of the Cathedral of Santo Domingo de la Calzada: heritage management, social action and spiritual life on the French Way.'
    },
    fr: {
      title: 'Institution · Chapitre et Paroisse · Cathédrale de Santo Domingo',
      description: 'Découvrez le Chapitre et la Paroisse de la Cathédrale de Santo Domingo de la Calzada : gestion patrimoniale, action sociale et vie spirituelle sur le Chemin.'
    },
    de: {
      title: 'Institution · Domkapitel und Pfarrei · Kathedrale Santo Domingo',
      description: 'Lernen Sie das Domkapitel und die Pfarrei der Kathedrale Santo Domingo de la Calzada kennen: Erbeverwaltung, Sozialarbeit und spirituelles Leben am Jakobsweg.'
    },
    pt: {
      title: 'Instituição · Cabido e Paróquia · Catedral de Santo Domingo de la Calzada',
      description: 'Conheça o Cabido e a Paróquia da Catedral de Santo Domingo de la Calzada: gestão patrimonial, ação social e vida espiritual no Caminho Francês.'
    },
    it: {
      title: 'Istituzione · Capitolo e Parrocchia · Cattedrale di Santo Domingo',
      description: 'Scopri il Capitolo e la Parrocchia della Cattedrale di Santo Domingo de la Calzada: gestione patrimoniale, azione sociale e vita spirituale sul Cammino Francese.'
    },
    ko: {
      title: '기관 · 참사회와 본당 · 산토 도밍고 데 라 칼사다 대성당',
      description: '산토 도밍고 데 라 칼사다 대성당의 참사회와 본당을 만나보세요: 유산 관리, 사회 활동 및 프랑스 길의 영적 생활.'
    },
    eu: {
      title: 'Erakundea · Kabildoa eta Parrokia · Santo Domingoko Katedrala',
      description: 'Ezagutu Santo Domingo de la Calzadako Katedralaren Kabildoa eta Parrokia: ondare kudeaketa, gizarte ekintza eta bizitza espirituala Bide Frantsesean.'
    },
    ca: {
      title: 'Institució · Capítol i Parròquia · Catedral de Santo Domingo de la Calzada',
      description: 'Coneix el Capítol i la Parròquia de la Catedral de Santo Domingo de la Calzada: gestió patrimonial, acció social i vida espiritual al Camí Francès.'
    }
  },

  'monumentos.html': {
    og_image: 'assets/img/catedral-institucion.webp',
    es: {
      title: 'Monumentos del Conjunto Catedralicio · Santo Domingo de la Calzada',
      description: 'Catedral, Torre Exenta, Convento de San Francisco, Ermita de la Plaza y Monasterio de Cañas. Cinco monumentos, ocho siglos de patrimonio en La Rioja.'
    },
    en: {
      title: 'Monuments of the Cathedral Complex · Santo Domingo de la Calzada',
      description: 'Cathedral, Free-standing Tower, San Francisco Convent, Plaza Chapel and Cañas Monastery. Five monuments, eight centuries of heritage in La Rioja.'
    },
    fr: {
      title: 'Monuments de l\'Ensemble Cathédral · Santo Domingo de la Calzada',
      description: 'Cathédrale, Tour Isolée, Couvent de San Francisco, Ermitage de la Plaza et Monastère de Cañas. Cinq monuments, huit siècles de patrimoine en La Rioja.'
    },
    de: {
      title: 'Monumente des Kathedralensembles · Santo Domingo de la Calzada',
      description: 'Kathedrale, freistehender Turm, Kloster San Francisco, Plaza-Einsiedelei und Kloster Cañas. Fünf Monumente, acht Jahrhunderte Erbe in La Rioja.'
    },
    pt: {
      title: 'Monumentos do Conjunto Catedralício · Santo Domingo de la Calzada',
      description: 'Catedral, Torre Isenta, Convento de San Francisco, Ermida da Praça e Mosteiro de Cañas. Cinco monumentos, oito séculos de património em La Rioja.'
    },
    it: {
      title: 'Monumenti del Complesso Cattedralizio · Santo Domingo de la Calzada',
      description: 'Cattedrale, Torre Isolata, Convento di San Francisco, Eremo della Piazza e Monastero di Cañas. Cinque monumenti, otto secoli di patrimonio in La Rioja.'
    },
    ko: {
      title: '대성당 복합 단지 기념물 · 산토 도밍고 데 라 칼사다',
      description: '대성당, 독립 종탑, 산 프란시스코 수도원, 플라자 예배당 및 카냐스 수도원. 라 리오하의 5개 기념물, 8세기의 유산.'
    },
    eu: {
      title: 'Katedral Multzoaren Monumentuak · Santo Domingo de la Calzada',
      description: 'Katedrala, Dorre Aske, San Francisco Komentua, Plazako Ermita eta Cañasko Monasterioa. Bost monumentu, zortzi mendeko ondarea Errioxan.'
    },
    ca: {
      title: 'Monuments del Conjunt Catedralici · Santo Domingo de la Calzada',
      description: 'Catedral, Torre Exempta, Convent de San Francisco, Ermita de la Plaça i Monestir de Cañas. Cinc monuments, vuit segles de patrimoni a La Rioja.'
    }
  },

  'visitas.html': {
    og_image: 'assets/img/catedral-institucion.webp',
    es: {
      title: 'Visitas · Pulsera Turística y Visitas Guiadas · Catedral de Santo Domingo',
      description: 'Visita los monumentos de Santo Domingo de la Calzada con la Pulsera Turística (10€) o reserva visitas guiadas diurnas, nocturnas y VIP. Reserva online.'
    },
    en: {
      title: 'Visits · Tourist Wristband and Guided Tours · Cathedral of Santo Domingo',
      description: 'Visit the monuments of Santo Domingo de la Calzada with the Tourist Wristband (10€) or book daytime, nighttime and VIP guided tours. Book online.'
    },
    fr: {
      title: 'Visites · Bracelet Touristique et Visites Guidées · Cathédrale Santo Domingo',
      description: 'Visitez les monuments de Santo Domingo de la Calzada avec le Bracelet Touristique (10€) ou réservez des visites guidées diurnes, nocturnes et VIP en ligne.'
    },
    de: {
      title: 'Besuche · Touristen-Armband und Führungen · Kathedrale Santo Domingo',
      description: 'Besuchen Sie die Monumente von Santo Domingo de la Calzada mit dem Touristen-Armband (10€) oder buchen Sie Tag-, Nacht- und VIP-Führungen online.'
    },
    pt: {
      title: 'Visitas · Pulseira Turística e Visitas Guiadas · Catedral Santo Domingo',
      description: 'Visite os monumentos de Santo Domingo de la Calzada com a Pulseira Turística (10€) ou reserve visitas guiadas diurnas, noturnas e VIP. Reserve online.'
    },
    it: {
      title: 'Visite · Braccialetto Turistico e Visite Guidate · Cattedrale Santo Domingo',
      description: 'Visita i monumenti di Santo Domingo de la Calzada con il Braccialetto Turistico (10€) o prenota visite guidate diurne, notturne e VIP online.'
    },
    ko: {
      title: '방문 · 관광 팔찌와 가이드 투어 · 산토 도밍고 대성당',
      description: '관광 팔찌(10€)로 산토 도밍고 데 라 칼사다 기념물을 방문하거나 주간, 야간 및 VIP 가이드 투어를 예약하세요. 온라인 예약 가능.'
    },
    eu: {
      title: 'Bisitak · Pulsera Turistikoa eta Bisita Gidatuak · Santo Domingoko Katedrala',
      description: 'Bisitatu Santo Domingo de la Calzadako monumentuak Pulsera Turistikoarekin (10€) edo erreserbatu eguneko, gaueko eta VIP bisita gidatuak online.'
    },
    ca: {
      title: 'Visites · Polsera Turística i Visites Guiades · Catedral Santo Domingo',
      description: 'Visita els monuments de Santo Domingo de la Calzada amb la Polsera Turística (10€) o reserva visites guiades diürnes, nocturnes i VIP. Reserva en línia.'
    }
  },

  'reservas.html': {
    og_image: 'assets/img/catedral-institucion.webp',
    es: {
      title: 'Reserva tu Entrada · Catedral de Santo Domingo de la Calzada',
      description: 'Compra online tu entrada a la Catedral, Torre Exenta y monumentos de Santo Domingo de la Calzada. Pulsera Turística, visitas guiadas y tarifa peregrino.'
    },
    en: {
      title: 'Book Your Ticket · Cathedral of Santo Domingo de la Calzada',
      description: 'Buy your ticket online for the Cathedral, Free-standing Tower and monuments of Santo Domingo de la Calzada. Tourist Wristband, guided tours and pilgrim rate.'
    },
    fr: {
      title: 'Réservez votre Billet · Cathédrale de Santo Domingo de la Calzada',
      description: 'Achetez en ligne votre billet pour la Cathédrale, la Tour Isolée et les monuments de Santo Domingo. Bracelet Touristique, visites guidées et tarif pèlerin.'
    },
    de: {
      title: 'Ticket buchen · Kathedrale Santo Domingo de la Calzada',
      description: 'Kaufen Sie online Ihr Ticket für die Kathedrale, den freistehenden Turm und die Monumente von Santo Domingo. Touristen-Armband, Führungen und Pilgertarif.'
    },
    pt: {
      title: 'Reserve a sua Entrada · Catedral de Santo Domingo de la Calzada',
      description: 'Compre online a sua entrada para a Catedral, Torre Isenta e monumentos de Santo Domingo de la Calzada. Pulseira Turística, visitas guiadas e tarifa peregrino.'
    },
    it: {
      title: 'Prenota il tuo Biglietto · Cattedrale di Santo Domingo de la Calzada',
      description: 'Acquista online il biglietto per la Cattedrale, la Torre Isolata e i monumenti di Santo Domingo. Braccialetto Turistico, visite guidate e tariffa pellegrino.'
    },
    ko: {
      title: '입장권 예약 · 산토 도밍고 데 라 칼사다 대성당',
      description: '산토 도밍고 데 라 칼사다의 대성당, 독립 종탑 및 기념물 입장권을 온라인으로 구매하세요. 관광 팔찌, 가이드 투어 및 순례자 요금 제공.'
    },
    eu: {
      title: 'Erreserbatu zure Sarrera · Santo Domingo de la Calzadako Katedrala',
      description: 'Erosi online zure sarrera Katedralerako, Dorre Askerako eta Santo Domingoko monumentuetarako. Pulsera Turistikoa, bisita gidatuak eta erromes tarifa.'
    },
    ca: {
      title: 'Reserva la teva Entrada · Catedral de Santo Domingo de la Calzada',
      description: 'Compra en línia la teva entrada a la Catedral, Torre Exempta i monuments de Santo Domingo de la Calzada. Polsera Turística, visites guiades i tarifa pelegrí.'
    }
  },

  /* ── MONUMENTOS ──────────────────────────────────────────────── */

  'monumentos/catedral.html': {
    og_image: 'assets/img/retablo.webp',
    schema_type: 'Church',
    es: {
      title: 'Catedral · Románico-Gótico · Santo Domingo de la Calzada',
      description: 'Catedral de los siglos XII-XIV, joya del románico-gótico riojano. Visita el milagro del gallo y la gallina, único en el mundo, y el retablo de Damián Forment.'
    },
    en: {
      title: 'Cathedral · Romanesque-Gothic · Santo Domingo de la Calzada',
      description: '12th-14th century cathedral, a Romanesque-Gothic jewel of La Rioja. Visit the unique miracle of the rooster and hen and the altarpiece by Damián Forment.'
    },
    fr: {
      title: 'Cathédrale · Roman-Gothique · Santo Domingo de la Calzada',
      description: 'Cathédrale des XIIe-XIVe siècles, joyau roman-gothique de La Rioja. Visitez le miracle unique du coq et de la poule et le retable de Damián Forment.'
    },
    de: {
      title: 'Kathedrale · Romanik-Gotik · Santo Domingo de la Calzada',
      description: 'Kathedrale aus dem 12.-14. Jh., romanisch-gotisches Juwel La Riojas. Erleben Sie das Wunder des Hahns und der Henne und das Retabel von Damián Forment.'
    },
    pt: {
      title: 'Catedral · Românico-Gótico · Santo Domingo de la Calzada',
      description: 'Catedral dos séculos XII-XIV, joia do românico-gótico riojano. Visite o milagre único do galo e da galinha e o retábulo de Damián Forment.'
    },
    it: {
      title: 'Cattedrale · Romanico-Gotico · Santo Domingo de la Calzada',
      description: 'Cattedrale dei secoli XII-XIV, gioiello romanico-gotico della Rioja. Visita il miracolo unico del gallo e della gallina e la pala di Damián Forment.'
    },
    ko: {
      title: '대성당 · 로마네스크-고딕 · 산토 도밍고 데 라 칼사다',
      description: '12-14세기에 지어진 라 리오하의 로마네스크-고딕 보석 대성당. 세계 유일의 수탉과 암탉의 기적과 다미안 포르멘트의 제단화를 만나보세요.'
    },
    eu: {
      title: 'Katedrala · Erromaniko-Gotikoa · Santo Domingo de la Calzada',
      description: 'XII-XIV. mendeetako Katedrala, Errioxako erromaniko-gotikoaren bitxia. Bisita ezazu oilarra eta oiloaren mirakulua eta Damián Formenten erretaula.'
    },
    ca: {
      title: 'Catedral · Romànic-Gòtic · Santo Domingo de la Calzada',
      description: 'Catedral dels segles XII-XIV, joia del romànic-gòtic riojà. Visita el miracle únic del gall i la gallina i el retaule de Damián Forment.'
    }
  },

  'monumentos/torre.html': {
    og_image: 'assets/img/torre-exenta.webp',
    schema_type: 'TouristAttraction',
    es: {
      title: 'Torre Exenta · Campanario Barroco de 70 m · Santo Domingo de la Calzada',
      description: 'Torre Exenta de 70 metros, único campanario barroco separado del templo en La Rioja. Sube y descubre el museo de relojes y campanas con vistas panorámicas.'
    },
    en: {
      title: 'Free-standing Tower · 70 m Baroque Belfry · Santo Domingo de la Calzada',
      description: '70-metre Free-standing Tower, the only Baroque belfry separated from the church in La Rioja. Climb up to the clock and bell museum with panoramic views.'
    },
    fr: {
      title: 'Tour Isolée · Clocher Baroque de 70 m · Santo Domingo de la Calzada',
      description: 'Tour Isolée de 70 mètres, unique clocher baroque séparé du temple en La Rioja. Montez et découvrez le musée d\'horloges et de cloches avec vues panoramiques.'
    },
    de: {
      title: 'Freistehender Turm · 70 m Barock-Glockenturm · Santo Domingo',
      description: '70 m hoher freistehender Turm, einziger vom Tempel getrennter Barock-Glockenturm La Riojas. Besuchen Sie das Uhren- und Glockenmuseum mit Panoramablick.'
    },
    pt: {
      title: 'Torre Isenta · Campanário Barroco de 70 m · Santo Domingo de la Calzada',
      description: 'Torre Isenta de 70 metros, único campanário barroco separado do templo em La Rioja. Suba e descubra o museu de relógios e sinos com vistas panorâmicas.'
    },
    it: {
      title: 'Torre Isolata · Campanile Barocco di 70 m · Santo Domingo de la Calzada',
      description: 'Torre Isolata di 70 metri, unico campanile barocco separato dal tempio della Rioja. Sali e scopri il museo di orologi e campane con viste panoramiche.'
    },
    ko: {
      title: '독립 종탑 · 70m 바로크 종탑 · 산토 도밍고 데 라 칼사다',
      description: '70m 높이의 독립 종탑, 라 리오하에서 유일하게 성당과 분리된 바로크 종탑. 시계와 종 박물관과 파노라마 전망을 즐기세요.'
    },
    eu: {
      title: 'Dorre Askea · 70 m-ko Kanpandorre Barrokoa · Santo Domingo',
      description: '70 metroko Dorre Askea, Errioxan tenplutik bereizitako kanpandorre barroko bakarra. Igo eta ezagutu erloju eta kanpaen museoa ikuspegi panoramikoekin.'
    },
    ca: {
      title: 'Torre Exempta · Campanar Barroc de 70 m · Santo Domingo de la Calzada',
      description: 'Torre Exempta de 70 metres, únic campanar barroc separat del temple a La Rioja. Puja i descobreix el museu de rellotges i campanes amb vistes panoràmiques.'
    }
  },

  'monumentos/sanfrancisco.html': {
    og_image: 'assets/img/sanfrancisco.webp',
    schema_type: 'TouristAttraction',
    es: {
      title: 'Convento de San Francisco · Renacimiento · Santo Domingo de la Calzada',
      description: 'Convento renacentista del siglo XVI fundado por Iñigo Ortiz de Zúñiga. Claustro porticado, sala de marfiles y exposiciones de arte sacro en el Camino Francés.'
    },
    en: {
      title: 'San Francisco Convent · Renaissance · Santo Domingo de la Calzada',
      description: '16th-century Renaissance convent founded by Iñigo Ortiz de Zúñiga. Porticoed cloister, ivory room and sacred art exhibitions on the French Way of St. James.'
    },
    fr: {
      title: 'Couvent de San Francisco · Renaissance · Santo Domingo de la Calzada',
      description: 'Couvent Renaissance du XVIe siècle fondé par Iñigo Ortiz de Zúñiga. Cloître à arcades, salle d\'ivoires et expositions d\'art sacré sur le Chemin français.'
    },
    de: {
      title: 'Kloster San Francisco · Renaissance · Santo Domingo de la Calzada',
      description: 'Renaissance-Kloster aus dem 16. Jh., gegründet von Iñigo Ortiz de Zúñiga. Säulenkreuzgang, Elfenbeinsaal und sakrale Kunstausstellungen am Französischen Weg.'
    },
    pt: {
      title: 'Convento de San Francisco · Renascimento · Santo Domingo de la Calzada',
      description: 'Convento renascentista do século XVI fundado por Iñigo Ortiz de Zúñiga. Claustro porticado, sala de marfins e exposições de arte sacra no Caminho Francês.'
    },
    it: {
      title: 'Convento di San Francisco · Rinascimento · Santo Domingo de la Calzada',
      description: 'Convento rinascimentale del XVI secolo fondato da Iñigo Ortiz de Zúñiga. Chiostro porticato, sala degli avori ed esposizioni d\'arte sacra sul Cammino Francese.'
    },
    ko: {
      title: '산 프란시스코 수도원 · 르네상스 · 산토 도밍고 데 라 칼사다',
      description: '이니고 오르티스 데 수니가가 설립한 16세기 르네상스 수도원. 아치형 회랑, 상아 전시실 및 프랑스 길의 종교 예술 전시.'
    },
    eu: {
      title: 'San Francisco Komentua · Errenazimentua · Santo Domingo de la Calzada',
      description: 'XVI. mendeko komentu errenazentista, Iñigo Ortiz de Zúñigak sortua. Klaustro porteatua, marfilezko aretoa eta arte sakratu erakusketak Bide Frantsesean.'
    },
    ca: {
      title: 'Convent de San Francisco · Renaixement · Santo Domingo de la Calzada',
      description: 'Convent renaixentista del segle XVI fundat per Iñigo Ortiz de Zúñiga. Claustre porticat, sala d\'ivoris i exposicions d\'art sacre al Camí Francès.'
    }
  },

  'monumentos/ermitaplaza.html': {
    og_image: 'assets/img/ermitaplaza.webp',
    schema_type: 'TouristAttraction',
    es: {
      title: 'Ermita de la Plaza · Iglesia de Nuestra Señora · Santo Domingo de la Calzada',
      description: 'Antigua iglesia de Nuestra Señora de la Plaza. Capilla histórica con la Virgen de la Plaza, talla gótica del siglo XIV en pleno casco antiguo.'
    },
    en: {
      title: 'Plaza Chapel · Church of Our Lady · Santo Domingo de la Calzada',
      description: 'Former church of Our Lady of the Plaza. Historic chapel housing the Virgin of the Plaza, a 14th-century Gothic carving in the heart of the old town.'
    },
    fr: {
      title: 'Ermitage de la Plaza · Église Notre-Dame · Santo Domingo de la Calzada',
      description: 'Ancienne église de Notre-Dame de la Plaza. Chapelle historique avec la Vierge de la Plaza, sculpture gothique du XIVe siècle en plein cœur historique.'
    },
    de: {
      title: 'Plaza-Einsiedelei · Kirche Unserer Lieben Frau · Santo Domingo',
      description: 'Ehemalige Kirche Unserer Lieben Frau von der Plaza. Historische Kapelle mit der gotischen Plaza-Madonna aus dem 14. Jh. in der Altstadt von Santo Domingo.'
    },
    pt: {
      title: 'Ermida da Praça · Igreja de Nossa Senhora · Santo Domingo de la Calzada',
      description: 'Antiga igreja de Nossa Senhora da Praça. Capela histórica com a Virgem da Praça, talha gótica do século XIV em pleno centro histórico.'
    },
    it: {
      title: 'Eremo della Piazza · Chiesa di Nostra Signora · Santo Domingo de la Calzada',
      description: 'Antica chiesa di Nostra Signora della Piazza. Cappella storica con la Vergine della Piazza, scultura gotica del XIV secolo nel cuore del centro storico.'
    },
    ko: {
      title: '플라자 예배당 · 성모 마리아 교회 · 산토 도밍고 데 라 칼사다',
      description: '플라자의 성모 마리아 옛 교회. 구 시가지 중심에 위치한 14세기 고딕 양식의 플라자의 성모상이 있는 역사적인 예배당.'
    },
    eu: {
      title: 'Plazako Ermita · Ama Birjinaren Eliza · Santo Domingo de la Calzada',
      description: 'Plazako Ama Birjinaren eliza zaharra. Plazako Ama Birjinaren XIV. mendeko zizelkadura gotikoa duen kapera historikoa alde zaharrean.'
    },
    ca: {
      title: 'Ermita de la Plaça · Església de Nostra Senyora · Santo Domingo de la Calzada',
      description: 'Antiga església de Nostra Senyora de la Plaça. Capella històrica amb la Verge de la Plaça, talla gòtica del segle XIV al cor del nucli antic.'
    }
  },

  'monumentos/monasteriocanas.html': {
    og_image: 'assets/img/canas.webp',
    schema_type: 'TouristAttraction',
    es: {
      title: 'Monasterio de Cañas · Cisterciense · Beata Urraca · La Rioja',
      description: 'Monasterio cisterciense de Santa María de Cañas. Vidrieras góticas, sepulcro de la Beata Urraca y Sala Capitular románica a 12 km de Santo Domingo.'
    },
    en: {
      title: 'Cañas Monastery · Cistercian · Beata Urraca · La Rioja',
      description: 'Cistercian monastery of Santa María de Cañas. Gothic stained glass, tomb of Beata Urraca and Romanesque Chapter House just 12 km from Santo Domingo.'
    },
    fr: {
      title: 'Monastère de Cañas · Cistercien · Beata Urraca · La Rioja',
      description: 'Monastère cistercien de Santa María de Cañas. Vitraux gothiques, sépulcre de la Beata Urraca et Salle Capitulaire romane à 12 km de Santo Domingo.'
    },
    de: {
      title: 'Kloster Cañas · Zisterzienser · Beata Urraca · La Rioja',
      description: 'Zisterzienserkloster Santa María de Cañas. Gotische Glasfenster, Grab der Beata Urraca und romanischer Kapitelsaal nur 12 km von Santo Domingo entfernt.'
    },
    pt: {
      title: 'Mosteiro de Cañas · Cisterciense · Beata Urraca · La Rioja',
      description: 'Mosteiro cisterciense de Santa María de Cañas. Vitrais góticos, sepulcro da Beata Urraca e Sala Capitular românica a 12 km de Santo Domingo.'
    },
    it: {
      title: 'Monastero di Cañas · Cistercense · Beata Urraca · La Rioja',
      description: 'Monastero cistercense di Santa María de Cañas. Vetrate gotiche, sepolcro della Beata Urraca e Sala Capitolare romanica a 12 km da Santo Domingo.'
    },
    ko: {
      title: '카냐스 수도원 · 시토회 · 베아타 우라카 · 라 리오하',
      description: '산타 마리아 데 카냐스 시토회 수도원. 산토 도밍고에서 12km 떨어진 곳에 위치한 고딕 스테인드글라스, 베아타 우라카의 묘와 로마네스크 참사회실.'
    },
    eu: {
      title: 'Cañasko Monasterioa · Zisterziarra · Urraka Dohatsua · Errioxa',
      description: 'Santa María de Cañasko monasterio zisterziarra. Beirate gotikoak, Urraka Dohatsuaren hilobia eta Kapitulu Areto erromanikoa Santo Domingotik 12 km-ra.'
    },
    ca: {
      title: 'Monestir de Cañas · Cistercenc · Beata Urraca · La Rioja',
      description: 'Monestir cistercenc de Santa María de Cañas. Vitralls gòtics, sepulcre de la Beata Urraca i Sala Capitular romànica a 12 km de Santo Domingo.'
    }
  },

  /* ── VISITAS ─────────────────────────────────────────────────── */

  'visitas/pulsera-turistica.html': {
    og_image: 'assets/img/pulsera.webp',
    es: {
      title: 'Pulsera Turística · 4 Monumentos por 10€ · Santo Domingo de la Calzada',
      description: 'Pulsera Turística: acceso libre a 4 monumentos del conjunto catedralicio por 10€. Tarifa peregrino 5€. Válida todo el día. Reserva online.'
    },
    en: {
      title: 'Tourist Wristband · 4 Monuments for 10€ · Santo Domingo de la Calzada',
      description: 'Tourist Wristband: free access to 4 monuments of the cathedral complex for 10€. Pilgrim rate 5€. Valid all day long. Book online today.'
    },
    fr: {
      title: 'Bracelet Touristique · 4 Monuments pour 10€ · Santo Domingo de la Calzada',
      description: 'Bracelet Touristique : accès libre à 4 monuments de l\'ensemble cathédral pour 10€. Tarif pèlerin 5€. Valable toute la journée. Réservez en ligne.'
    },
    de: {
      title: 'Touristen-Armband · 4 Monumente für 10€ · Santo Domingo de la Calzada',
      description: 'Touristen-Armband: freier Zugang zu 4 Monumenten des Kathedralensembles für 10€. Pilgertarif 5€. Ganztägig gültig. Jetzt online buchen.'
    },
    pt: {
      title: 'Pulseira Turística · 4 Monumentos por 10€ · Santo Domingo de la Calzada',
      description: 'Pulseira Turística: acesso livre a 4 monumentos do conjunto catedralício por 10€. Tarifa peregrino 5€. Válida todo o dia. Reserve online.'
    },
    it: {
      title: 'Braccialetto Turistico · 4 Monumenti a 10€ · Santo Domingo de la Calzada',
      description: 'Braccialetto Turistico: accesso libero a 4 monumenti del complesso cattedralizio per 10€. Tariffa pellegrino 5€. Valido tutto il giorno. Prenota online.'
    },
    ko: {
      title: '관광 팔찌 · 10€에 4개 기념물 · 산토 도밍고 데 라 칼사다',
      description: '관광 팔찌: 10€로 대성당 복합 단지의 4개 기념물에 자유 입장. 순례자 요금 5€. 하루 종일 유효. 지금 온라인으로 예약하세요.'
    },
    eu: {
      title: 'Pulsera Turistikoa · 4 Monumentu 10€-ko · Santo Domingo de la Calzada',
      description: 'Pulsera Turistikoa: katedral multzoaren 4 monumentuetarako sarrera librea 10€-ko. Erromes tarifa 5€. Egun osoan baliogarria. Erreserbatu online.'
    },
    ca: {
      title: 'Polsera Turística · 4 Monuments per 10€ · Santo Domingo de la Calzada',
      description: 'Polsera Turística: accés lliure a 4 monuments del conjunt catedralici per 10€. Tarifa pelegrí 5€. Vàlida tot el dia. Reserva en línia.'
    }
  },

  'visitas/guiada-diurna.html': {
    og_image: 'assets/img/guiada-diurna.webp',
    es: {
      title: 'Visita Guiada Diurna · Catedral de Santo Domingo de la Calzada',
      description: 'Visita guiada diurna por la Catedral y sus monumentos. Recorre 8 siglos de historia, descubre el milagro del gallo y reserva tu plaza online (14€).'
    },
    en: {
      title: 'Daytime Guided Tour · Cathedral of Santo Domingo de la Calzada',
      description: 'Daytime guided tour of the Cathedral and its monuments. Explore 8 centuries of history, discover the miracle of the hen and book your spot online (14€).'
    },
    fr: {
      title: 'Visite Guidée Diurne · Cathédrale de Santo Domingo de la Calzada',
      description: 'Visite guidée diurne de la Cathédrale et ses monuments. Parcourez 8 siècles d\'histoire, découvrez le miracle du coq et réservez votre place en ligne (14€).'
    },
    de: {
      title: 'Tagesführung · Kathedrale Santo Domingo de la Calzada',
      description: 'Tagesführung durch die Kathedrale und ihre Monumente. Entdecken Sie 8 Jahrhunderte Geschichte, das Wunder des Hahns und buchen Sie online (14€).'
    },
    pt: {
      title: 'Visita Guiada Diurna · Catedral de Santo Domingo de la Calzada',
      description: 'Visita guiada diurna pela Catedral e os seus monumentos. Percorra 8 séculos de história, descubra o milagre do galo e reserve a sua vaga online (14€).'
    },
    it: {
      title: 'Visita Guidata Diurna · Cattedrale di Santo Domingo de la Calzada',
      description: 'Visita guidata diurna della Cattedrale e dei suoi monumenti. Percorri 8 secoli di storia, scopri il miracolo del gallo e prenota online (14€).'
    },
    ko: {
      title: '주간 가이드 투어 · 산토 도밍고 데 라 칼사다 대성당',
      description: '대성당과 기념물의 주간 가이드 투어. 8세기의 역사를 둘러보고, 수탉의 기적을 발견하고, 온라인으로 자리를 예약하세요(14€).'
    },
    eu: {
      title: 'Eguneko Bisita Gidatua · Santo Domingo de la Calzadako Katedrala',
      description: 'Katedralaren eta bere monumentuen eguneko bisita gidatua. Ibili 8 mendeko historia, ezagutu oilarraren mirakulua eta erreserbatu online (14€).'
    },
    ca: {
      title: 'Visita Guiada Diürna · Catedral de Santo Domingo de la Calzada',
      description: 'Visita guiada diürna per la Catedral i els seus monuments. Recorre 8 segles d\'història, descobreix el miracle del gall i reserva la teva plaça (14€).'
    }
  },

  'visitas/guiada-nocturna.html': {
    og_image: 'assets/img/iluminacion-nocturna.webp',
    es: {
      title: 'Visita Guiada Nocturna · Catedral Iluminada · Santo Domingo',
      description: 'Visita guiada nocturna por la Catedral iluminada. Una experiencia única para descubrir el conjunto catedralicio en una atmósfera mística (15€). Reserva online.'
    },
    en: {
      title: 'Nighttime Guided Tour · Illuminated Cathedral · Santo Domingo',
      description: 'Nighttime guided tour of the illuminated Cathedral. A unique experience to discover the cathedral complex in a mystical atmosphere (15€). Book online.'
    },
    fr: {
      title: 'Visite Guidée Nocturne · Cathédrale Illuminée · Santo Domingo',
      description: 'Visite guidée nocturne de la Cathédrale illuminée. Une expérience unique pour découvrir l\'ensemble cathédral dans une atmosphère mystique (15€). En ligne.'
    },
    de: {
      title: 'Nachtführung · Beleuchtete Kathedrale · Santo Domingo',
      description: 'Nachtführung durch die beleuchtete Kathedrale. Ein einzigartiges Erlebnis zur Entdeckung des Kathedralensembles in mystischer Atmosphäre (15€). Online buchen.'
    },
    pt: {
      title: 'Visita Guiada Noturna · Catedral Iluminada · Santo Domingo',
      description: 'Visita guiada noturna pela Catedral iluminada. Uma experiência única para descobrir o conjunto catedralício numa atmosfera mística (15€). Reserve online.'
    },
    it: {
      title: 'Visita Guidata Notturna · Cattedrale Illuminata · Santo Domingo',
      description: 'Visita guidata notturna della Cattedrale illuminata. Un\'esperienza unica per scoprire il complesso cattedralizio in atmosfera mistica (15€). Online.'
    },
    ko: {
      title: '야간 가이드 투어 · 조명이 켜진 대성당 · 산토 도밍고',
      description: '조명이 켜진 대성당의 야간 가이드 투어. 신비로운 분위기 속에서 대성당 복합 단지를 발견하는 독특한 경험(15€). 온라인 예약 가능.'
    },
    eu: {
      title: 'Gaueko Bisita Gidatua · Katedrala Argituta · Santo Domingo',
      description: 'Katedral argituaren gaueko bisita gidatua. Esperientzia berezia katedral multzoa giro mistikoan ezagutzeko (15€). Erreserbatu online gaur bertan.'
    },
    ca: {
      title: 'Visita Guiada Nocturna · Catedral Il·luminada · Santo Domingo',
      description: 'Visita guiada nocturna per la Catedral il·luminada. Una experiència única per descobrir el conjunt catedralici en una atmosfera mística (15€). En línia.'
    }
  },

  'visitas/guiada-vip.html': {
    og_image: 'assets/img/guiada-vip.webp',
    es: {
      title: 'Visita Guiada VIP · Acceso Exclusivo · Catedral de Santo Domingo',
      description: 'Visita guiada VIP con acceso a zonas exclusivas de la Catedral: cripta, archivo y rincones reservados. Experiencia premium con guía especializado (15€).'
    },
    en: {
      title: 'VIP Guided Tour · Exclusive Access · Cathedral of Santo Domingo',
      description: 'VIP guided tour with access to exclusive areas of the Cathedral: crypt, archive and reserved corners. Premium experience with a specialised guide (15€).'
    },
    fr: {
      title: 'Visite Guidée VIP · Accès Exclusif · Cathédrale de Santo Domingo',
      description: 'Visite guidée VIP avec accès aux zones exclusives de la Cathédrale : crypte, archives et recoins réservés. Expérience premium avec guide spécialisé (15€).'
    },
    de: {
      title: 'VIP-Führung · Exklusiver Zugang · Kathedrale Santo Domingo',
      description: 'VIP-Führung mit Zugang zu exklusiven Bereichen der Kathedrale: Krypta, Archiv und reservierte Ecken. Premium-Erlebnis mit Fachführer (15€).'
    },
    pt: {
      title: 'Visita Guiada VIP · Acesso Exclusivo · Catedral de Santo Domingo',
      description: 'Visita guiada VIP com acesso a zonas exclusivas da Catedral: cripta, arquivo e recantos reservados. Experiência premium com guia especializado (15€).'
    },
    it: {
      title: 'Visita Guidata VIP · Accesso Esclusivo · Cattedrale di Santo Domingo',
      description: 'Visita guidata VIP con accesso a zone esclusive della Cattedrale: cripta, archivio e angoli riservati. Esperienza premium con guida specializzata (15€).'
    },
    ko: {
      title: 'VIP 가이드 투어 · 독점 접근 · 산토 도밍고 대성당',
      description: '대성당의 독점 구역(지하실, 기록 보관소, 비공개 공간)에 접근하는 VIP 가이드 투어. 전문 가이드와 함께하는 프리미엄 경험(15€).'
    },
    eu: {
      title: 'VIP Bisita Gidatua · Sarrera Esklusiboa · Santo Domingoko Katedrala',
      description: 'VIP bisita gidatua Katedralaren eremu esklusiboetarako sarbidearekin: kripta, artxiboa eta gordetako bazterrak. Premium esperientzia gida espezializatuarekin (15€).'
    },
    ca: {
      title: 'Visita Guiada VIP · Accés Exclusiu · Catedral de Santo Domingo',
      description: 'Visita guiada VIP amb accés a zones exclusives de la Catedral: cripta, arxiu i racons reservats. Experiència premium amb guia especialitzat (15€).'
    }
  },

  'visitas/guiada-canas.html': {
    og_image: 'assets/img/vidrieras-canas.webp',
    es: {
      title: 'Visita Guiada Monasterio de Cañas · Cisterciense · La Rioja',
      description: 'Visita guiada al Monasterio Cisterciense de Cañas. Vidrieras góticas, claustro, sepulcro de la Beata Urraca y Sala Capitular. Recorrido completo con guía.'
    },
    en: {
      title: 'Guided Tour of Cañas Monastery · Cistercian · La Rioja',
      description: 'Guided tour of the Cistercian Monastery of Cañas. Gothic stained glass, cloister, tomb of Beata Urraca and Chapter House. Full tour with specialised guide.'
    },
    fr: {
      title: 'Visite Guidée du Monastère de Cañas · Cistercien · La Rioja',
      description: 'Visite guidée du Monastère Cistercien de Cañas. Vitraux gothiques, cloître, sépulcre de la Beata Urraca et Salle Capitulaire. Parcours complet avec guide.'
    },
    de: {
      title: 'Führung Kloster Cañas · Zisterzienser · La Rioja',
      description: 'Führung durch das Zisterzienserkloster Cañas. Gotische Glasfenster, Kreuzgang, Grab der Beata Urraca und Kapitelsaal. Komplette Tour mit Fachführer.'
    },
    pt: {
      title: 'Visita Guiada Mosteiro de Cañas · Cisterciense · La Rioja',
      description: 'Visita guiada ao Mosteiro Cisterciense de Cañas. Vitrais góticos, claustro, sepulcro da Beata Urraca e Sala Capitular. Percurso completo com guia.'
    },
    it: {
      title: 'Visita Guidata Monastero di Cañas · Cistercense · La Rioja',
      description: 'Visita guidata al Monastero Cistercense di Cañas. Vetrate gotiche, chiostro, sepolcro della Beata Urraca e Sala Capitolare. Percorso completo con guida.'
    },
    ko: {
      title: '카냐스 수도원 가이드 투어 · 시토회 · 라 리오하',
      description: '카냐스 시토회 수도원 가이드 투어. 고딕 스테인드글라스, 회랑, 베아타 우라카의 묘와 참사회실. 전문 가이드와 함께하는 완전한 투어.'
    },
    eu: {
      title: 'Cañasko Monasterio Bisita Gidatua · Zisterziarra · Errioxa',
      description: 'Cañasko Monasterio Zisterziarrera bisita gidatua. Beirate gotikoak, klaustroa, Urraka Dohatsuaren hilobia eta Kapitulu Aretoa. Ibilbide osoa gidarekin.'
    },
    ca: {
      title: 'Visita Guiada Monestir de Cañas · Cistercenc · La Rioja',
      description: 'Visita guiada al Monestir Cistercenc de Cañas. Vitralls gòtics, claustre, sepulcre de la Beata Urraca i Sala Capitular. Recorregut complet amb guia.'
    }
  },

  /* ── LEGAL ───────────────────────────────────────────────────── */

  'legal/aviso-legal.html': {
    og_image: 'assets/img/catedral-institucion.webp',
    robots: 'noindex, follow',
    es: {
      title: 'Aviso Legal · Catedral de Santo Domingo de la Calzada',
      description: 'Aviso legal y términos de uso del sitio web oficial de la Catedral de Santo Domingo de la Calzada.'
    },
    en: {
      title: 'Legal Notice · Cathedral of Santo Domingo de la Calzada',
      description: 'Legal notice and terms of use for the official website of the Cathedral of Santo Domingo de la Calzada.'
    },
    fr: {
      title: 'Mentions Légales · Cathédrale de Santo Domingo de la Calzada',
      description: 'Mentions légales et conditions d\'utilisation du site web officiel de la Cathédrale de Santo Domingo de la Calzada.'
    },
    de: {
      title: 'Impressum · Kathedrale Santo Domingo de la Calzada',
      description: 'Impressum und Nutzungsbedingungen der offiziellen Website der Kathedrale Santo Domingo de la Calzada.'
    },
    pt: {
      title: 'Aviso Legal · Catedral de Santo Domingo de la Calzada',
      description: 'Aviso legal e termos de uso do site oficial da Catedral de Santo Domingo de la Calzada.'
    },
    it: {
      title: 'Note Legali · Cattedrale di Santo Domingo de la Calzada',
      description: 'Note legali e condizioni d\'uso del sito web ufficiale della Cattedrale di Santo Domingo de la Calzada.'
    },
    ko: {
      title: '법적 고지 · 산토 도밍고 데 라 칼사다 대성당',
      description: '산토 도밍고 데 라 칼사다 대성당 공식 웹사이트의 법적 고지 및 이용 약관.'
    },
    eu: {
      title: 'Lege Oharra · Santo Domingo de la Calzadako Katedrala',
      description: 'Santo Domingo de la Calzadako Katedralaren webgune ofizialaren lege oharra eta erabilera baldintzak.'
    },
    ca: {
      title: 'Avís Legal · Catedral de Santo Domingo de la Calzada',
      description: 'Avís legal i termes d\'ús del lloc web oficial de la Catedral de Santo Domingo de la Calzada.'
    }
  },

  'legal/privacidad.html': {
    og_image: 'assets/img/catedral-institucion.webp',
    robots: 'noindex, follow',
    es: {
      title: 'Política de Privacidad · Catedral de Santo Domingo de la Calzada',
      description: 'Política de privacidad y tratamiento de datos personales del sitio web oficial de la Catedral de Santo Domingo de la Calzada.'
    },
    en: {
      title: 'Privacy Policy · Cathedral of Santo Domingo de la Calzada',
      description: 'Privacy policy and personal data processing for the official website of the Cathedral of Santo Domingo de la Calzada.'
    },
    fr: {
      title: 'Politique de Confidentialité · Cathédrale de Santo Domingo de la Calzada',
      description: 'Politique de confidentialité et traitement des données personnelles du site officiel de la Cathédrale de Santo Domingo de la Calzada.'
    },
    de: {
      title: 'Datenschutzerklärung · Kathedrale Santo Domingo de la Calzada',
      description: 'Datenschutzerklärung und Verarbeitung personenbezogener Daten der offiziellen Website der Kathedrale Santo Domingo de la Calzada.'
    },
    pt: {
      title: 'Política de Privacidade · Catedral de Santo Domingo de la Calzada',
      description: 'Política de privacidade e tratamento de dados pessoais do site oficial da Catedral de Santo Domingo de la Calzada.'
    },
    it: {
      title: 'Privacy Policy · Cattedrale di Santo Domingo de la Calzada',
      description: 'Informativa sulla privacy e trattamento dei dati personali del sito web ufficiale della Cattedrale di Santo Domingo de la Calzada.'
    },
    ko: {
      title: '개인정보 보호정책 · 산토 도밍고 데 라 칼사다 대성당',
      description: '산토 도밍고 데 라 칼사다 대성당 공식 웹사이트의 개인정보 보호정책 및 개인 데이터 처리 안내.'
    },
    eu: {
      title: 'Pribatutasun Politika · Santo Domingo de la Calzadako Katedrala',
      description: 'Santo Domingo de la Calzadako Katedralaren webgune ofizialaren pribatutasun politika eta datu pertsonalen tratamendua.'
    },
    ca: {
      title: 'Política de Privacitat · Catedral de Santo Domingo de la Calzada',
      description: 'Política de privacitat i tractament de dades personals del lloc web oficial de la Catedral de Santo Domingo de la Calzada.'
    }
  },

  'legal/cookies.html': {
    og_image: 'assets/img/catedral-institucion.webp',
    robots: 'noindex, follow',
    es: {
      title: 'Política de Cookies · Catedral de Santo Domingo de la Calzada',
      description: 'Información sobre el uso de cookies en el sitio web oficial de la Catedral de Santo Domingo de la Calzada.'
    },
    en: {
      title: 'Cookie Policy · Cathedral of Santo Domingo de la Calzada',
      description: 'Information about the use of cookies on the official website of the Cathedral of Santo Domingo de la Calzada.'
    },
    fr: {
      title: 'Politique de Cookies · Cathédrale de Santo Domingo de la Calzada',
      description: 'Informations sur l\'utilisation des cookies sur le site web officiel de la Cathédrale de Santo Domingo de la Calzada.'
    },
    de: {
      title: 'Cookie-Richtlinie · Kathedrale Santo Domingo de la Calzada',
      description: 'Informationen zur Verwendung von Cookies auf der offiziellen Website der Kathedrale Santo Domingo de la Calzada.'
    },
    pt: {
      title: 'Política de Cookies · Catedral de Santo Domingo de la Calzada',
      description: 'Informação sobre o uso de cookies no site oficial da Catedral de Santo Domingo de la Calzada.'
    },
    it: {
      title: 'Cookie Policy · Cattedrale di Santo Domingo de la Calzada',
      description: 'Informazioni sull\'uso dei cookie nel sito web ufficiale della Cattedrale di Santo Domingo de la Calzada.'
    },
    ko: {
      title: '쿠키 정책 · 산토 도밍고 데 라 칼사다 대성당',
      description: '산토 도밍고 데 라 칼사다 대성당 공식 웹사이트의 쿠키 사용에 대한 정보 안내.'
    },
    eu: {
      title: 'Cookien Politika · Santo Domingo de la Calzadako Katedrala',
      description: 'Santo Domingo de la Calzadako Katedralaren webgune ofizialean cookien erabilerari buruzko informazioa.'
    },
    ca: {
      title: 'Política de Cookies · Catedral de Santo Domingo de la Calzada',
      description: 'Informació sobre l\'ús de cookies al lloc web oficial de la Catedral de Santo Domingo de la Calzada.'
    }
  },

  'legal/compra.html': {
    og_image: 'assets/img/catedral-institucion.webp',
    robots: 'noindex, follow',
    es: {
      title: 'Condiciones de Compra · Catedral de Santo Domingo de la Calzada',
      description: 'Condiciones generales de compra y reserva de entradas para la Catedral de Santo Domingo de la Calzada y sus monumentos.'
    },
    en: {
      title: 'Purchase Terms · Cathedral of Santo Domingo de la Calzada',
      description: 'General terms of purchase and ticket booking for the Cathedral of Santo Domingo de la Calzada and its monuments.'
    },
    fr: {
      title: 'Conditions d\'Achat · Cathédrale de Santo Domingo de la Calzada',
      description: 'Conditions générales d\'achat et de réservation de billets pour la Cathédrale de Santo Domingo de la Calzada et ses monuments.'
    },
    de: {
      title: 'Kaufbedingungen · Kathedrale Santo Domingo de la Calzada',
      description: 'Allgemeine Kauf- und Buchungsbedingungen für Tickets der Kathedrale Santo Domingo de la Calzada und ihrer Monumente.'
    },
    pt: {
      title: 'Condições de Compra · Catedral de Santo Domingo de la Calzada',
      description: 'Condições gerais de compra e reserva de entradas para a Catedral de Santo Domingo de la Calzada e os seus monumentos.'
    },
    it: {
      title: 'Condizioni di Acquisto · Cattedrale di Santo Domingo de la Calzada',
      description: 'Condizioni generali di acquisto e prenotazione biglietti per la Cattedrale di Santo Domingo de la Calzada e i suoi monumenti.'
    },
    ko: {
      title: '구매 조건 · 산토 도밍고 데 라 칼사다 대성당',
      description: '산토 도밍고 데 라 칼사다 대성당 및 기념물 입장권 구매와 예약에 대한 일반 약관 안내.'
    },
    eu: {
      title: 'Erosketa Baldintzak · Santo Domingo de la Calzadako Katedrala',
      description: 'Santo Domingo de la Calzadako Katedralaren eta bere monumentuetarako sarrerak erosi eta erreserbatzeko baldintza orokorrak.'
    },
    ca: {
      title: 'Condicions de Compra · Catedral de Santo Domingo de la Calzada',
      description: 'Condicions generals de compra i reserva d\'entrades per a la Catedral de Santo Domingo de la Calzada i els seus monuments.'
    }
  },

  'legal/accesibilidad.html': {
    og_image: 'assets/img/catedral-institucion.webp',
    es: {
      title: 'Accesibilidad · Catedral de Santo Domingo de la Calzada',
      description: 'Declaración de accesibilidad del sitio web oficial de la Catedral de Santo Domingo de la Calzada y sus monumentos.'
    },
    en: {
      title: 'Accessibility · Cathedral of Santo Domingo de la Calzada',
      description: 'Accessibility statement for the official website of the Cathedral of Santo Domingo de la Calzada and its monuments.'
    },
    fr: {
      title: 'Accessibilité · Cathédrale de Santo Domingo de la Calzada',
      description: 'Déclaration d\'accessibilité du site web officiel de la Cathédrale de Santo Domingo de la Calzada et de ses monuments.'
    },
    de: {
      title: 'Barrierefreiheit · Kathedrale Santo Domingo de la Calzada',
      description: 'Erklärung zur Barrierefreiheit der offiziellen Website der Kathedrale Santo Domingo de la Calzada und ihrer Monumente.'
    },
    pt: {
      title: 'Acessibilidade · Catedral de Santo Domingo de la Calzada',
      description: 'Declaração de acessibilidade do site oficial da Catedral de Santo Domingo de la Calzada e dos seus monumentos.'
    },
    it: {
      title: 'Accessibilità · Cattedrale di Santo Domingo de la Calzada',
      description: 'Dichiarazione di accessibilità del sito web ufficiale della Cattedrale di Santo Domingo de la Calzada e dei suoi monumenti.'
    },
    ko: {
      title: '접근성 · 산토 도밍고 데 라 칼사다 대성당',
      description: '산토 도밍고 데 라 칼사다 대성당과 기념물 공식 웹사이트의 접근성 선언문 안내.'
    },
    eu: {
      title: 'Irisgarritasuna · Santo Domingo de la Calzadako Katedrala',
      description: 'Santo Domingo de la Calzadako Katedralaren eta bere monumentuen webgune ofizialaren irisgarritasun adierazpena.'
    },
    ca: {
      title: 'Accessibilitat · Catedral de Santo Domingo de la Calzada',
      description: 'Declaració d\'accessibilitat del lloc web oficial de la Catedral de Santo Domingo de la Calzada i els seus monuments.'
    }
  }

};

/* ── LOCALE MAPPING ──────────────────────────────────────────────
   Used for og:locale and html lang attribute.
*/
window.SEO_LOCALES = {
  es: 'es_ES',
  en: 'en_GB',
  fr: 'fr_FR',
  de: 'de_DE',
  pt: 'pt_PT',
  it: 'it_IT',
  ko: 'ko_KR',
  eu: 'eu_ES',
  ca: 'ca_ES'
};

/* ── HELPER: apply SEO for given page + lang ─────────────────────
   Updates <title>, <meta description>, og:title, og:description,
   og:locale, twitter:title, twitter:description.
   Called by shared.js applyLang(); also can be called directly.
*/
window.applySEO = function (pageKey, lang) {
  const page = window.PAGE_SEO[pageKey];
  if (!page) return;
  const data = page[lang] || page.es;
  if (!data) return;

  // <title>
  document.title = data.title;

  // Static metas
  const set = (selector, attr, value) => {
    const el = document.querySelector(selector);
    if (el && value) el.setAttribute(attr, value);
  };

  set('meta[name="description"]', 'content', data.description);
  set('meta[property="og:title"]', 'content', data.title);
  set('meta[property="og:description"]', 'content', data.description);
  set('meta[property="og:locale"]', 'content', window.SEO_LOCALES[lang] || 'es_ES');
  set('meta[name="twitter:title"]', 'content', data.title);
  set('meta[name="twitter:description"]', 'content', data.description);
};
