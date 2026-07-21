# 打包並部署 GitHub Pages（gh-pages 分支）
# 用法：powershell -File scripts\deploy-pages.ps1
# 所有 git 操作都用 -C 明確指定路徑；每次部署用全新時間戳目錄，避免舊檔案鎖
$ErrorActionPreference = 'Stop'
$repo = Split-Path $PSScriptRoot -Parent
$site = Join-Path $repo ("_site\d" + (Get-Date -Format 'yyyyMMddHHmmss'))
if (-not (Test-Path (Join-Path $repo 'app\package.json'))) { throw "repo path wrong: $repo" }

# 1. 打包報價 App（base 對應 Pages 子路徑）
npm run build --prefix (Join-Path $repo 'app') -- --base=/hud-quote-design-system/app/
if ($LASTEXITCODE -ne 0) { throw 'vite build failed' }

# 2. 組裝站點（全新目錄）
New-Item -ItemType Directory -Force (Join-Path $site 'app') | Out-Null
Copy-Item (Join-Path $repo 'index.html'), (Join-Path $repo 'colors_and_type.css') $site
Copy-Item (Join-Path $repo 'preview'), (Join-Path $repo 'assets'), (Join-Path $repo 'ui_kits') $site -Recurse
Copy-Item (Join-Path $repo 'app\dist\*') (Join-Path $site 'app') -Recurse
New-Item -ItemType File (Join-Path $site '.nojekyll') | Out-Null

# 3. 建立獨立 git 倉庫並驗證根目錄，確認無誤才推送
# init 一律用 -C 進入 $site 再執行，與下方其他指令一致；用路徑參數形式
# （git init ... $site）曾在剛複製完檔案的目錄上偶發不留下 .git，導致後續
# -C 指令往上誤指到主 repo。init 後立即斷言 .git 確實存在，讓失敗在此就顯現。
git -C $site init -b gh-pages
if ($LASTEXITCODE -ne 0) { throw 'git init failed' }
if (-not (Test-Path (Join-Path $site '.git'))) { throw "git init did not create .git in $site - abort" }
$top = (git -C $site rev-parse --show-toplevel).Replace('/', '\')
if ($top -ne $site) { throw "git toplevel mismatch: '$top' != '$site' - abort to avoid committing wrong directory" }

git -C $site add -A
if ($LASTEXITCODE -ne 0) { throw 'git add failed' }
git -C $site commit -m 'Deploy GitHub Pages'
if ($LASTEXITCODE -ne 0) { throw 'git commit failed' }

$origin = git -C $repo remote get-url origin
if (-not $origin) { throw 'origin remote not found' }
git -C $site push -f $origin gh-pages:gh-pages
if ($LASTEXITCODE -ne 0) { throw 'git push failed' }

Remove-Item (Join-Path $site '.git') -Recurse -Force
Write-Host 'Deployed: https://yuan-5149.github.io/hud-quote-design-system/'
