# Catedral de Santo Domingo de la Calzada — Contexto del proyecto

## Stack y restricciones
- **Vanilla HTML + CSS + JS puro.** Sin frameworks, sin bundler, sin npm.
- Assets compartidos en `/assets/`, incluidos con `<link>` / `<script>` directamente.
- No añadir dependencias externas sin consultar.
- Librería externa activa: `qrcode.min.js` (CDN, solo en `reservas.html`).

---

## Estructura de archivos

```
/
├── CLAUDE.md
├── index.html                        ← Home (hero fullscreen, navbar transparente)
├── institucion.html                  ← Historia e institución
├── monumentos.html                   ← Listado de monumentos
├── monumentos/
│   ├── catedral.html
│   ├── ermitaplaza.html
│   ├── monasteriocanas.html
│   ├── sanfrancisco.html
│   └── torre.html
├── visitas.html                      ← Hub de tipos de visita
├── visitas/
│   ├── individuales.html
│   ├── grupos.html
│   ├── guiadas.html
│   ├── escolares.html
│   └── pulsera.html
├── actualidad.html                   ← Noticias / agenda
├── reservas.html                     ← Wizard de reservas (5 pasos)
├── legal/
│   ├── aviso-legal.html
│   ├── privacidad.html
│   ├── cookies.html
│   └── accesibilidad.html
├── assets/
│   ├── shared.css                    ← Estilos globales (tokens, navbar, footer, a11y…)
│   ├── shared.js                     ← JS global (cursor, navbar, i18n, accesibilidad…)
│   └── _shared-fragments.html        ← Plantilla de referencia (NO se incluye como fichero;
│                                        se copia a mano en cada página nueva)
└── newsletter-apps-script.js
```

---

## Diseño — Sistema de tokens CSS

Definidos en `shared.css` (`:root`) y replicados localmente en `reservas.html`.

### Paleta de colores

| Token | Valor | Uso |
|---|---|---|
| `--cream` | `#F5F0E8` | Fondo de cards, paneles en modo claro |
| `--cream-d` | `#EDE6D6` | Cream más oscuro, hover / active |
| `--stone` | `#8C8070` | Texto secundario sobre fondos oscuros |
| `--stone-lt` | `#BEB5A8` | Texto muy secundario, labels desactivados |
| `--carbon` | `#141210` | Fondo global dark / texto principal light |
| `--white` | `#FDFAF4` | Texto principal sobre fondos oscuros |
| `--gold` | `#C9A84C` | Acento dorado principal (CTAs, bordes activos) |
| `--gold-lt` | `#DFC070` | Gold hover |
| `--gold-dk` | `#A8852E` | Gold pressed / texto dorado sobre claro |

**Color corporativo de accesibilidad:** `#7B1C1C` (rojo oscuro — botón y panel a11y).

---

### Modo oscuro (dark — estado por defecto en `shared.css`)

`body` por defecto: `background: #141210`, `color: #FDFAF4`.

| Elemento | Color |
|---|---|
| Body / fondo global | `#141210` |
| Paneles / `.form-panel` | `#1a1610` |
| Inputs / selects / textarea | `#1a1610` |
| Inputs en focus | `#221c12` |
| Sub-superficies (indicadores, fondos anidados) | `#0c0a08` |
| Bordes sutiles | `rgba(255,255,255,.12)` |
| Bordes dorados | `rgba(201,168,76,.15)` |
| Texto primario | `#FDFAF4` |
| Labels de campo | `rgba(245,240,232,.78)` |
| Subtítulos de panel | `rgba(245,240,232,.62)` |
| Texto terciario / leyendas | `rgba(245,240,232,.55)` |
| Helpers de campo | `rgba(245,240,232,.58)` |
| Helper warning | `#e89a72` |
| Mensaje de error | `#e0857a` |
| Eyebrow page-hero | `rgba(201,168,76,.75)` |

El selector dark mode es `body:not(.light-mode)` — no requiere clase extra, es el estado base.

---

### Modo claro (light — clase `body.light-mode`)

Se activa vía widget de accesibilidad (toggle). En `reservas.html` el wizard arranca ya en modo claro por diseño.

| Elemento | Color |
|---|---|
| Body | `#F9F8F6` + noise SVG sutil (`.028` opacity) |
| Paneles / `.form-panel` | `#F5F0E8` con borde `rgba(201,168,76,.2)` |
| Texto principal | `#141210` |
| Labels de campo | `#4a4035` |
| Texto secundario | `#8C8070` |
| Helpers de campo | `#6e6356` (ratio WCAG 4.87:1 sobre cream) |
| Navbar | `rgba(245,240,232,.97)` con blur |

---

