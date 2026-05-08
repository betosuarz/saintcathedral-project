(function () {
  'use strict';

  /* ─── Lang detect ─── */
  const _lang = () =>
    new URLSearchParams(location.search).get('lang') ||
    localStorage.getItem('cat-lang') || 'es';

  /* ─── Labels por idioma ─── */
  const LABELS = {
    es: { a11y: 'Accesibilidad', lightMode: 'Modo claro', darkMode: 'Modo oscuro', grayscale: 'Escala de grises', highContrast: 'Alto contraste', invert: 'Invertir colores', underline: 'Subrayar enlaces', readable: 'Fuente legible', reset: 'Restablecer', fontPlus: 'Texto grande', fontMinus: 'Texto pequeño' },
    en: { a11y: 'Accessibility', lightMode: 'Light mode', darkMode: 'Dark mode', grayscale: 'Grayscale', highContrast: 'High contrast', invert: 'Invert colours', underline: 'Underline links', readable: 'Readable font', reset: 'Reset', fontPlus: 'Larger text', fontMinus: 'Smaller text' },
    de: { a11y: 'Barrierefreiheit', lightMode: 'Heller Modus', darkMode: 'Dunkler Modus', grayscale: 'Graustufen', highContrast: 'Hoher Kontrast', invert: 'Farben invertieren', underline: 'Links unterstreichen', readable: 'Lesbare Schrift', reset: 'Zurücksetzen', fontPlus: 'Größerer Text', fontMinus: 'Kleinerer Text' },
    fr: { a11y: 'Accessibilité', lightMode: 'Mode clair', darkMode: 'Mode sombre', grayscale: 'Niveaux de gris', highContrast: 'Contraste élevé', invert: 'Inverser les couleurs', underline: 'Souligner les liens', readable: 'Police lisible', reset: 'Réinitialiser', fontPlus: 'Texte plus grand', fontMinus: 'Texte plus petit' },
    it: { a11y: 'Accessibilità', lightMode: 'Modalità chiara', darkMode: 'Modalità scura', grayscale: 'Scala di grigi', highContrast: 'Alto contrasto', invert: 'Inverti colori', underline: 'Sottolinea link', readable: 'Carattere leggibile', reset: 'Ripristina', fontPlus: 'Testo più grande', fontMinus: 'Testo più piccolo' },
    pt: { a11y: 'Acessibilidade', lightMode: 'Modo claro', darkMode: 'Modo escuro', grayscale: 'Escala de cinza', highContrast: 'Alto contraste', invert: 'Inverter cores', underline: 'Sublinhar ligações', readable: 'Fonte legível', reset: 'Repor', fontPlus: 'Texto maior', fontMinus: 'Texto menor' },
    ko: { a11y: '접근성', lightMode: '밝은 모드', darkMode: '어두운 모드', grayscale: '회색조', highContrast: '고대비', invert: '색 반전', underline: '링크 밑줄', readable: '읽기 쉬운 글꼴', reset: '초기화', fontPlus: '글자 크게', fontMinus: '글자 작게' },
    eu: { a11y: 'Irisgarritasuna', lightMode: 'Argi modua', darkMode: 'Ilun modua', grayscale: 'Gris-eskala', highContrast: 'Kontraste altua', invert: 'Koloreak alderantzikatu', underline: 'Estekak azpimarratu', readable: 'Letra irakurgarria', reset: 'Berrezarri', fontPlus: 'Letra handiagoa', fontMinus: 'Letra txikiagoa' },
    ca: { a11y: 'Accessibilitat', lightMode: 'Mode clar', darkMode: 'Mode fosc', grayscale: 'Escala de grisos', highContrast: 'Alt contrast', invert: 'Invertir colors', underline: 'Subratllar enllaços', readable: 'Font llegible', reset: 'Restablir', fontPlus: 'Text gran', fontMinus: 'Text petit' },
  };

  const LANG_TITLES = { es: 'Idioma', en: 'Language', de: 'Sprache', fr: 'Langue', it: 'Lingua', pt: 'Idioma', ko: '언어', eu: 'Hizkuntza', ca: 'Idioma' };

  const LANGS_9 = [
    { code: 'es', label: 'ES', native: 'Español' },
    { code: 'en', label: 'EN', native: 'English' },
    { code: 'de', label: 'DE', native: 'Deutsch' },
    { code: 'fr', label: 'FR', native: 'Français' },
    { code: 'it', label: 'IT', native: 'Italiano' },
    { code: 'pt', label: 'PT', native: 'Português' },
    { code: 'ko', label: 'KO', native: '한국어' },
    { code: 'eu', label: 'EU', native: 'Euskara' },
    { code: 'ca', label: 'CA', native: 'Català' },
  ];

  const t = () => LABELS[_lang()] || LABELS.es;

  /* ─── CSS ─── */
  function _injectCSS() {
    const s = document.createElement('style');
    s.textContent = `
      html:not(.ag-ready) body,
      html:not(.ag-ready) body * { transition: none !important; }

      #ag-a11y-toggle {
        position: fixed; left: 0; bottom: 56px;
        width: 46px; height: 46px;
        background: #7B1C1C; color: #fff;
        border: none; border-radius: 0 6px 6px 0;
        display: flex; align-items: center; justify-content: center;
        z-index: 9000; cursor: pointer;
        box-shadow: 2px 2px 16px rgba(0,0,0,.35);
        transition: background .2s;
      }
      #ag-a11y-toggle:hover { background: #9B2C2C; }
      #ag-a11y-toggle:focus-visible { outline: 2px solid #C9A84C; outline-offset: 2px; }

      #ag-a11y-panel {
        position: fixed; left: 0; bottom: 110px;
        background: #1e1c19; color: #FDFAF4;
        border-radius: 0 8px 8px 0;
        box-shadow: 4px 4px 30px rgba(0,0,0,.45);
        z-index: 8999; min-width: 230px;
        max-height: calc(100vh - 130px); overflow-y: auto;
        opacity: 0; pointer-events: none;
        transform: translateY(12px);
        transition: transform .42s cubic-bezier(0.22, 1, 0.36, 1), opacity .32s ease;
        font-family: 'DM Sans', sans-serif;
      }
      #ag-a11y-panel.is-open { opacity: 1; pointer-events: auto; transform: translateY(0); }

      .ag-panel__header {
        display: flex; align-items: center; justify-content: space-between;
        padding: 13px 16px 11px;
        font-size: .7rem; font-weight: 600; letter-spacing: .1em; text-transform: uppercase;
        color: rgba(253,250,244,.4);
        border-bottom: 1px solid rgba(255,255,255,.08);
      }
      #ag-a11y-close, #ag-lang-close {
        background: none; border: none; color: rgba(201,168,76,.55);
        cursor: pointer; padding: 2px; display: flex; align-items: center;
        transition: color .15s;
      }
      #ag-a11y-close:hover, #ag-lang-close:hover { color: #C9A84C; }

      .ag-panel__list { list-style: none; padding: 5px 0; }
      .ag-divider { height: 1px; background: rgba(255,255,255,.08); margin: 4px 0; }

      .ag-option {
        display: flex; align-items: center; gap: 10px;
        width: 100%; padding: 8px 16px;
        font-size: .82rem; color: #FDFAF4;
        background: none; border: none; text-align: left;
        cursor: pointer; font-family: 'DM Sans', sans-serif;
        transition: background .15s, color .15s;
      }
      .ag-option:hover { background: rgba(201,168,76,.12); color: #DFC070; }
      .ag-option.is-active { color: #C9A84C; font-weight: 500; }
      .ag-option svg { flex-shrink: 0; opacity: .5; }
      .ag-option:hover svg, .ag-option.is-active svg { opacity: 1; }
      .ag-font-label { font-weight: 700; font-size: .95rem; flex-shrink: 0; width: 16px; line-height: 1; }

      body.light-mode #ag-a11y-panel { background: #EDE6D6; color: #141210; }
      body.light-mode .ag-option { color: #141210; }
      body.light-mode .ag-panel__header { color: rgba(20,18,16,.4); border-color: rgba(0,0,0,.08); }
      body.light-mode .ag-divider { background: rgba(0,0,0,.08); }
      body.light-mode #ag-a11y-close { color: rgba(20,18,16,.35); }
      body.light-mode #ag-a11y-close:hover { color: #141210; }

      body.a11y-grayscale::before {
        content: ''; position: fixed; inset: 0; z-index: 8996;
        backdrop-filter: grayscale(1); -webkit-backdrop-filter: grayscale(1);
        pointer-events: none;
      }
      body.a11y-underline-links a { text-decoration: underline !important; text-underline-offset: 3px; }
      body.a11y-readable-font, body.a11y-readable-font * {
        font-family: Arial, Verdana, 'Helvetica Neue', sans-serif !important;
        letter-spacing: .02em; word-spacing: .05em; line-height: 1.65;
      }
      body.a11y-high-contrast {
        --carbon: #000 !important; --white: #fff !important;
        --cream: #fff !important; --cream-d: #e8e8e8 !important;
        --gold: #ffff00 !important; --gold-lt: #ffff00 !important; --gold-dk: #e6e600 !important;
      }
      body.a11y-high-contrast { background: #000 !important; color: #fff !important; }

      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after { transition: none !important; animation: none !important; }
      }

      /* ── Topbar (lang selector + hamburger) ── */
      #ag-topbar {
        position: fixed; top: 1.1rem; right: 1.2rem;
        display: flex; align-items: center; gap: .2rem;
        z-index: 9001;
      }
      #ag-lang-btn {
        height: 34px; padding: 0 .6rem;
        background: transparent;
        border: 1px solid rgba(201,168,76,.22); border-radius: 4px;
        font-family: 'DM Sans', sans-serif;
        font-size: .6rem; font-weight: 500; letter-spacing: .14em; text-transform: uppercase;
        color: rgba(201,168,76,.78);
        cursor: pointer; display: flex; align-items: center;
        transition: color .2s, border-color .2s;
        -webkit-tap-highlight-color: transparent;
      }
      #ag-lang-btn:hover { color: #C9A84C; border-color: rgba(201,168,76,.5); }
      #ag-lang-btn:focus-visible { outline: 2px solid #C9A84C; outline-offset: 2px; }
      body.light-mode #ag-lang-btn { color: rgba(168,133,46,.82); border-color: rgba(168,133,46,.28); }
      body.light-mode #ag-lang-btn:hover { color: #A8852E; border-color: rgba(168,133,46,.55); }

      #ag-hamburger {
        width: 40px; height: 34px;
        background: transparent; border: none;
        display: none; align-items: center; justify-content: center;
        cursor: pointer; color: rgba(201,168,76,.78);
        transition: color .2s; -webkit-tap-highlight-color: transparent;
      }
      #ag-hamburger:hover { color: #C9A84C; }
      #ag-hamburger:focus-visible { outline: 2px solid #C9A84C; outline-offset: 2px; border-radius: 2px; }
      body.light-mode #ag-hamburger { color: rgba(168,133,46,.82); }
      body.light-mode #ag-hamburger:hover { color: #A8852E; }

      /* ── Lang panel ── */
      #ag-lang-panel {
        position: fixed; right: 0; top: 0;
        background: #1e1c19; color: #FDFAF4;
        border-radius: 0 0 0 10px;
        box-shadow: -4px 4px 30px rgba(0,0,0,.5);
        z-index: 8998; min-width: 215px;
        max-height: 100vh; overflow-y: auto;
        opacity: 0; pointer-events: none;
        transform: translateX(110%);
        transition: transform .42s cubic-bezier(0.22, 1, 0.36, 1), opacity .32s ease;
        font-family: 'DM Sans', sans-serif;
      }
      #ag-lang-panel.is-open { opacity: 1; pointer-events: auto; transform: translateX(0); }
      body.light-mode #ag-lang-panel { background: #EDE6D6; color: #141210; }

      .ag-lang-grid {
        display: grid; grid-template-columns: repeat(3, 1fr);
        gap: .35rem; padding: .75rem;
      }
      .ag-lang-opt {
        display: flex; flex-direction: column; align-items: center; gap: .28rem;
        padding: .6rem .25rem;
        font-size: .63rem; font-weight: 500; letter-spacing: .1em; text-transform: uppercase;
        color: rgba(253,250,244,.72);
        background: none; border: 1px solid rgba(255,255,255,.1);
        border-radius: 4px; cursor: pointer;
        transition: background .15s, border-color .15s, color .15s;
        -webkit-tap-highlight-color: transparent;
      }
      .ag-lang-nat {
        font-style: italic; font-size: .59rem; letter-spacing: 0;
        text-transform: none; font-weight: 300; opacity: .75;
      }
      .ag-lang-opt:hover { background: rgba(201,168,76,.12); border-color: rgba(201,168,76,.38); color: #DFC070; }
      .ag-lang-opt.is-current { border-color: rgba(201,168,76,.58); color: #C9A84C; background: rgba(201,168,76,.07); }
      body.light-mode .ag-lang-opt { color: rgba(20,18,16,.72); border-color: rgba(20,18,16,.12); }
      body.light-mode .ag-lang-opt:hover { background: rgba(201,168,76,.1); border-color: rgba(168,133,46,.42); color: #7B5E1A; }
      body.light-mode .ag-lang-opt.is-current { border-color: rgba(168,133,46,.58); color: #A8852E; background: rgba(201,168,76,.08); }

      @media (min-width: 641px) {
        #ag-lang-panel { top: 3.4rem; }
      }

      @media (max-width: 640px) {
        #ag-a11y-toggle { display: none !important; }
        #ag-hamburger { display: flex; }
        #ag-a11y-panel {
          left: 0; right: 0; bottom: 0; top: auto;
          border-radius: 14px 14px 0 0; min-width: 0;
          max-height: 75vh;
          transform: translateY(110%);
        }
        #ag-a11y-panel.is-open { transform: translateY(0); }
        #ag-lang-panel {
          left: 0; right: 0; bottom: 0; top: auto;
          border-radius: 14px 14px 0 0; min-width: 0;
          max-height: 72vh; overflow-y: auto;
          transform: translateY(110%);
        }
        #ag-lang-panel.is-open { transform: translateY(0); }
      }
    `;
    document.head.appendChild(s);
  }

  /* ─── HTML injection ─── */
  function _inject() {
    const lbl = t();
    const isLight = document.body.classList.contains('light-mode');

    /* Invert overlay */
    if (!document.getElementById('ag-invert-layer')) {
      const inv = document.createElement('div');
      inv.id = 'ag-invert-layer';
      inv.style.cssText = 'display:none;position:fixed;inset:0;backdrop-filter:invert(1);-webkit-backdrop-filter:invert(1);pointer-events:none;z-index:8994';
      document.body.appendChild(inv);
    }

    /* Topbar: lang selector + hamburger */
    const topbar = document.createElement('div');
    topbar.id = 'ag-topbar';
    topbar.innerHTML = `
      <button id="ag-lang-btn" aria-haspopup="dialog" aria-expanded="false" aria-label="${LANG_TITLES[_lang()] || 'Idioma'}">${(_lang()).toUpperCase()}</button>
      <button id="ag-hamburger" aria-label="${lbl.a11y}" aria-expanded="false" aria-haspopup="dialog">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>`;
    document.body.appendChild(topbar);

    /* Lang panel */
    const langPanel = document.createElement('div');
    langPanel.id = 'ag-lang-panel';
    langPanel.setAttribute('role', 'dialog');
    langPanel.setAttribute('aria-modal', 'false');
    langPanel.setAttribute('aria-label', LANG_TITLES[_lang()] || 'Idioma');
    const curLang = _lang();
    langPanel.innerHTML = `
      <div class="ag-panel__header">
        <span>${LANG_TITLES[curLang] || 'Idioma'}</span>
        <button id="ag-lang-close" aria-label="Cerrar">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="ag-lang-grid">
        ${LANGS_9.map(l => `
          <button class="ag-lang-opt${l.code === curLang ? ' is-current' : ''}" data-lang="${l.code}">
            <span>${l.label}</span>
            <span class="ag-lang-nat">${l.native}</span>
          </button>`).join('')}
      </div>`;
    document.body.appendChild(langPanel);

    /* A11y toggle button */
    const btn = document.createElement('button');
    btn.id = 'ag-a11y-toggle';
    btn.setAttribute('aria-label', lbl.a11y);
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-haspopup', 'dialog');
    btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="4.5" r="1.5"/><path d="M7 9h10M12 9v12M9 21l3-5 3 5"/></svg>`;
    document.body.appendChild(btn);

    /* A11y panel */
    const panel = document.createElement('div');
    panel.id = 'ag-a11y-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'false');
    panel.setAttribute('aria-label', lbl.a11y);
    panel.innerHTML = `
      <div class="ag-panel__header">
        <span>${lbl.a11y}</span>
        <button id="ag-a11y-close" aria-label="Cerrar panel">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <ul class="ag-panel__list">
        <li><button class="ag-option${isLight ? ' is-active' : ''}" id="ag-light-mode" aria-pressed="${isLight}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
          <span id="ag-light-mode-label">${isLight ? lbl.darkMode : lbl.lightMode}</span>
        </button></li>
        <li class="ag-divider"></li>
        <li><button class="ag-option" id="ag-font-plus" aria-label="${lbl.fontPlus}">
          <span class="ag-font-label" aria-hidden="true">A+</span>
          <span>${lbl.fontPlus}</span>
        </button></li>
        <li><button class="ag-option" id="ag-font-minus" aria-label="${lbl.fontMinus}">
          <span class="ag-font-label" aria-hidden="true">A−</span>
          <span>${lbl.fontMinus}</span>
        </button></li>
        <li class="ag-divider"></li>
        <li><button class="ag-option" id="ag-grayscale" aria-pressed="false">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 3v18"/></svg>
          <span>${lbl.grayscale}</span>
        </button></li>
        <li><button class="ag-option" id="ag-high-contrast" aria-pressed="false">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/></svg>
          <span>${lbl.highContrast}</span>
        </button></li>
        <li><button class="ag-option" id="ag-invert" aria-pressed="false">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 2L2 22h20z"/><path d="M12 6v12" stroke-width="1.4"/></svg>
          <span>${lbl.invert}</span>
        </button></li>
        <li><button class="ag-option" id="ag-readable" aria-pressed="false">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h10"/></svg>
          <span>${lbl.readable}</span>
        </button></li>
        <li><button class="ag-option" id="ag-underline" aria-pressed="false">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M6 3v7a6 6 0 0 0 12 0V3M4 21h16"/></svg>
          <span>${lbl.underline}</span>
        </button></li>
        <li class="ag-divider"></li>
        <li><button class="ag-option" id="ag-reset">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          <span>${lbl.reset}</span>
        </button></li>
      </ul>`;
    document.body.appendChild(panel);
  }

  /* ─── State ─── */
  let textLevel = parseInt(localStorage.getItem('a11y-text') || '0', 10);

  function _setTextLevel(n) {
    textLevel = Math.max(-2, Math.min(3, n));
    document.documentElement.style.fontSize = textLevel === 0 ? '' : (16 + textLevel * 2) + 'px';
    if (textLevel === 0) localStorage.removeItem('a11y-text');
    else localStorage.setItem('a11y-text', textLevel);
  }

  function _openLangPanel() {
    document.getElementById('ag-lang-panel')?.classList.add('is-open');
    document.getElementById('ag-lang-btn')?.setAttribute('aria-expanded', 'true');
    document.getElementById('ag-lang-close')?.focus();
  }

  function _closeLangPanel() {
    document.getElementById('ag-lang-panel')?.classList.remove('is-open');
    document.getElementById('ag-lang-btn')?.setAttribute('aria-expanded', 'false');
    document.getElementById('ag-lang-btn')?.focus();
  }

  function _selectLang(code) {
    localStorage.setItem('cat-lang', code);
    _closeLangPanel();
    /* If on qr-playlist, update the lang URL param */
    const params = new URLSearchParams(location.search);
    if (params.has('lang')) {
      params.set('lang', code);
      location.href = location.pathname + '?' + params.toString();
    } else {
      location.reload();
    }
  }

  function _applyLightMode(on) {
    document.body.classList.toggle('light-mode', on);
    const lbl = t();
    const btn = document.getElementById('ag-light-mode');
    const label = document.getElementById('ag-light-mode-label');
    if (label) label.textContent = on ? lbl.darkMode : lbl.lightMode;
    if (btn) { btn.setAttribute('aria-pressed', String(on)); btn.classList.toggle('is-active', on); }
    /* Store '1' for light, '0' for dark (null = uninitialised → default light) */
    localStorage.setItem('a11y-light-mode', on ? '1' : '0');
  }

  function _applyGrayscale(on) {
    document.body.classList.toggle('a11y-grayscale', on);
    const btn = document.getElementById('ag-grayscale');
    if (btn) { btn.setAttribute('aria-pressed', String(on)); btn.classList.toggle('is-active', on); }
    if (on) localStorage.setItem('a11y-grayscale', '1');
    else localStorage.removeItem('a11y-grayscale');
  }

  function _applyHighContrast(on) {
    document.body.classList.toggle('a11y-high-contrast', on);
    const btn = document.getElementById('ag-high-contrast');
    if (btn) { btn.setAttribute('aria-pressed', String(on)); btn.classList.toggle('is-active', on); }
    if (on) localStorage.setItem('a11y-high-contrast', '1');
    else localStorage.removeItem('a11y-high-contrast');
  }

  function _applyInvert(on) {
    const layer = document.getElementById('ag-invert-layer');
    if (layer) layer.style.display = on ? 'block' : 'none';
    const btn = document.getElementById('ag-invert');
    if (btn) { btn.setAttribute('aria-pressed', String(on)); btn.classList.toggle('is-active', on); }
    if (on) localStorage.setItem('a11y-invert', '1');
    else localStorage.removeItem('a11y-invert');
  }

  function _applyReadable(on) {
    document.body.classList.toggle('a11y-readable-font', on);
    const btn = document.getElementById('ag-readable');
    if (btn) { btn.setAttribute('aria-pressed', String(on)); btn.classList.toggle('is-active', on); }
    if (on) localStorage.setItem('a11y-readable-font', '1');
    else localStorage.removeItem('a11y-readable-font');
  }

  function _applyUnderline(on) {
    document.body.classList.toggle('a11y-underline-links', on);
    const btn = document.getElementById('ag-underline');
    if (btn) { btn.setAttribute('aria-pressed', String(on)); btn.classList.toggle('is-active', on); }
    if (on) localStorage.setItem('a11y-underline-links', '1');
    else localStorage.removeItem('a11y-underline-links');
  }

  function _reset() {
    _applyLightMode(false); _applyGrayscale(false); _applyHighContrast(false);
    _applyInvert(false); _applyReadable(false); _applyUnderline(false); _setTextLevel(0);
  }

  /* ─── Restore ─── */
  function _restore() {
    /* Light mode is the default for audioguide pages; only go dark if user explicitly chose it */
    const savedMode = localStorage.getItem('a11y-light-mode');
    _applyLightMode(savedMode !== '0');
    if (localStorage.getItem('a11y-grayscale') === '1') _applyGrayscale(true);
    if (localStorage.getItem('a11y-high-contrast') === '1') _applyHighContrast(true);
    if (localStorage.getItem('a11y-invert') === '1') _applyInvert(true);
    if (localStorage.getItem('a11y-readable-font') === '1') _applyReadable(true);
    if (localStorage.getItem('a11y-underline-links') === '1') _applyUnderline(true);
    if (textLevel !== 0) _setTextLevel(textLevel);
  }

  /* ─── Panel toggle ─── */
  function _openPanel() {
    const panel = document.getElementById('ag-a11y-panel');
    const toggle = document.getElementById('ag-a11y-toggle');
    const hamburger = document.getElementById('ag-hamburger');
    panel.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    hamburger?.setAttribute('aria-expanded', 'true');
    document.getElementById('ag-a11y-close')?.focus();
  }

  function _closePanel() {
    const panel = document.getElementById('ag-a11y-panel');
    const toggle = document.getElementById('ag-a11y-toggle');
    const hamburger = document.getElementById('ag-hamburger');
    panel.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    hamburger?.setAttribute('aria-expanded', 'false');
    (window.innerWidth <= 640 ? hamburger : toggle)?.focus();
  }

  /* ─── Events ─── */
  function _setupEvents() {
    const _togglePanel = () =>
      document.getElementById('ag-a11y-panel')?.classList.contains('is-open') ? _closePanel() : _openPanel();
    document.getElementById('ag-a11y-toggle')?.addEventListener('click', _togglePanel);
    document.getElementById('ag-hamburger')?.addEventListener('click', _togglePanel);
    document.getElementById('ag-a11y-close')?.addEventListener('click', _closePanel);

    document.getElementById('ag-light-mode')?.addEventListener('click', () =>
      _applyLightMode(!document.body.classList.contains('light-mode')));
    document.getElementById('ag-font-plus')?.addEventListener('click', () => _setTextLevel(textLevel + 1));
    document.getElementById('ag-font-minus')?.addEventListener('click', () => _setTextLevel(textLevel - 1));
    document.getElementById('ag-grayscale')?.addEventListener('click', () =>
      _applyGrayscale(!document.body.classList.contains('a11y-grayscale')));
    document.getElementById('ag-high-contrast')?.addEventListener('click', () =>
      _applyHighContrast(!document.body.classList.contains('a11y-high-contrast')));
    document.getElementById('ag-invert')?.addEventListener('click', () => {
      const layer = document.getElementById('ag-invert-layer');
      _applyInvert(!layer || layer.style.display === 'none');
    });
    document.getElementById('ag-readable')?.addEventListener('click', () =>
      _applyReadable(!document.body.classList.contains('a11y-readable-font')));
    document.getElementById('ag-underline')?.addEventListener('click', () =>
      _applyUnderline(!document.body.classList.contains('a11y-underline-links')));
    document.getElementById('ag-reset')?.addEventListener('click', _reset);

    document.getElementById('ag-lang-btn')?.addEventListener('click', () =>
      document.getElementById('ag-lang-panel')?.classList.contains('is-open') ? _closeLangPanel() : _openLangPanel());
    document.getElementById('ag-lang-close')?.addEventListener('click', _closeLangPanel);
    document.querySelectorAll('.ag-lang-opt').forEach(btn =>
      btn.addEventListener('click', () => _selectLang(btn.dataset.lang)));

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        if (document.getElementById('ag-a11y-panel')?.classList.contains('is-open')) _closePanel();
        if (document.getElementById('ag-lang-panel')?.classList.contains('is-open')) _closeLangPanel();
      }
    });
  }

  /* ─── Init ─── */
  function _init() {
    _injectCSS();
    _inject();
    _restore();
    _setupEvents();
    requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.classList.add('ag-ready')));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', _init);
  else _init();
})();
