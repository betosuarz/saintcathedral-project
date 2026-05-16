# Inyecta bloque SEO en cada HTML del proyecto
# Reemplaza <title> existente por <title> nuevo + meta description + canonical + OG + Twitter
# Inserta <script src="seo.js"></script> antes de shared.js

$rootDir = "C:\saintcatedral-project"
$enc = New-Object System.Text.UTF8Encoding($false)
$opts = [System.Text.RegularExpressions.RegexOptions]::Singleline

$DOMAIN = "https://catedralsantodomingo.org"
$BRAND = "Catedral de Santo Domingo de la Calzada"
$THEME = "#0E0C0A"

# ── Datos por página: title, description, og_image, robots, schema_type
$pages = @(
  @{ path = "index.html"; depth = 0;
     title = "Catedral de Santo Domingo de la Calzada — Camino de Santiago en La Rioja";
     desc = "Catedral de Santo Domingo de la Calzada, en el corazón del Camino de Santiago. Vive el milagro del gallo y la gallina, único en el mundo. Reserva entradas online.";
     og = "assets/img/catedral-institucion.webp"; robots = "index, follow" }

  @{ path = "actualidad.html"; depth = 0;
     title = "Actualidad y Agenda · Catedral de Santo Domingo de la Calzada";
     desc = "Noticias, agenda cultural, conciertos y celebraciones litúrgicas de la Catedral de Santo Domingo de la Calzada. Toda la actualidad del Camino Francés.";
     og = "assets/img/catedral-actualidad.webp"; robots = "index, follow" }

  @{ path = "institucion.html"; depth = 0;
     title = "Institución · Cabildo y Parroquia · Catedral de Santo Domingo de la Calzada";
     desc = "Conoce el Cabildo y la Parroquia de la Catedral de Santo Domingo de la Calzada: gestión patrimonial, acción social y vida espiritual en el Camino Francés.";
     og = "assets/img/catedral-institucion.webp"; robots = "index, follow" }

  @{ path = "monumentos.html"; depth = 0;
     title = "Monumentos del Conjunto Catedralicio · Santo Domingo de la Calzada";
     desc = "Catedral, Torre Exenta, Convento de San Francisco, Ermita de la Plaza y Monasterio de Cañas. Cinco monumentos, ocho siglos de patrimonio en La Rioja.";
     og = "assets/img/catedral-institucion.webp"; robots = "index, follow" }

  @{ path = "visitas.html"; depth = 0;
     title = "Visitas · Pulsera Turística y Visitas Guiadas · Catedral de Santo Domingo";
     desc = "Visita los monumentos de Santo Domingo de la Calzada con la Pulsera Turística (10€) o reserva visitas guiadas diurnas, nocturnas y VIP. Reserva online.";
     og = "assets/img/catedral-institucion.webp"; robots = "index, follow" }

  @{ path = "reservas.html"; depth = 0;
     title = "Reserva tu Entrada · Catedral de Santo Domingo de la Calzada";
     desc = "Compra online tu entrada a la Catedral, Torre Exenta y monumentos de Santo Domingo de la Calzada. Pulsera Turística, visitas guiadas y tarifa peregrino.";
     og = "assets/img/catedral-institucion.webp"; robots = "index, follow" }

  @{ path = "monumentos/catedral.html"; depth = 1;
     title = "Catedral · Románico-Gótico · Santo Domingo de la Calzada";
     desc = "Catedral de los siglos XII-XIV, joya del románico-gótico riojano. Visita el milagro del gallo y la gallina, único en el mundo, y el retablo de Damián Forment.";
     og = "assets/img/retablo.webp"; robots = "index, follow" }

  @{ path = "monumentos/torre.html"; depth = 1;
     title = "Torre Exenta · Campanario Barroco de 70 m · Santo Domingo de la Calzada";
     desc = "Torre Exenta de 70 metros, único campanario barroco separado del templo en La Rioja. Sube y descubre el museo de relojes y campanas con vistas panorámicas.";
     og = "assets/img/torre-exenta.webp"; robots = "index, follow" }

  @{ path = "monumentos/sanfrancisco.html"; depth = 1;
     title = "Convento de San Francisco · Renacimiento · Santo Domingo de la Calzada";
     desc = "Convento renacentista del siglo XVI fundado por Iñigo Ortiz de Zúñiga. Claustro porticado, sala de marfiles y exposiciones de arte sacro en el Camino Francés.";
     og = "assets/img/sanfrancisco.webp"; robots = "index, follow" }

  @{ path = "monumentos/ermitaplaza.html"; depth = 1;
     title = "Ermita de la Plaza · Iglesia de Nuestra Señora · Santo Domingo de la Calzada";
     desc = "Antigua iglesia de Nuestra Señora de la Plaza. Capilla histórica con la Virgen de la Plaza, talla gótica del siglo XIV en pleno casco antiguo.";
     og = "assets/img/ermitaplaza.webp"; robots = "index, follow" }

  @{ path = "monumentos/monasteriocanas.html"; depth = 1;
     title = "Monasterio de Cañas · Cisterciense · Beata Urraca · La Rioja";
     desc = "Monasterio cisterciense de Santa María de Cañas. Vidrieras góticas, sepulcro de la Beata Urraca y Sala Capitular románica a 12 km de Santo Domingo.";
     og = "assets/img/canas.webp"; robots = "index, follow" }

  @{ path = "visitas/pulsera-turistica.html"; depth = 1;
     title = "Pulsera Turística · 4 Monumentos por 10€ · Santo Domingo de la Calzada";
     desc = "Pulsera Turística: acceso libre a 4 monumentos del conjunto catedralicio por 10€. Tarifa peregrino 5€. Válida todo el día. Reserva online.";
     og = "assets/img/pulsera.webp"; robots = "index, follow" }

  @{ path = "visitas/guiada-diurna.html"; depth = 1;
     title = "Visita Guiada Diurna · Catedral de Santo Domingo de la Calzada";
     desc = "Visita guiada diurna por la Catedral y sus monumentos. Recorre 8 siglos de historia, descubre el milagro del gallo y reserva tu plaza online (14€).";
     og = "assets/img/guiada-diurna.webp"; robots = "index, follow" }

  @{ path = "visitas/guiada-nocturna.html"; depth = 1;
     title = "Visita Guiada Nocturna · Catedral Iluminada · Santo Domingo";
     desc = "Visita guiada nocturna por la Catedral iluminada. Una experiencia única para descubrir el conjunto catedralicio en una atmósfera mística (15€). Reserva online.";
     og = "assets/img/iluminacion-nocturna.webp"; robots = "index, follow" }

  @{ path = "visitas/guiada-vip.html"; depth = 1;
     title = "Visita Guiada VIP · Acceso Exclusivo · Catedral de Santo Domingo";
     desc = "Visita guiada VIP con acceso a zonas exclusivas de la Catedral: cripta, archivo y rincones reservados. Experiencia premium con guía especializado (15€).";
     og = "assets/img/guiada-vip.webp"; robots = "index, follow" }

  @{ path = "visitas/guiada-canas.html"; depth = 1;
     title = "Visita Guiada Monasterio de Cañas · Cisterciense · La Rioja";
     desc = "Visita guiada al Monasterio Cisterciense de Cañas. Vidrieras góticas, claustro, sepulcro de la Beata Urraca y Sala Capitular. Recorrido completo con guía.";
     og = "assets/img/vidrieras-canas.webp"; robots = "index, follow" }

  @{ path = "legal/aviso-legal.html"; depth = 1;
     title = "Aviso Legal · Catedral de Santo Domingo de la Calzada";
     desc = "Aviso legal y términos de uso del sitio web oficial de la Catedral de Santo Domingo de la Calzada.";
     og = "assets/img/catedral-institucion.webp"; robots = "noindex, follow" }

  @{ path = "legal/privacidad.html"; depth = 1;
     title = "Política de Privacidad · Catedral de Santo Domingo de la Calzada";
     desc = "Política de privacidad y tratamiento de datos personales del sitio web oficial de la Catedral de Santo Domingo de la Calzada.";
     og = "assets/img/catedral-institucion.webp"; robots = "noindex, follow" }

  @{ path = "legal/cookies.html"; depth = 1;
     title = "Política de Cookies · Catedral de Santo Domingo de la Calzada";
     desc = "Información sobre el uso de cookies en el sitio web oficial de la Catedral de Santo Domingo de la Calzada.";
     og = "assets/img/catedral-institucion.webp"; robots = "noindex, follow" }

  @{ path = "legal/compra.html"; depth = 1;
     title = "Condiciones de Compra · Catedral de Santo Domingo de la Calzada";
     desc = "Condiciones generales de compra y reserva de entradas para la Catedral de Santo Domingo de la Calzada y sus monumentos.";
     og = "assets/img/catedral-institucion.webp"; robots = "noindex, follow" }

  @{ path = "legal/accesibilidad.html"; depth = 1;
     title = "Accesibilidad · Catedral de Santo Domingo de la Calzada";
     desc = "Declaración de accesibilidad del sitio web oficial de la Catedral de Santo Domingo de la Calzada y sus monumentos.";
     og = "assets/img/catedral-institucion.webp"; robots = "index, follow" }
)

