<#
  Servidor estático de desarrollo para el portal CIE-BOH (solo localhost).
  Uso:  powershell -ExecutionPolicy Bypass -File server.ps1 [-Port 8080]

  Además de servir archivos, envía las cabeceras de seguridad HTTP que el
  servidor de producción (Apache/Nginx/IIS) también debe configurar.
#>
param([int]$Port = 8080)

$ErrorActionPreference = 'Stop'
$root = [IO.Path]::GetFullPath($PSScriptRoot)

$mime = @{
  '.html' = 'text/html; charset=utf-8'
  '.css'  = 'text/css; charset=utf-8'
  '.js'   = 'text/javascript; charset=utf-8'
  '.json' = 'application/json; charset=utf-8'
  '.svg'  = 'image/svg+xml'
  '.png'  = 'image/png'
  '.jpg'  = 'image/jpeg'
  '.webp' = 'image/webp'
  '.ico'  = 'image/x-icon'
  '.txt'  = 'text/plain; charset=utf-8'
  '.pdf'  = 'application/pdf'
  '.docx' = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
}

$securityHeaders = [ordered]@{
  # Solo agrega frame-ancestors; el resto de la política viene del <meta> de cada página (igual que en GitHub Pages).
  'Content-Security-Policy'      = "frame-ancestors 'none'"
  'X-Content-Type-Options'       = 'nosniff'
  'X-Frame-Options'              = 'DENY'
  'Referrer-Policy'              = 'strict-origin-when-cross-origin'
  'Permissions-Policy'           = 'camera=(), microphone=(), geolocation=(), payment=(), usb=()'
  'Cross-Origin-Opener-Policy'   = 'same-origin'
  'Cross-Origin-Resource-Policy' = 'same-origin'
}

$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "Portal CIE-BOH en http://localhost:$Port  (Ctrl+C para detener)"

try {
  while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $res = $ctx.Response
    try {
      foreach ($h in $securityHeaders.GetEnumerator()) { $res.Headers[$h.Key] = $h.Value }

      if ($ctx.Request.HttpMethod -notin @('GET', 'HEAD')) {
        $res.StatusCode = 405
        continue
      }

      $rel = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath).TrimStart('/')
      if ([string]::IsNullOrEmpty($rel)) { $rel = 'index.html' }
      $full = [IO.Path]::GetFullPath((Join-Path $root $rel))

      # Bloquea path traversal, archivos ocultos y el propio script del servidor.
      $outside = -not $full.StartsWith($root + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)
      $hidden  = $rel -match '(^|/)\.' -or $full -like '*.ps1'
      $ext = [IO.Path]::GetExtension($full).ToLowerInvariant()

      if ($outside -or $hidden -or -not (Test-Path $full -PathType Leaf) -or -not $mime.ContainsKey($ext)) {
        # Igual que GitHub Pages: responde con 404.html
        $res.StatusCode = 404
        $bytes = [IO.File]::ReadAllBytes((Join-Path $root '404.html'))
        $res.ContentType = $mime['.html']
      } else {
        $bytes = [IO.File]::ReadAllBytes($full)
        $res.ContentType = $mime[$ext]
        $res.Headers['Cache-Control'] = 'no-cache'
      }

      $res.ContentLength64 = $bytes.Length
      if ($ctx.Request.HttpMethod -eq 'GET') { $res.OutputStream.Write($bytes, 0, $bytes.Length) }
      Write-Host ("{0} {1} -> {2}" -f $ctx.Request.HttpMethod, $ctx.Request.Url.AbsolutePath, $res.StatusCode)
    } catch {
      $res.StatusCode = 500
    } finally {
      $res.Close()
    }
  }
} finally {
  $listener.Stop()
}
