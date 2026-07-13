# 打包並部署 GitHub Pages（gh-pages 分支）
# 用法：powershell -File scripts\deploy-pages.ps1
# 所有 git 操作都用 -C 明確指定路徑，不依賴目前工作目錄
$ErrorActionPreference = 'Stop'
$repo = Split-Path $PSScriptRoot -Parent
$site = Join-Path $repo '_site'
if (-not (Test-Path (Join-Path $repo 'app\package.json'))) { throw "repo path wrong: $repo" }

# 1. 打包報價 App（base 對應 Pages 子路徑）
npm run build --prefix (Join-Path $repo 'app') -- --base=/hud-quote-design-system/app/
if ($LASTEXITCODE -ne 0) { throw 'vite build failed' }

# 2. 組裝站點
if (Test-Path $site) { Remove-Item $site -Recurse -Force }
New-Item -ItemType Directory -Force (Join-Path $site 'app') | Out-Null
Copy-Item (Join-Path $repo 'index.html'), (Join-Path $repo 'colors_and_type.css') $site
Copy-Item (Join-Path $repo 'preview'), (Join-Path $repo 'assets'), (Join-Path $repo 'ui_kits') $site -Recurse
Copy-Item (Join-Path $repo 'app\dist\*') (Join-Path $site 'app') -Recurse
New-Item -ItemType File (Join-Path $site '.nojekyll') | Out-Null

# 3. 在 _site 建立獨立 git 倉庫並驗證，確認無誤才推送
git init -b gh-pages $site
if ($LASTEXITCODE -ne 0) { throw 'git init failed' }
$top = (git -C $site rev-parse --show-toplevel).Replace('/', '\')
if ($top -ne $site) { throw "git toplevel mismatch: '$top' != '$site' — abort to avoid committing wrong directory" }

git -C $site add -A
git -C $site commit -m 'Deploy GitHub Pages'
if ($LASTEXITCODE -ne 0) { throw 'git commit failed' }

$origin = git -C $repo remote get-url origin
if (-not $origin) { throw 'origin remote not found' }
git -C $site push -f $origin gh-pages:gh-pages
if ($LASTEXITCODE -ne 0) { throw 'git push failed' }

Remove-Item (Join-Path $site '.git') -Recurse -Force
Write-Host 'Deployed: https://yuan-5149.github.io/hud-quote-design-system/'
