# PowerShell ECR Push Script for Frontend
param(
    [string]$Environment = "dev",
    [string]$Region = "ap-northeast-2",
    [string]$AccountId = "061039804626"
)

$RepoName = "newsugar-frontend"
$ImageTag = $Environment
$EcrUri = "$AccountId.dkr.ecr.$Region.amazonaws.com/$RepoName"
$FullImageName = "${EcrUri}:${ImageTag}"

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "AWS ECR Image Push Tool (Frontend)" -ForegroundColor Cyan
Write-Host "Region: $Region" -ForegroundColor Yellow
Write-Host "Account ID: $AccountId" -ForegroundColor Yellow
Write-Host "Environment: $Environment" -ForegroundColor Yellow
Write-Host "=============================================" -ForegroundColor Cyan

# 환경별 API URL 설정
$ApiUrl = switch ($Environment) {
    "dev" { "http://k8s-default-newsugar-b56f5d85c3-55ff014973bc1e0a.elb.ap-northeast-2.amazonaws.com/" }
    "prod" { "http://k8s-default-newsugar-b56f5d85c3-55ff014973bc1e0a.elb.ap-northeast-2.amazonaws.com/" }
    default {
        Write-Host "Error: Unknown environment '$Environment'" -ForegroundColor Red
        Write-Host "Valid options: dev, prod" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host ""
Write-Host "=== 1. Logging in to AWS ECR... ===" -ForegroundColor Green
try {
    $password = aws ecr get-login-password --region $Region
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to get ECR login password"
    }

    $password | docker login --username AWS --password-stdin "$AccountId.dkr.ecr.$Region.amazonaws.com"
    if ($LASTEXITCODE -ne 0) {
        throw "Docker login failed"
    }
    Write-Host "✓ Successfully logged in to ECR" -ForegroundColor Green
}
catch {
    Write-Host "Error: ECR Login failed." -ForegroundColor Red
    Write-Host "Check if 'aws configure' is set up correctly." -ForegroundColor Yellow
    Write-Host "Run: aws configure" -ForegroundColor Gray
    exit 1
}

Write-Host ""
Write-Host "=== 2. Building Docker Image (Frontend)... ===" -ForegroundColor Green
Write-Host "Using API URL: $ApiUrl" -ForegroundColor Yellow

docker build `
    --build-arg VITE_API_URL="$ApiUrl" `
    --build-arg NGINX_CONF=nginx.conf `
    -t $FullImageName `
    .

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Docker build failed." -ForegroundColor Red
    exit 1
}
Write-Host "✓ Docker image built successfully" -ForegroundColor Green

Write-Host ""
Write-Host "=== 3. Pushing Image to ECR... ===" -ForegroundColor Green
docker push $FullImageName

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Docker push failed." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "✅ Success! Image pushed to:" -ForegroundColor Green
Write-Host "   $FullImageName" -ForegroundColor Yellow
Write-Host "Ready to deploy!" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Cyan
