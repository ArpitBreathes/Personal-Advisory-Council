# Personal Advisory Council - Quick Start Commands

# ============================================
# STEP 1: Install Dependencies
# ============================================
Write-Host "Installing dependencies..." -ForegroundColor Green
npm install

# ============================================
# STEP 2: Check if .env exists
# ============================================
if (-Not (Test-Path ".env")) {
    Write-Host "`n⚠️  .env file not found!" -ForegroundColor Yellow
    Write-Host "Creating .env from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "`n✅ .env file created!" -ForegroundColor Green
    Write-Host "`n⚠️  IMPORTANT: Edit .env file with your API keys:" -ForegroundColor Red
    Write-Host "   1. Get Gemini API key from: https://aistudio.google.com/" -ForegroundColor Yellow
    Write-Host "   2. Get Firebase config from: https://console.firebase.google.com/" -ForegroundColor Yellow
    Write-Host "   3. Update the .env file with your keys" -ForegroundColor Yellow
    Write-Host "`nPress any key after updating .env file..." -ForegroundColor Cyan
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

# ============================================
# STEP 3: Run Development Server
# ============================================
Write-Host "`nStarting development server..." -ForegroundColor Green
Write-Host "App will open at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "`nPress Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host "============================================`n" -ForegroundColor Green

npm run dev
