# Catedral de Santo Domingo de la Calzada

## Stack
Vanilla HTML + CSS + JS puro. Sin frameworks, sin bundler, sin npm.
No añadir dependencias externas sin consultar.

## Estructura
```
index.html, institucion.html, monumentos.html, actualidad.html, visitas.html, reservas.html
monumentos/  visitas/  legal/  assets/
```
Ver `CLAUDE-design.md` para estructura completa.

## Assets compartidos
- `assets/shared.css` — tokens, navbar, footer, a11y
- `assets/shared.js` — cursor, navbar, i18n, accesibilidad
- `assets/_shared-fragments.html` — plantilla (copiar a mano, nunca incluir dinámicamente)

## Añadir página nueva
1. Copiar `<head>` de `_shared-fragments.html`
2. Pegar cursor + panel a11y + navbar + side-menu al inicio del `<body>`
3. Pegar footer al final
4. **El panel a11y se copia íntegro en cada página.** Si se añade un botón, replicarlo en todos los HTML + `_shared-fragments.html`

## i18n
`SHARED_T` en `shared.js`, 9 idiomas (`es en fr de pt it ko eu ca`). Clave activa en `localStorage['cat-lang']`. Páginas amplían con `window.PAGE_applyLang(lang, t)`.

## Dark / light mode
- Dark: estado por defecto (`body:not(.light-mode)`)
- Light: clase `body.light-mode` — el wizard `reservas.html` arranca en light

## Convenciones
- Sin comentarios salvo WHY no obvio
- Copiar antes que abstraer
- Cada función a11y: `toggle clase body + localStorage + aria-pressed`
