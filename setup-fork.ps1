# PowerShell script to setup fork and push code
# Run this script after forking the repository on GitHub

param(
    [Parameter(Mandatory=$true)]
    [string]$GitHubUsername
)

Write-Host "Setting up fork for GitHub user: $GitHubUsername" -ForegroundColor Green

# Add your fork as origin remote
$forkUrl = "https://github.com/$GitHubUsername/vscode-leetcode.git"
Write-Host "Adding fork repository as origin: $forkUrl" -ForegroundColor Yellow

git remote add origin $forkUrl
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to add origin remote. It might already exist." -ForegroundColor Yellow
    Write-Host "Removing existing origin and adding new one..." -ForegroundColor Yellow
    git remote remove origin
    git remote add origin $forkUrl
}

# Verify remotes
Write-Host "`nCurrent remote repositories:" -ForegroundColor Cyan
git remote -v

# Push to your fork
Write-Host "`nPushing code to your fork..." -ForegroundColor Green
git push -u origin master

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Successfully pushed to your fork!" -ForegroundColor Green
    Write-Host "Your enhanced vscode-leetcode is now available at:" -ForegroundColor Cyan
    Write-Host "https://github.com/$GitHubUsername/vscode-leetcode" -ForegroundColor Blue
    
    Write-Host "`nNext steps:" -ForegroundColor Yellow
    Write-Host "1. Visit your fork repository on GitHub" -ForegroundColor White
    Write-Host "2. Verify all files are uploaded correctly" -ForegroundColor White
    Write-Host "3. Consider creating a Pull Request to the original repository" -ForegroundColor White
    Write-Host "4. Share your enhanced version with the community!" -ForegroundColor White
} else {
    Write-Host "`n❌ Push failed. Please check:" -ForegroundColor Red
    Write-Host "1. Your GitHub username is correct" -ForegroundColor White
    Write-Host "2. You have access to the repository" -ForegroundColor White
    Write-Host "3. Your GitHub authentication is working" -ForegroundColor White
    Write-Host "4. The repository exists and is accessible" -ForegroundColor White
}

Write-Host "`nTo sync with upstream changes in the future:" -ForegroundColor Cyan
Write-Host "git fetch upstream" -ForegroundColor White
Write-Host "git merge upstream/master" -ForegroundColor White
Write-Host "git push origin master" -ForegroundColor White
