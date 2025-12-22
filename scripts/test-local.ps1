# PowerShell 로컬 Docker 이미지 테스트 스크립트
param(
    [string]$ApiUrl = "http://host.docker.internal:8080",
    [int]$Port = 3000
)

$ImageName = "newsugar-frontend:local-test"
$ContainerName = "newsugar-frontend-test"

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "Local Docker Image Test" -ForegroundColor Cyan
Write-Host "API URL: $ApiUrl" -ForegroundColor Yellow
Write-Host "Port: $Port" -ForegroundColor Yellow
Write-Host "=============================================" -ForegroundColor Cyan

# 기존 컨테이너 정리
Write-Host ""
Write-Host "=== Cleaning up existing containers... ===" -ForegroundColor Green
docker rm -f $ContainerName 2>$null

# 이미지 빌드
Write-Host ""
Write-Host "=== Building Docker image... ===" -ForegroundColor Green
docker build `
    --build-arg VITE_API_URL="$ApiUrl" `
    -t $ImageName `
    .

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Docker build failed." -ForegroundColor Red
    exit 1
}

# 빌드된 파일에서 API URL 확인
Write-Host ""
Write-Host "=== Verifying API URL in built files... ===" -ForegroundColor Green
docker run --rm $ImageName sh -c "cat /usr/share/nginx/html/assets/index-*.js" | Select-String -Pattern "http[s]?://[^`"']*" | Select-Object -First 3

# 컨테이너 실행
Write-Host ""
Write-Host "=== Starting container... ===" -ForegroundColor Green
docker run -d `
    --name $ContainerName `
    -p "${Port}:80" `
    $ImageName

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to start container." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "✅ Success!" -ForegroundColor Green
Write-Host "Frontend is running at: http://localhost:$Port" -ForegroundColor Yellow
Write-Host ""
Write-Host "To view logs:" -ForegroundColor White
Write-Host "  docker logs -f $ContainerName" -ForegroundColor Gray
Write-Host ""
Write-Host "To stop:" -ForegroundColor White
Write-Host "  docker rm -f $ContainerName" -ForegroundColor Gray
Write-Host "=============================================" -ForegroundColor Cyan
