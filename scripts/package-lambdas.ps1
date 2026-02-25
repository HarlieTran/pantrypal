$ErrorActionPreference = "Stop"

$zipTargets = @(
  @{ Source = "dist/health-check/index.js"; Output = "dist/health-check.zip" },
  @{ Source = "dist/onboarding-api/index.js"; Output = "dist/onboarding-api.zip" },
  @{ Source = "dist/summary/index.js"; Output = "dist/summary.zip" },
  @{ Source = "dist/session-monitor/index.js"; Output = "dist/session-monitor.zip" }
)

foreach ($target in $zipTargets) {
  if (!(Test-Path $target.Source)) {
    throw "Missing build artifact: $($target.Source)"
  }

  if (Test-Path $target.Output) {
    Remove-Item -Force $target.Output
  }

  Compress-Archive -Path $target.Source -DestinationPath $target.Output -Force
}

Write-Host "Created zip artifacts in dist/."