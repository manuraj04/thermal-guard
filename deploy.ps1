# Quick Deploy Script for Vercel

Write-Host "🚀 Thermal Guard Deployment Script" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check if Vercel CLI is installed
Write-Host "Checking for Vercel CLI..." -ForegroundColor Yellow
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelInstalled) {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
    Write-Host "✅ Vercel CLI installed!" -ForegroundColor Green
} else {
    Write-Host "✅ Vercel CLI found!" -ForegroundColor Green
}

Write-Host ""
Write-Host "📋 Pre-Deployment Checks:" -ForegroundColor Yellow
Write-Host "  1. Ensure your backend is deployed (Railway/Render)" -ForegroundColor White
Write-Host "  2. Copy your backend URL" -ForegroundColor White
Write-Host "  3. Set VITE_API_BASE_URL environment variable in Vercel" -ForegroundColor White
Write-Host ""

$confirm = Read-Host "Have you deployed the backend and have the URL? (y/n)"

if ($confirm -eq 'y' -or $confirm -eq 'Y') {
    $backendUrl = Read-Host "Enter your backend URL (e.g., https://your-app.railway.app)"
    
    Write-Host ""
    Write-Host "🔧 Building frontend..." -ForegroundColor Yellow
    npm run build
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Build successful!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Yellow
        Write-Host "⚠️  When prompted, add this environment variable:" -ForegroundColor Yellow
        Write-Host "   VITE_API_BASE_URL=$backendUrl" -ForegroundColor Cyan
        Write-Host ""
        
        vercel --prod
    } else {
        Write-Host "❌ Build failed! Please check errors above." -ForegroundColor Red
    }
} else {
    Write-Host ""
    Write-Host "📖 Please deploy backend first:" -ForegroundColor Yellow
    Write-Host "  1. Go to https://railway.app" -ForegroundColor White
    Write-Host "  2. Deploy from GitHub" -ForegroundColor White
    Write-Host "  3. Set start command: cd backend && uvicorn main:app --host 0.0.0.0 --port `$PORT" -ForegroundColor White
    Write-Host "  4. Copy the deployed URL" -ForegroundColor White
    Write-Host "  5. Run this script again" -ForegroundColor White
}

Write-Host ""
Write-Host "For detailed instructions, see DEPLOYMENT.md" -ForegroundColor Cyan