## Tipografía y jerarquía

### Fuentes
| Rol | Familia | Pesos cargados |
|---|---|---|
| **Serif** — títulos, display, logo | `Cormorant Garamond`, Georgia fallback | 300, 400, 500, 600 + italic |
| **Sans** — cuerpo, UI, labels | `DM Sans`, sans-serif fallback | 300, 400, 500 |

Variables CSS: `--serif` y `--sans`.

### Escala tipográfica

| Nivel | Selector / contexto | Fuente | Tamaño | Peso | Notas |
|---|---|---|---|---|---|
| Display hero | `.page-hero__title` | serif | `clamp(2rem, 5vw, 3.2rem)` | 300 | `em` italic en `--gold-dk` |
| Título de sección | `.panel-title` | serif | `1.55rem` | 400 | |
| Eyebrow | `.page-hero__eyebrow` | sans | `.68rem` | 400 | uppercase, `letter-spacing: .22em` |
| Título de card | `.tipo-visita-row__title` | sans | `1rem` | 500 | |
| Subtítulo panel | `.panel-subtitle` | sans | `.85rem` | 400 | |
| Cuerpo | `body` / `p` | sans | `15px` | 400 | `line-height: 1.65` |
| Descripción card | `.tipo-visita-row__desc` | sans | `.79rem` | 400 | |
| Label campo | `label` | sans | `.78rem` | 500 | uppercase, `letter-spacing: .1em` |
| Helper / nota | `.field-helper` | sans | `.74rem` | 400 | |
| Botón CTA | `.btn--primary` | sans | `.78rem` | 500 | uppercase, `letter-spacing: .12em` |
| Logo navbar | `.navbar__logo-name` | serif | `1rem` | 500 | `letter-spacing: .06em` |
| Sub logo navbar | `.navbar__logo-sub` | sans | `.68rem` | 400 | uppercase, `letter-spacing: .18em`, gold |

---

## Modos de página

| Tipo | Navbar | Fondo body | Ejemplo |
|---|---|---|---|
| **Hero fullscreen** | `navbar--transparent` → solid al scroll | `#141210` oscuro | `index.html` |
| **Interior estándar** | `navbar--always-solid` | `#141210` oscuro | `monumentos/catedral.html` |
| **Wizard / formulario** | `navbar--always-solid` con override claro | `#F9F8F6` claro | `reservas.html` |

---

## Cómo añadir una página nueva
1. Copiar el bloque `<head>` de `_shared-fragments.html`.
2. Pegar cursor + widget de accesibilidad + navbar + side-menu al inicio del `<body>`.
3. Pegar el footer al final del `<body>`.
4. Incluir `shared.css` y `shared.js`.
5. **IMPORTANTE:** el panel de accesibilidad se copia íntegro en cada página — no se carga dinámicamente. Si se añade un nuevo botón hay que replicarlo en **todos** los HTML + `_shared-fragments.html`.

---

## Sistema de i18n
- Objeto global `SHARED_T` en `shared.js` con 9 idiomas: `es, en, fr, de, pt, it, ko, eu, ca`.
- Cada clave nueva de accesibilidad sigue el patrón `a11y_nombre_clave`.
- Las páginas pueden ampliar con `window.PAGE_applyLang(lang, t)`.
- El idioma activo se guarda en `localStorage` bajo la clave `cat-lang`.

---

## Widget de accesibilidad (`initA11y`)
Implementado en `shared.js` (~línea 662). Color corporativo del panel: `#7B1C1C`.

| Función | Descripción |
|---|---|
| `_a11yApplyText(level)` | Tamaño de texto (−2 a +3) |
| `_a11yApplyMagnifier(on)` | Lupa — clon del DOM a 2× que sigue el cursor |
| `_a11yApplyGrayscale(on)` | Escala de grises |
| `_a11yApplyHighContrast(on)` | Alto contraste |
| `_a11yApplyInvert(on)` | Invertir colores |
| `_a11yApplyUnderlineLinks(on)` | Subrayar enlaces |
| `_a11yApplyReadableFont(on)` | Fuente legible (Arial/Verdana) |
| `_a11yToggleReader()` | Lector de texto (Web Speech API) |
| `_a11yReset()` | Restablecer todo |

### Lupa (`_a11yApplyMagnifier`)
- Clona `document.body` en el momento de activación (snapshot del estado actual).
- Escala 2× con `transform: scale(2); transform-origin: 0 0`.
- Posición: `left = RADIUS − ZOOM*(scrollX+x)`, `top = RADIUS − ZOOM*(scrollY+y)`.
- Lente `#a11y-magnifier-lens`: div circular 200 px, `overflow:hidden`, `border-radius:50%`.
- Listener de scroll sincronizado para que funcione sin mover el ratón.
- Guard: `if (window.frameElement) return;` evita recursión si el clon ejecuta JS.

