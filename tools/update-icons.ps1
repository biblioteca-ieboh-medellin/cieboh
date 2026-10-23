<#
  Regenera el subconjunto de iconos Material Symbols que descarga el portal.

  Busca todos los "icon": "nombre" de content/*.json y los icon('nombre') del codigo JS,
  y reescribe el parametro icon_names= del <link data-icon-font> en index.html.
  Ejecutalo cada vez que agregues o cambies un icono en los JSON:

    powershell -ExecutionPolicy Bypass -File tools/update-icons.ps1
#>
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$utf8 = New-Object System.Text.UTF8Encoding $false

$names = New-Object System.Collections.Generic.SortedSet[string] ([StringComparer]::Ordinal)

Get-ChildItem (Join-Path $root 'content') -Filter *.json | ForEach-Object {
  $text = [IO.File]::ReadAllText($_.FullName, $utf8)
  [regex]::Matches($text, '"icon"\s*:\s*"([a-z0-9_]+)"') | ForEach-Object { [void]$names.Add($_.Groups[1].Value) }
}

Get-ChildItem (Join-Path $root 'js') -Recurse -Filter *.js | ForEach-Object {
  $text = [IO.File]::ReadAllText($_.FullName, $utf8)
  [regex]::Matches($text, "icon\('([a-z0-9_]+)'") | ForEach-Object { [void]$names.Add($_.Groups[1].Value) }
  # Iconos usados como valores en mapas (p. ej. ICONS del notificador)
  [regex]::Matches($text, "(?:success|info|error):\s*'([a-z0-9_]+)'") | ForEach-Object { [void]$names.Add($_.Groups[1].Value) }
}

# Iconos que el codigo cambia dinamicamente (menu movil y boton cerrar del modal)
'menu', 'close' | ForEach-Object { [void]$names.Add($_) }

$list = ($names -join ',')
$indexPath = Join-Path $root 'index.html'
$html = [IO.File]::ReadAllText($indexPath, $utf8)
$pattern = '(<link rel="stylesheet" data-icon-font href="[^"]*?icon_names=)[a-z0-9_,]*'
if (-not [regex]::IsMatch($html, $pattern)) { throw 'No se encontro <link data-icon-font> en index.html' }
$updated = [regex]::Replace($html, $pattern, { param($m) $m.Groups[1].Value + $list })
[IO.File]::WriteAllText($indexPath, $updated, $utf8)

Write-Host ("{0} iconos: {1}" -f $names.Count, $list)
