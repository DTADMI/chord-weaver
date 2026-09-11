param([string]$Path = ".\lib\i18n\translations")

Write-Host "Checking encoding for files in $Path..." -ForegroundColor Cyan

$issues = 0
Get-ChildItem -Path $Path -Recurse -Include "*.ts", "*.tsx", "*.json", "*.md" | ForEach-Object {
  $content = [System.IO.File]::ReadAllBytes($_.FullName)
  if ($content.Length -ge 3 -and $content[0] -eq 0xEF -and $content[1] -eq 0xBB -and $content[2] -eq 0xBF) {
    Write-Host "  BOM found: $($_.FullName)" -ForegroundColor Yellow
    $issues++
  }
  $lines = [System.IO.File]::ReadAllLines($_.FullName)
  for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match '[^\x00-\x7F]' -and $lines[$i] -notmatch '[xe0-\xf6\xf8-\xfe\xe8-\xeb\xe0-\xe4\xf9-\xfc\xf2-\xf6\xe7\xe2\xea\xee\xf4\xfb\xff]') {
      Write-Host "  Suspicious char at line $($i+1) in $($_.Name): $($lines[$i].Substring(0, [Math]::Min(80, $lines[$i].Length)))" -ForegroundColor Yellow
      $issues++
    }
  }
}

if ($issues -eq 0) {
  Write-Host "No encoding issues found." -ForegroundColor Green
} else {
  Write-Host "$issues issues found. Run fix-encoding.ps1 to repair." -ForegroundColor Yellow
}