### Persistencia (localStorage)
`a11y-text`, `a11y-grayscale`, `a11y-high-contrast`, `a11y-invert`,
`a11y-underline-links`, `a11y-readable-font`, `a11y-magnifier`.

### Patrones CSS de accesibilidad
- `.a11y-option.is-active` — estado activo del botón.
- `#a11y-magnifier-clone` — clon del body, `transform:scale(2)`, `transform-origin:0 0`.
- `#a11y-invert-layer` — div superpuesto para invertir colores.
- `.a11y-reading` — clase en body durante lectura de texto.

---

## Reservas (`reservas.html`) — Wizard de 5 pasos

### Pasos
| Paso | Contenido |
|---|---|
| 1 | Tipo de visita (individual / grupo / escolar) + modo (libre / guiada) |
| 2 | Fecha + hora + número de personas |
| 3 | Datos de contacto + factura opcional |
| 4 | Captcha + resumen |
| 5 | Confirmación con QR |

### Precios y tarifas

**Individual — visita guiada**
| Tipo de entrada | Adulto | Menor <13 | Residente |
|---|---|---|---|
| Visita Guiada Diurna | 8 € | 4 € | 4 € |
| Visita Guiada VIP | 10 € | 5 € | 5 € |
| Visita Guiada Nocturna Catedral | 10 € | 5 € | 5 € |
| Ticket Familiar | 25 € (plana) | — | — |
| Casco Histórico + Catedral (2 h) | 12 € | 5 € | — |

**Grupo sin guía**
- `pagantes = total − residentes − menores <13`
- `pagantes < 25` → precio fijo 125 €; `≥ 25` → `pagantes × 5 €`.

**Grupo escolar** (precio/alumno; residentes y menores <12 gratis)
| Tramo | Precio |
|---|---|
| Infantil (0-5) | 0 € |
| Primaria (6-11) | 3 € |
| ESO (12-15) | 4 € |
| Bachillerato/FP (16-18) | 5 € |
| Universidad (+18) | 6 € |

### Bloqueo de duración doble
La visita "Casco Histórico + Catedral" ocupa 2 slots horarios. En `_renderGridBotones(horas, inactivas, bloqueadas, fecha, duracionDoble)`:
- Si slot siguiente (idx+1) está ocupado → clase `.bloqueado-dur` (gris, sin tachado, no seleccionable).
- Hover escritorio: resalta `.hover-doble` en slot actual + siguiente.
- Al seleccionar: añade `.selected-sig` al slot siguiente (indicación visual mobile).

### Formateo automático en blur
| Campo | Transformación |
|---|---|
| `nombre`, `nombreCentro`, `calleNumero`, `ciudadFact` | `toTitleCase()` |
| `comentarios` | `toSentenceCase()` |
| `nifCif` | `.toUpperCase()` |
| `telefono` | Strip `+34` si número español válido → 9 dígitos; internacionales se mantienen |

Validación de teléfono: `isTelefonoValido()` — acepta `+34XXXXXXXXX`, `+NNN...` o `[6789]XXXXXXXX`.

### Constantes de precio
```javascript
const PRECIO_GRUPO_MINIMO        = 125;
const PRECIO_GRUPO_POR_PERSONA   = 5;
const PRECIOS                    = { 'Visita Guiada Diurna': 8, 'Visita Guiada VIP': 10, ... };
const PRECIOS_MENOR_GUIADA       = { 'Visita Guiada Diurna': 4, 'Visita Guiada VIP': 5, ... };
const PRECIOS_RESIDENTE_GUIADA   = { 'Visita Guiada Diurna': 4, 'Visita Guiada VIP': 5, ... };
```

---

## Animaciones y transiciones

| Token / uso | Valor |
|---|---|
| `--ease` (cursor, reveals) | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `--transition` (UI reservas) | `340ms cubic-bezier(.4,0,.2,1)` |
| Bounce check tipo-visita | `cubic-bezier(.34,1.56,.64,1)` |

---

## Convenciones de código
- Sin comentarios salvo que el WHY sea no obvio.
- Sin abstracciones prematuras — copiar antes que sobre-generalizar.
- El panel de accesibilidad se copia íntegro en cada página (nunca dinámico).
- Cada función de accesibilidad sigue el patrón: `toggle clase en body + localStorage + aria-pressed en botón`.
- **Dark mode:** selector `body:not(.light-mode)` — el dark es el estado por defecto en `shared.css`.
- **Light mode:** clase `body.light-mode` — el wizard de reservas arranca en light por defecto.
