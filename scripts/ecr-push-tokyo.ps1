# Tokyo Region ECR Image Push Script
# Usage: .\ecr-push-tokyo.ps1

$ErrorActionPreference = "Stop"

$ACCOUNT_ID = "061039804626"
$SEOUL_REGION = "ap-northeast-2"
$TOKYO_REGION = "ap-northeast-1"
$REPOSITORY = "newsugar-frontend"
$TAG = "prod"

$SEOUL_IMAGE = "$ACCOUNT_ID.dkr.ecr.$SEOUL_REGION.amazonaws.com/${REPOSITORY}:$TAG"
$TOKYO_IMAGE = "$ACCOUNT_ID.dkr.ecr.$TOKYO_REGION.amazonaws.com/${REPOSITORY}:$TAG"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Tokyo Region ECR Image Push Started" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Login to Seoul ECR
Write-Host "[1/5] Logging in to Seoul ECR..." -ForegroundColor Yellow
aws ecr get-login-password --region $SEOUL_REGION | docker login --username AWS --password-stdin "$ACCOUNT_ID.dkr.ecr.$SEOUL_REGION.amazonaws.com"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to login to Seoul ECR" -ForegroundColor Red
    exit 1
}
Write-Host "Seoul ECR login complete" -ForegroundColor Green
Write-Host ""

# 2. Pull image from Seoul region
Write-Host "[2/5] Pulling image from Seoul region..." -ForegroundColor Yellow
Write-Host "Image: $SEOUL_IMAGE" -ForegroundColor Gray
docker pull $SEOUL_IMAGE
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to pull image" -ForegroundColor Red
    exit 1
}
Write-Host "Image pull complete" -ForegroundColor Green
Write-Host ""

# 3. Tag for Tokyo region
Write-Host "[3/5] Tagging for Tokyo region..." -ForegroundColor Yellow
Write-Host "New tag: $TOKYO_IMAGE" -ForegroundColor Gray
docker tag $SEOUL_IMAGE $TOKYO_IMAGE
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to tag image" -ForegroundColor Red
    exit 1
}
Write-Host "Image tag complete" -ForegroundColor Green
Write-Host ""

# 4. Login to Tokyo ECR
Write-Host "[4/5] Logging in to Tokyo ECR..." -ForegroundColor Yellow
aws ecr get-login-password --region $TOKYO_REGION | docker login --username AWS --password-stdin "$ACCOUNT_ID.dkr.ecr.$TOKYO_REGION.amazonaws.com"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to login to Tokyo ECR" -ForegroundColor Red
    exit 1
}
Write-Host "Tokyo ECR login complete" -ForegroundColor Green
Write-Host ""

# 5. Push to Tokyo region
Write-Host "[5/5] Pushing to Tokyo region..." -ForegroundColor Yellow
Write-Host "Pushing to: $TOKYO_IMAGE" -ForegroundColor Gray
docker push $TOKYO_IMAGE
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to push image" -ForegroundColor Red
    exit 1
}
Write-Host "Image push complete" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Tokyo Region ECR Image Push Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Image Info:" -ForegroundColor White
Write-Host "  Region: $TOKYO_REGION (Tokyo)" -ForegroundColor Gray
Write-Host "  Image: $TOKYO_IMAGE" -ForegroundColor Gray
