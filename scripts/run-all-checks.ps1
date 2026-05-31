Write-Host "=== Running All Checks ===" -ForegroundColor Cyan

Write-Host "[1/4] Typecheck..." -ForegroundColor Yellow
pnpm typecheck; if (-not $?) { exit 1 }

Write-Host "[2/4] Lint..." -ForegroundColor Yellow
pnpm lint; if (-not $?) { exit 1 }

Write-Host "[3/4] Tests..." -ForegroundColor Yellow
pnpm test; if (-not $?) { exit 1 }

Write-Host "[4/4] Build..." -ForegroundColor Yellow
pnpm build; if (-not $?) { exit 1 }

Write-Host "=== All Checks Passed ===" -ForegroundColor Green
