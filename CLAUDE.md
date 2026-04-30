# Catedral de Santo Domingo de la Calzada — Contexto del proyecto

## Stack y restricciones
- **Vanilla HTML + CSS + JS puro.** Sin frameworks, sin bundler, sin npm.
- Los assets compartidos están en `/assets/` y se incluyen con `<link>` / `<script>` directamente.
- No añadir dependencias externas sin consultar.

## Estructura de archivos clave

```
/
├── CLAUDE.md                        ← este fichero
├── index.html                       ← página principal (Home)
├── monumentos/
│   └── catedral.html
├── reservas/
│   └── reservas.html
├── assets/
│   ├── shared.css                   ← estilos globales (tokens, navbar, footer, a11y…)
│   ├── shared.js                    ← JS global (cursor, navbar, i18n, accesibilidad…)
│   └── _shared-fragments.html      ← plantilla de referencia (NO se incluye como fichero,
│                                      se copia a mano en cada página nueva)
└── newsletter-apps-script.js
```

## Cómo añadir una página nueva
1. Copiar el bloque `<head>` de `_shared-fragments.html`.
2. Pegar cursor + widget de accesibilidad + navbar + side-menu al inicio del `<body>`.
3. Pegar el footer al final del `<body>`.
4. Incluir `shared.css` y `shared.js`.
5. **IMPORTANTE:** el panel de accesibilidad se copia íntegro en cada página — no se carga dinámicamente. Si se añade un nuevo botón al panel hay que hacerlo en TODOS los HTML (index.html, monumentos/catedral.html, reservas/reservas.html…) además de en `_shared-fragments.html`.

## Sistema de i18n
- Objeto global `SHARED_T` en `shared.js` con 9 idiomas: `es, en, fr, de, pt, it, ko, eu, ca`.
- Cada clave nueva de accesibilidad sigue el patrón `a11y_nombre_clave`.
- Las páginas pueden ampliar con `window.PAGE_applyLang(lang, t)`.
- El idioma activo se guarda en `localStorage` bajo la clave `cat-lang`.

## Widget de accesibilidad (`initA11y`)
Implementado en `shared.js` (~línea 662). Funciones principales:

| Función | Descripción |
|---|---|
| `_a11yApplyText(level)` | Tamaño de texto (−2 a +3) |
| `_a11yApplyMagnifier(on)` | **Lupa** — clon del DOM a 2× que sigue el cursor |
| `_a11yApplyGrayscale(on)` | Escala de grises |
| `_a11yApplyHighContrast(on)` | Alto contraste |
| `_a11yApplyInvert(on)` | Invertir colores |
| `_a11yApplyUnderlineLinks(on)` | Subrayar enlaces |
| `_a11yApplyReadableFont(on)` | Fuente legible (Arial/Verdana) |
| `_a11yToggleReader()` | Lector de texto (Web Speech API) |
| `_a11yReset()` | Restablecer todo |

### Lupa (`_a11yApplyMagnifier`)
- Clona `document.body` en el momento de activación (snapshot del estado actual).
- El clon se escala 2× con `transform: scale(2); transform-origin: 0 0`.
- Posición del clon: `left = RADIUS − ZOOM*(scrollX+x)`, `top = RADIUS − ZOOM*(scrollY+y)`.
- La lente (`#a11y-magnifier-lens`) es un div circular de 200 px con `overflow:hidden`.
- Listener de scroll sincronizado para que funcione al hacer scroll sin mover el ratón.
- Guard: `if (window.frameElement) return;` evita recursión si el clon ejecuta JS.

## Persistencia de estado
Todas las opciones de accesibilidad se guardan en `localStorage`:
`a11y-text`, `a11y-grayscale`, `a11y-high-contrast`, `a11y-invert`,
`a11y-underline-links`, `a11y-readable-font`, `a11y-magnifier`.

## CSS — tokens principales
```css
--cream: #F5F0E8   --carbon: #141210   --gold: #C9A84C
--serif: 'Cormorant Garamond'          --sans: 'DM Sans'
--ease: cubic-bezier(0.16, 1, 0.3, 1)
```
Color corporativo accesibilidad: `#7B1C1C` (rojo oscuro).

## Patrones CSS de accesibilidad
- `.a11y-option.is-active` — estado activo del botón.
- `#a11y-magnifier-lens` — lente circular 200 px, `overflow:hidden`, `border-radius:50%`.
- `#a11y-magnifier-clone` — clon del body, `transform:scale(2)`, `transform-origin:0 0`.
- `#a11y-invert-layer` — div superpuesto para invertir colores.
- `.a11y-reading` — clase en body durante lectura de texto.

## Convenciones de código
- Sin comentarios salvo que el WHY sea no obvio.
- Sin abstracciones prematuras — copiar antes que sobre-generalizar.
- Cada función de accesibilidad sigue el mismo patrón:
  `toggle clase en body + localStorage + aria-pressed en el botón`.
