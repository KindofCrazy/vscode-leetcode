# PowerShell script to install enhanced vscode-leetcode plugin
# This script will build and install the enhanced plugin to replace the existing one

Write-Host "Building enhanced vscode-leetcode plugin..." -ForegroundColor Green

# Build the plugin
npm run compile
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Build successful!" -ForegroundColor Green

# Package the plugin
Write-Host "Packaging plugin..." -ForegroundColor Green
vsce package --out enhanced-leetcode.vsix
if ($LASTEXITCODE -ne 0) {
    Write-Host "Packaging failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Plugin packaged as enhanced-leetcode.vsix" -ForegroundColor Green

# Instructions for installation
Write-Host "`nInstallation Instructions:" -ForegroundColor Yellow
Write-Host "1. Open VS Code" -ForegroundColor White
Write-Host "2. Go to Extensions (Ctrl+Shift+X)" -ForegroundColor White
Write-Host "3. Click the '...' menu and select 'Install from VSIX...'" -ForegroundColor White
Write-Host "4. Select the 'enhanced-leetcode.vsix' file" -ForegroundColor White
Write-Host "5. Restart VS Code" -ForegroundColor White

Write-Host "`nNew Features Available:" -ForegroundColor Cyan
Write-Host "- Split View Mode: Description on left, code editor on right" -ForegroundColor White
Write-Host "- Problem Lists: Create custom lists and use official LeetCode lists" -ForegroundColor White
Write-Host "- Enhanced sidebar with ProblemList category" -ForegroundColor White

Write-Host "`nConfiguration:" -ForegroundColor Yellow
Write-Host "- Enable split view: Set 'leetcode.enableSplitView' to true" -ForegroundColor White
Write-Host "- Access problem lists in the LeetCode sidebar" -ForegroundColor White
