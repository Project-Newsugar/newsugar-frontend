# ECR Push Script 사용 가이드

## 개요
프론트엔드 Docker 이미지를 빌드하고 AWS ECR에 푸시하는 스크립트입니다.

## 사용법

### 기본 명령어
```bash
./scripts/ecr-push.sh -e <dev|prod>
```

### 옵션
- `-e <ENV>`: 환경 설정 (dev 또는 prod) - **필수**
- `-r <REGION>`: AWS 리전 (기본값: ap-northeast-2)
- `-a <ACCOUNT_ID>`: AWS 계정 ID (기본값: 061039804626)

### 사용 예시
```bash
# 개발 환경 이미지 푸시
./scripts/ecr-push.sh -e dev

# 운영 환경 이미지 푸시
./scripts/ecr-push.sh -e prod

# 리전을 명시적으로 지정
./scripts/ecr-push.sh -e dev -r ap-northeast-2

# 모든 옵션 지정
./scripts/ecr-push.sh -e dev -r ap-northeast-2 -a 061039804626
```

## 실행 과정

### 1단계: 설정 초기화
- 명령어 옵션 파싱
- 환경 변수 설정
  - Region: `ap-northeast-2` (서울)
  - Account ID: `061039804626`
  - Environment: `dev` 또는 `prod`

### 2단계: AWS ECR 로그인
```bash
aws ecr get-login-password --region ap-northeast-2 | \
  docker login --username AWS --password-stdin 061039804626.dkr.ecr.ap-northeast-2.amazonaws.com
```

**동작:**
- AWS CLI로 ECR 로그인 토큰 발급
- Docker가 ECR 레지스트리에 인증

**실패 시:**
- `aws configure` 설정 확인 필요
- AWS 자격 증명 및 권한 확인

### 3단계: Docker 이미지 빌드

#### 3-1. 환경별 API URL 설정

**Dev 환경:**
```bash
API_URL="http://newsugar-backend-dev.default.svc.cluster.local/"
```
- 쿠버네티스 클러스터 내부 서비스 URL
- 향후 개발용 ALB 주소로 변경 필요

**Prod 환경:**
```bash
API_URL="https://api.newsugar.com/"
```
- 운영 환경 API 도메인

#### 3-2. Docker 빌드 실행
```bash
docker build \
  --build-arg VITE_API_URL="<API_URL>" \
  -t 061039804626.dkr.ecr.ap-northeast-2.amazonaws.com/newsugar-frontend:<ENV> \
  .
```

**동작:**
- 프로젝트 루트의 `Dockerfile` 사용
- `VITE_API_URL` 환경변수를 빌드타임에 주입
- 이미지 태그: `dev` 또는 `prod`

**생성되는 이미지:**
- Dev: `061039804626.dkr.ecr.ap-northeast-2.amazonaws.com/newsugar-frontend:dev`
- Prod: `061039804626.dkr.ecr.ap-northeast-2.amazonaws.com/newsugar-frontend:prod`

### 4단계: ECR에 이미지 푸시
```bash
docker push 061039804626.dkr.ecr.ap-northeast-2.amazonaws.com/newsugar-frontend:<ENV>
```

**동작:**
- 빌드된 Docker 이미지를 AWS ECR 레지스트리에 업로드
- 쿠버네티스에서 해당 이미지를 pull하여 배포 가능

### 5단계: 완료
```
=== Success! Image pushed to: <FULL_IMAGE_NAME> ===
Ready to deploy!
```

## 실행 결과 예시

### Dev 환경 실행
```bash
$ ./scripts/ecr-push.sh -e dev

=============================================
AWS ECR Image Push Tool (Frontend)
Region: ap-northeast-2
Account ID: 061039804626
Environment: dev
=============================================
=== 1. Logging in to AWS ECR... ===
Login Succeeded

=== 2. Building Docker Image (Frontend)... ===
Using API URL: http://newsugar-backend-dev.default.svc.cluster.local/
[+] Building 45.2s (12/12) FINISHED
...

=== 3. Pushing Image to ECR... ===
The push refers to repository [061039804626.dkr.ecr.ap-northeast-2.amazonaws.com/newsugar-frontend]
dev: digest: sha256:xxxxx size: 1234

=== Success! Image pushed to: 061039804626.dkr.ecr.ap-northeast-2.amazonaws.com/newsugar-frontend:dev ===
Ready to deploy!
```

## 사전 요구사항

### 1. AWS CLI 설치 및 설정
```bash
# AWS CLI 설치 확인
aws --version

# AWS 자격 증명 설정
aws configure
```

**필요한 정보:**
- AWS Access Key ID
- AWS Secret Access Key
- Default region: ap-northeast-2
- Default output format: json

### 2. Docker 설치 및 실행
```bash
# Docker 설치 확인
docker --version

# Docker 데몬 실행 확인
docker ps
```

