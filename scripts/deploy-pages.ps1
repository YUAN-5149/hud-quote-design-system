# 打包並部署 GitHub Pages（gh-pages 分支）
# 用法：powershell -File scripts\deploy-pages.ps1
$ErrorActionPreference = 'Stop'
$repo = Split-Path $PSScriptRoot -Parent
$site = Join-Path $repo '_site'

# 1. 打包報價 App（base 對應 Pages 子路徑）
Push-Location (Join-Path $repo 'app')
npm run build -- --base=/hud-quote-design-system/app/
if ($LASTEXITCODE -ne 0) { Pop-Location; throw 'vite build failed' }
Pop-Location

# 2. 組裝站點
if (Test-Path $site) { Remove-Item $site -Recurse -Force }
New-Item -ItemType Directory -Force (Join-Path $site 'app') | Out-Null
Copy-Item (Join-Path $repo 'index.html'), (Join-Path $repo 'colors_and_type.css') $site
Copy-Item (Join-Path $repo 'preview'), (Join-Path $repo 'assets'), (Join-Path $repo 'ui_kits') $site -Recurse
Copy-Item (Join-Path $repo 'app\dist\*') (Join-Path $site 'app') -Recurse
New-Item -ItemType File (Join-Path $site '.nojekyll') | Out-Null

# 3. 推送 gh-pages 分支（以 _site 為根、單一 commit 覆蓋）
Push-Location $site
git init -b gh-pages | Out-Null
git add -A
git commit -m 'Deploy GitHub Pages' | Out-Null
git push -f (git -C $repo remote get-url origin) gh-pages:gh-pages
Pop-Location
Remove-Item (Join-Path $site '.git') -Recurse -Force

Write-Host 'Deployed: https://yuan-5149.github.io/hud-quote-design-system/'
