# Diseño y referencia técnica — Catedral SDC

## Estructura completa de archivos
```
/
├── index.html                 ← Home (hero fullscreen, navbar transparente)
├── institucion.html
├── monumentos.html
├── monumentos/catedral.html, ermitaplaza.html, monasteriocanas.html, sanfrancisco.html, torre.html
├── visitas.html
├── visitas/individuales.html, grupos.html, guiadas.html, escolares.html, pulsera.html
├── actualidad.html
├── reservas.html              ← Wizard 5 pasos
├── legal/aviso-legal.html, privacidad.html, cookies.html, accesibilidad.html
├── assets/shared.css, shared.js, _shared-fragments.html
└── newsletter-apps-script.js
```

## Tokens CSS (shared.css)
```css
--cream: #F5F0E8    --cream-d: #EDE6D6
--stone: #8C8070    --stone-lt: #BEB5A8
--carbon: #141210   --white: #FDFAF4
--gold: #C9A84C     --gold-lt: #DFC070    --gold-dk: #A8852E
--serif: 'Cormorant Garamond', Georgia, serif
--sans: 'DM Sans', sans-serif
--ease: cubic-bezier(0.16, 1, 0.3, 1)
--transition: 340ms cubic-bezier(.4,0,.2,1)   /* solo reservas.html */
```
Color a11y: `#7B1C1C`

## Paleta modo oscuro (dark — por defecto)
| Elemento | Color |
|---|---|
| Body | `#141210` |
| Paneles / inputs / textarea | `#1a1610` |
| Input focus | `#221c12` |
| Sub-superficies | `#0c0a08` |
| Bordes sutiles | `rgba(255,255,255,.12)` |
| Bordes dorados | `rgba(201,168,76,.15)` |
| Texto primario | `#FDFAF4` |
| Labels | `rgba(245,240,232,.78)` |
| Subtítulos panel | `rgba(245,240,232,.62)` |
| Texto terciario | `rgba(245,240,232,.55)` |
| Helpers | `rgba(245,240,232,.58)` |
| Helper warning | `#e89a72` |
| Error | `#e0857a` |
| Eyebrow hero | `rgba(201,168,76,.75)` |

## Paleta modo claro (body.light-mode)
| Elemento | Color |
|---|---|
| Body | `#F9F8F6` + noise SVG |
| Paneles | `#F5F0E8` |
| Texto principal | `#141210` |
| Labels | `#4a4035` |
| Helpers | `#6e6356` (4.87:1 WCAG) |
| Navbar | `rgba(245,240,232,.97)` |

## Tipografía — escala
| Nivel | Fuente | Tamaño | Peso |
|---|---|---|---|
| Display hero `.page-hero__title` | serif | `clamp(2rem,5vw,3.2rem)` | 300 |
| Título sección `.panel-title` | serif | `1.55rem` | 400 |
| Eyebrow `.page-hero__eyebrow` | sans | `.68rem` | 400 — uppercase `.22em` |
| Título card | sans | `1rem` | 500 |
| Cuerpo | sans | `15px` | 400 — `line-height:1.65` |
| Label campo | sans | `.78rem` | 500 — uppercase `.1em` |
| Helper | sans | `.74rem` | 400 |
| Botón CTA | sans | `.78rem` | 500 — uppercase `.12em` |
| Logo navbar | serif | `1rem` | 500 |

## Modos de página
| Tipo | Navbar | Fondo |
|---|---|---|
| Hero fullscreen | `navbar--transparent` → solid | `#141210` |
| Interior | `navbar--always-solid` | `#141210` |
| Wizard/formulario | `navbar--always-solid` claro | `#F9F8F6` |

## Animaciones
| Uso | Valor |
|---|---|
| Cursor / reveals | `cubic-bezier(0.16,1,0.3,1)` |
| Transiciones UI reservas | `340ms cubic-bezier(.4,0,.2,1)` |
| Bounce check tipo-visita | `cubic-bezier(.34,1.56,.64,1)` |

---

## Reservas — Wizard (reservas.html)

### Pasos
1. Tipo visita (individual / grupo / escolar) + modo (libre / guiada)
2. Fecha + hora + personas
3. Datos contacto + factura
4. Captcha + resumen
5. Confirmación + QR

### Precios visita guiada individual
| Entrada | Adulto | Menor <13 | Residente |
|---|---|---|---|
| Visita Guiada Diurna | 8 € | 4 € | 4 € |
| Visita Guiada VIP | 10 € | 5 € | 5 € |
| Nocturna Catedral | 10 € | 5 € | 5 € |
| Ticket Familiar | 25 € (plana) | — | — |
| Casco Histórico + Catedral | 12 € | 5 € | — |

### Precios grupo
- `pagantes = total − residentes − menores<13`
- `<25 pagantes` → 125 € fijo; `≥25` → `pagantes × 5 €`

### Precios escolar (por alumno; residentes y menores<12 gratis)
Infantil 0 € · Primaria 3 € · ESO 4 € · Bach/FP 5 € · Universidad 6 €

### Lógica duración doble (Casco Histórico + Catedral)
`_renderGridBotones(horas, inactivas, bloqueadas, fecha, duracionDoble=true)`
- Slot sin siguiente libre → `.bloqueado-dur` (gris, no seleccionable)
- Hover: `.hover-doble` en slot + siguiente
- Selección: `.selected-sig` en slot siguiente

### Formateo blur
| Campo | Regla |
|---|---|
| nombre, nombreCentro, calleNumero, ciudadFact | `toTitleCase()` |
| comentarios | `toSentenceCase()` |
| nifCif | `.toUpperCase()` |
| telefono | strip `+34` si ES válido → 9 dígitos |

### Constantes JS
```js
PRECIO_GRUPO_MINIMO = 125
PRECIO_GRUPO_POR_PERSONA = 5
PRECIOS / PRECIOS_MENOR_GUIADA / PRECIOS_RESIDENTE_GUIADA
```

---

## Widget accesibilidad (shared.js ~línea 662)
`_a11yApplyText` · `_a11yApplyMagnifier` · `_a11yApplyGrayscale` · `_a11yApplyHighContrast`
`_a11yApplyInvert` · `_a11yApplyUnderlineLinks` · `_a11yApplyReadableFont` · `_a11yToggleReader` · `_a11yReset`

localStorage: `a11y-text`, `a11y-grayscale`, `a11y-high-contrast`, `a11y-invert`, `a11y-underline-links`, `a11y-readable-font`, `a11y-magnifier`

### Lupa
Clona `body` al activar → escala 2× (`transform-origin:0 0`) · lente circular 200px `#a11y-magnifier-lens` · posición: `left = RADIUS−ZOOM*(scrollX+x)` · guard: `if(window.frameElement)return`