### 3. API URL 설정 (중요!)
**스크립트 실행 전 반드시 백엔드 ALB 주소로 수정 필요**

`scripts/ecr-push.sh` 파일의 53-56번째 줄을 수정:
```bash
# 환경별 API URL 설정
if [ "$ENV" = "dev" ]; then
    API_URL="https://dev-alb-xxxxx.ap-northeast-2.elb.amazonaws.com/"  # 개발용 ALB 주소로 변경
elif [ "$ENV" = "prod" ]; then
    API_URL="https://prod-alb-xxxxx.ap-northeast-2.elb.amazonaws.com/"  # 운영용 ALB 주소로 변경
else
    echo "Error: Unknown environment '$ENV'"
    exit 1
fi
```

또는 도메인을 사용하는 경우:
```bash
if [ "$ENV" = "dev" ]; then
    API_URL="https://dev-api.newsugar.com/"
elif [ "$ENV" = "prod" ]; then
    API_URL="https://api.newsugar.com/"
```

### 4. AWS ECR 리포지토리 생성
- ECR에 `newsugar-frontend` 리포지토리가 미리 생성되어 있어야 함
- AWS Console > ECR > Repositories에서 확인

### 5. AWS 권한 설정
필요한 IAM 권한:
- `ecr:GetAuthorizationToken`
- `ecr:BatchCheckLayerAvailability`
- `ecr:PutImage`
- `ecr:InitiateLayerUpload`
- `ecr:UploadLayerPart`
- `ecr:CompleteLayerUpload`

## 트러블슈팅

### ECR 로그인 실패
```
Error: ECR Login failed.
Check if 'aws configure' is set up correctly.
```
**해결방법:**
- `aws configure` 재설정
- AWS 자격 증명 확인
- IAM 권한 확인

### Docker 빌드 실패
```
Error: Docker build failed.
```
**해결방법:**
- Dockerfile 문법 확인
- 빌드 컨텍스트 확인
- Docker 디스크 공간 확인

### Docker 푸시 실패
```
Error: Docker push failed.
```
**해결방법:**
- ECR 리포지토리 존재 여부 확인
- 네트워크 연결 확인
- ECR 권한 확인

## 환경별 설정 정보

| 환경 | 이미지 태그 | API URL | 용도 |
|------|------------|---------|------|
| dev | `dev` | `http://newsugar-backend-dev.default.svc.cluster.local/` | 개발/테스트 |
| prod | `prod` | `https://api.newsugar.com/` | 운영 서비스 |

## 중요: 스크립트 실행 전 필수 수정 사항

### API URL을 백엔드 ALB 주소로 변경
스크립트를 실행하기 전에 반드시 `scripts/ecr-push.sh` 파일을 열어서 백엔드 ALB 주소로 수정해야 합니다.

**수정 위치**: `scripts/ecr-push.sh` 53-56번째 줄

**현재 코드 (수정 필요):**
```bash
# 환경별 API URL 설정
if [ "$ENV" = "dev" ]; then
    API_URL="http://newsugar-backend-dev.default.svc.cluster.local/"  # 쿠버네티스 내부 주소
elif [ "$ENV" = "prod" ]; then
    API_URL="https://api.newsugar.com/"
```

**수정 방법:**

1. **백엔드 ALB DNS 주소를 확인**
   - AWS Console > EC2 > Load Balancers에서 ALB DNS 이름 복사
   - 예: `dev-alb-1234567890.ap-northeast-2.elb.amazonaws.com`

2. **스크립트 파일 수정**
```bash
# ALB 주소로 변경
if [ "$ENV" = "dev" ]; then
    API_URL="https://dev-alb-1234567890.ap-northeast-2.elb.amazonaws.com/"
elif [ "$ENV" = "prod" ]; then
    API_URL="https://prod-alb-9876543210.ap-northeast-2.elb.amazonaws.com/"
```

또는 도메인이 설정된 경우:
```bash
if [ "$ENV" = "dev" ]; then
    API_URL="https://dev-api.newsugar.com/"
elif [ "$ENV" = "prod" ]; then
    API_URL="https://api.newsugar.com/"
```

**주의사항:**
- 현재 dev 환경의 URL은 쿠버네티스 클러스터 내부 주소로 되어 있어, 브라우저에서 접근 불가능합니다
- 반드시 외부에서 접근 가능한 ALB 주소나 도메인으로 변경해야 프론트엔드가 정상 작동합니다

### 쿠버네티스 배포
이미지 푸시 후 쿠버네티스에서 배포:
```bash
kubectl set image deployment/newsugar-frontend \
  newsugar-frontend=061039804626.dkr.ecr.ap-northeast-2.amazonaws.com/newsugar-frontend:dev
```

## 관련 파일
- `scripts/ecr-push.sh`: 메인 스크립트
- `Dockerfile`: Docker 이미지 빌드 설정
- `k8s/`: 쿠버네티스 배포 설정 파일들
