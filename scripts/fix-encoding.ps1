param([string]$Path = ".\lib\i18n\translations")

Write-Host "Fixing encoding for files in $Path..." -ForegroundColor Cyan

$fixed = 0
Get-ChildItem -Path $Path -Recurse -Include "*.ts", "*.tsx", "*.json", "*.md" | ForEach-Object {
  $bytes = [System.IO.File]::ReadAllBytes($_.FullName)
  $hadBom = $false
  if ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
    $hadBom = $true
    $bytes = $bytes[3..($bytes.Length - 1)]
  }
  if ($hadBom) {
    [System.IO.File]::WriteAllBytes($_.FullName, $bytes)
    Write-Host "  Removed BOM: $($_.FullName)" -ForegroundColor Green
    $fixed++
  }
}

if ($fixed -eq 0) {
  Write-Host "No files needed fixing." -ForegroundColor Green
} else {
  Write-Host "Fixed $fixed file(s)." -ForegroundColor Green
}
