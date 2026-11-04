$ErrorActionPreference = "Stop"
$repo = "C:\Users\Administrator\Documents\AAAA\46_GTA_v2\Grand_Theft_Anakin_Tokenomics_Update\Grand_Theft_Anakin_Tokenomics_Update\site"
$node = "C:\Program Files\nodejs\node.exe"
$logDir = Join-Path $repo "data\logs"
New-Item -ItemType Directory -Force -Path $logDir | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $repo "data") | Out-Null

$listening = netstat -ano | Select-String -Pattern ":8796\s+.*LISTENING"
if ($listening) {
  Write-Host "GTA analytics already listening on 8796"
  exit 0
}

$env:HOST = "127.0.0.1"
$env:PORT = "8796"
$env:NODE_ENV = "production"
$env:TRUST_PROXY = "1"
$env:TRUSTED_PROXIES = "127.0.0.1,::1"
$env:TRUSTED_IP_HEADER = "x-forwarded-for"
$env:ALLOWED_ORIGINS = "https://gtaanakin.xyz,https://www.gtaanakin.xyz,http://gtaanakin.xyz,http://www.gtaanakin.xyz,https://gtaanakin.103.161.35.238.sslip.io"
if (-not $env:DASHBOARD_PASSWORD) {
  $env:DASHBOARD_PASSWORD = "AAAA"
}

Start-Process -FilePath $node `
  -ArgumentList "--experimental-strip-types","server/index.ts" `
  -WorkingDirectory $repo `
  -WindowStyle Hidden `
  -RedirectStandardOutput (Join-Path $logDir "node.out.log") `
  -RedirectStandardError (Join-Path $logDir "node.err.log")

Start-Sleep -Seconds 2
$listening = netstat -ano | Select-String -Pattern ":8796\s+.*LISTENING"
if (-not $listening) {
  Write-Error "GTA analytics failed to start. Check data\logs\node.err.log"
  exit 1
}
Write-Host "GTA analytics listening on 127.0.0.1:8796"