function Build-MetaBlock {
  param($p)
  $prefix = if ($p.depth -eq 0) { "" } else { "../" }
  $canonical = "$DOMAIN/$($p.path)"
  $ogImageUrl = "$DOMAIN/$($p.og)"
  $titleEsc = $p.title -replace '"', '&quot;'
  $descEsc = $p.desc -replace '"', '&quot;'

  $block = @"
<title>$titleEsc</title>
  <meta name="description" content="$descEsc" />
  <meta name="author" content="$BRAND" />
  <meta name="theme-color" content="$THEME" />
  <meta name="robots" content="$($p.robots)" />
  <link rel="canonical" href="$canonical" />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="$BRAND" />
  <meta property="og:title" content="$titleEsc" />
  <meta property="og:description" content="$descEsc" />
  <meta property="og:url" content="$canonical" />
  <meta property="og:image" content="$ogImageUrl" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:locale" content="es_ES" />
  <meta property="og:locale:alternate" content="en_GB" />
  <meta property="og:locale:alternate" content="fr_FR" />
  <meta property="og:locale:alternate" content="de_DE" />
  <meta property="og:locale:alternate" content="pt_PT" />
  <meta property="og:locale:alternate" content="it_IT" />
  <meta property="og:locale:alternate" content="ko_KR" />
  <meta property="og:locale:alternate" content="eu_ES" />
  <meta property="og:locale:alternate" content="ca_ES" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="$titleEsc" />
  <meta name="twitter:description" content="$descEsc" />
  <meta name="twitter:image" content="$ogImageUrl" />

  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="${prefix}favicon.svg" />
"@
  return $block
}

foreach ($p in $pages) {
  $fullPath = Join-Path $rootDir $p.path.Replace('/', '\')
  if (-not (Test-Path $fullPath)) { Write-Warning "Not found: $fullPath"; continue }

  $content = [System.IO.File]::ReadAllText($fullPath, $enc)
  $newBlock = Build-MetaBlock $p

  # Replace existing <title>...</title> with the new full SEO block (which starts with the new <title>)
  $newContent = [regex]::Replace($content, '<title>.*?</title>', { param($m) $newBlock }, $opts)

  if ($newContent -eq $content) {
    Write-Warning "No <title> matched in: $($p.path)"
    continue
  }

  # Insert <script src="seo.js"></script> right BEFORE the existing shared.js script tag
  $prefix = if ($p.depth -eq 0) { "" } else { "../" }
  $seoScript = "<script src=`"${prefix}assets/seo.js`"></script>`r`n  "
  if ($newContent -notmatch [regex]::Escape("assets/seo.js")) {
    $newContent = [regex]::Replace($newContent, '(<script src="(\.\./)?assets/shared\.js"></script>)', "$seoScript`$1")
  }

  [System.IO.File]::WriteAllText($fullPath, $newContent, $enc)
  Write-Host "OK: $($p.path)"
}
