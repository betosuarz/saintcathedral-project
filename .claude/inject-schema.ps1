$rootDir = "C:\saintcatedral-project"
$enc = New-Object System.Text.UTF8Encoding($false)

$ADDRESS_CATHEDRAL = @"
{
        "@type": "PostalAddress",
        "streetAddress": "Plaza del Santo, 4",
        "addressLocality": "Santo Domingo de la Calzada",
        "addressRegion": "La Rioja",
        "postalCode": "26250",
        "addressCountry": "ES"
      }
"@

$ADDRESS_CANAS = @"
{
        "@type": "PostalAddress",
        "streetAddress": "Plaza del Monasterio, s/n",
        "addressLocality": "Cañas",
        "addressRegion": "La Rioja",
        "postalCode": "26325",
        "addressCountry": "ES"
      }
"@

# Schema by page
$schemas = @{
  "index.html" = @"
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["PlaceOfWorship", "Church", "TouristAttraction"],
      "@id": "https://catedralsantodomingo.org/#cathedral",
      "name": "Catedral de Santo Domingo de la Calzada",
      "alternateName": ["Catedral del Salvador", "S.I. Catedral de Santo Domingo"],
      "description": "Catedral románico-gótica de los siglos XII–XIV, joya del Camino de Santiago en La Rioja. Única en el mundo con gallo y gallina vivos en su interior.",
      "url": "https://catedralsantodomingo.org/",
      "telephone": "+34 941 340 033",
      "email": "info@catedralsantodomingo.org",
      "image": "https://catedralsantodomingo.org/assets/img/catedral-institucion.webp",
      "address": $ADDRESS_CATHEDRAL,
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 42.4408,
        "longitude": -2.9536
      },
      "religiousAffiliation": "Catholic",
      "isAccessibleForFree": false,
      "publicAccess": true,
      "tourBookingPage": "https://catedralsantodomingo.org/reservas.html",
      "sameAs": ["https://es.wikipedia.org/wiki/Catedral_de_Santo_Domingo_de_la_Calzada"]
    },
    {
      "@type": "Organization",
      "@id": "https://catedralsantodomingo.org/#organization",
      "name": "Catedral de Santo Domingo de la Calzada",
      "url": "https://catedralsantodomingo.org/",
      "logo": "https://catedralsantodomingo.org/favicon.svg",
      "email": "info@catedralsantodomingo.org",
      "telephone": "+34 941 340 033",
      "address": $ADDRESS_CATHEDRAL,
      "contactPoint": [
        {"@type": "ContactPoint", "contactType": "reservations", "email": "entradas@catedralsantodomingo.org"},
        {"@type": "ContactPoint", "contactType": "parish", "email": "parroquia@catedralsantodomingo.org"},
        {"@type": "ContactPoint", "contactType": "archive", "email": "archivo@catedralsantodomingo.org"},
        {"@type": "ContactPoint", "contactType": "chapter", "email": "cabildo@catedralsantodomingo.org"}
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://catedralsantodomingo.org/#website",
      "url": "https://catedralsantodomingo.org/",
      "name": "Catedral de Santo Domingo de la Calzada",
      "publisher": {"@id": "https://catedralsantodomingo.org/#organization"},
      "inLanguage": ["es", "en", "fr", "de", "pt", "it", "ko", "eu", "ca"]
    }
  ]
}
</script>
"@

  "monumentos/catedral.html" = @"
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": ["Church", "PlaceOfWorship", "TouristAttraction"],
  "@id": "https://catedralsantodomingo.org/monumentos/catedral.html#cathedral",
  "name": "Catedral de Santo Domingo de la Calzada",
  "description": "Catedral románico-gótica de los siglos XII–XIV, joya del Camino de Santiago en La Rioja. Visita el milagro del gallo y la gallina, único en el mundo, y el retablo de Damián Forment.",
  "url": "https://catedralsantodomingo.org/monumentos/catedral.html",
  "image": "https://catedralsantodomingo.org/assets/img/retablo.webp",
  "address": $ADDRESS_CATHEDRAL,
  "geo": {"@type": "GeoCoordinates", "latitude": 42.4408, "longitude": -2.9536},
  "religiousAffiliation": "Catholic",
  "tourBookingPage": "https://catedralsantodomingo.org/reservas.html",
  "isAccessibleForFree": false
}
</script>
"@

  "monumentos/torre.html" = @"
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TouristAttraction",
  "@id": "https://catedralsantodomingo.org/monumentos/torre.html#tower",
  "name": "Torre Exenta de Santo Domingo de la Calzada",
  "description": "Torre exenta barroca de 70 metros, único campanario separado del templo en La Rioja. Museo de relojes y campanas con vistas panorámicas.",
  "url": "https://catedralsantodomingo.org/monumentos/torre.html",
  "image": "https://catedralsantodomingo.org/assets/img/torre-exenta.webp",
  "address": $ADDRESS_CATHEDRAL,
  "geo": {"@type": "GeoCoordinates", "latitude": 42.4407, "longitude": -2.9534},
  "isAccessibleForFree": false,
  "tourBookingPage": "https://catedralsantodomingo.org/reservas.html"
}
</script>
"@

  "monumentos/sanfrancisco.html" = @"
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": ["PlaceOfWorship", "TouristAttraction"],
  "@id": "https://catedralsantodomingo.org/monumentos/sanfrancisco.html#convent",
  "name": "Convento de San Francisco de Santo Domingo de la Calzada",
  "description": "Convento renacentista del siglo XVI fundado por Iñigo Ortiz de Zúñiga. Claustro porticado, sala de marfiles y exposiciones de arte sacro en el Camino Francés.",
  "url": "https://catedralsantodomingo.org/monumentos/sanfrancisco.html",
  "image": "https://catedralsantodomingo.org/assets/img/sanfrancisco.webp",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Santo Domingo de la Calzada",
    "addressRegion": "La Rioja",
    "addressCountry": "ES"
  },
  "religiousAffiliation": "Catholic",
  "tourBookingPage": "https://catedralsantodomingo.org/reservas.html"
}
</script>
"@

  "monumentos/ermitaplaza.html" = @"
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": ["PlaceOfWorship", "TouristAttraction"],
  "@id": "https://catedralsantodomingo.org/monumentos/ermitaplaza.html#chapel",
  "name": "Ermita de la Plaza · Iglesia de Nuestra Señora",
  "description": "Antigua iglesia de Nuestra Señora de la Plaza en Santo Domingo de la Calzada. Capilla histórica con la Virgen de la Plaza, talla gótica del siglo XIV.",
  "url": "https://catedralsantodomingo.org/monumentos/ermitaplaza.html",
  "image": "https://catedralsantodomingo.org/assets/img/ermitaplaza.webp",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Santo Domingo de la Calzada",
    "addressRegion": "La Rioja",
    "addressCountry": "ES"
  },
  "religiousAffiliation": "Catholic"
}
</script>
"@

  "monumentos/monasteriocanas.html" = @"
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": ["PlaceOfWorship", "Monastery", "TouristAttraction"],
  "@id": "https://catedralsantodomingo.org/monumentos/monasteriocanas.html#monastery",
  "name": "Monasterio Cisterciense de Santa María de Cañas",
  "alternateName": "Monasterio de Cañas",
  "description": "Monasterio cisterciense fundado en 1170. Vidrieras góticas, sepulcro de la Beata Urraca y Sala Capitular románica a 12 km de Santo Domingo de la Calzada.",
  "url": "https://catedralsantodomingo.org/monumentos/monasteriocanas.html",
  "image": "https://catedralsantodomingo.org/assets/img/canas.webp",
  "address": $ADDRESS_CANAS,
  "geo": {"@type": "GeoCoordinates", "latitude": 42.413, "longitude": -2.851},
  "religiousAffiliation": "Catholic",
  "tourBookingPage": "https://catedralsantodomingo.org/reservas.html"
}
</script>
"@
}

foreach ($pagePath in $schemas.Keys) {
  $fullPath = Join-Path $rootDir $pagePath.Replace('/', '\')
  if (-not (Test-Path $fullPath)) { Write-Warning "Not found: $fullPath"; continue }
  $content = [System.IO.File]::ReadAllText($fullPath, $enc)
  $schema = $schemas[$pagePath]

  # Skip if already injected
  if ($content -match 'application/ld\+json') {
    Write-Host "Skipped (schema already present): $pagePath"
    continue
  }

  # Insert just before </head>
  $newContent = $content -replace '</head>', "  $schema`r`n</head>"

  if ($newContent -eq $content) {
    Write-Warning "No </head> matched in: $pagePath"
    continue
  }

  [System.IO.File]::WriteAllText($fullPath, $newContent, $enc)
  Write-Host "OK: $pagePath"
}
