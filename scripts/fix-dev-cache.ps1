param(
  [int]$Port = 3000
)

$ErrorActionPreference = "Stop"
$Workspace = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$NextPath = Join-Path $Workspace ".next"

Write-Host "SVAN dev reset" -ForegroundColor Green
Write-Host "Workspace: $Workspace"
Write-Host "Port: $Port"

$listeners = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
if ($listeners) {
  $listeners | ForEach-Object {
    Write-Host "Stopping process $($_.OwningProcess) on port $Port"
    Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
  }
}

if (Test-Path $NextPath) {
  $ResolvedNextPath = (Resolve-Path $NextPath).Path
  if (-not $ResolvedNextPath.StartsWith($Workspace)) {
    throw "Safety check failed. Refusing to remove path outside workspace: $ResolvedNextPath"
  }

  Write-Host "Removing generated Next cache: $ResolvedNextPath"
  Remove-Item -LiteralPath $ResolvedNextPath -Recurse -Force
}

Set-Location $Workspace
$env:npm_config_cache = Join-Path $Workspace "work\npm-cache"
Write-Host "Starting SVAN on http://localhost:$Port" -ForegroundColor Green
npm.cmd run dev -- -p $Port
