# Newsugar Frontend - K8s 배포 가이드

## 1. 기본 정보

- **프로젝트**: Newsugar Frontend (React + Vite + Nginx)
- **Region**: 서울 (`ap-northeast-2`)
- **Account**: `0610-3980-4626`
- **ECR Repository**: `newsugar-frontend`
- **배포 방식**: ArgoCD GitOps

## 2. 환경별 구성

| 구분             | Dev 환경      | Prod 환경                     |
| ---------------- | ------------- | ----------------------------- |
| Pod 복제본 수    | 1개           | 2개 (고가용성)                |
| CPU 요청/제한    | 100m / 200m   | 200m / 500m                   |
| 메모리 요청/제한 | 128Mi / 256Mi | 256Mi / 512Mi                 |
| HPA 범위         | 1~3개         | 2~10개                        |
| HPA 임계치       | CPU 70%       | CPU 70%                       |
| Health Check     | -             | Liveness/Readiness Probe 설정 |
| 이미지 태그      | `dev`         | `prod`                        |

## 3. 사전 준비

### 3.1. AWS CLI 설정

```bash
aws configure
# Access Key ID, Secret Access Key, Region(ap-northeast-2) 입력
```

### 3.2. ECR 레포지토리 생성 (최초 1회)

```bash
aws ecr create-repository \
  --repository-name newsugar-frontend \
  --region ap-northeast-2
```

### 3.3. kubectl 설정

```bash
# EKS 클러스터 연결
aws eks update-kubeconfig --region ap-northeast-2 --name newsugar-prod-eks

# 연결 확인
kubectl get nodes
```

### 3.4. ArgoCD Application 등록 (최초 1회)

```bash
# Dev 환경
kubectl apply -f k8s/argocd-app-dev.yaml

# Prod 환경
kubectl apply -f k8s/argocd-app-prod.yaml
```

## 4. 배포 실행

### 4.1. ECR 이미지 빌드 & 푸시

스크립트에 AWS 계정 정보가 기본값으로 설정되어 있습니다.

```bash
# 스크립트 실행 권한 부여 (최초 1회)
chmod +x scripts/ecr-push.sh

# Dev 환경 배포
./scripts/ecr-push.sh -e dev
# → nginx.conf 사용 (프로덕션 설정)

# Prod 환경 배포
./scripts/ecr-push.sh -e prod
# → nginx.conf 사용 (프로덕션 설정)

# Local 환경 배포
.\scripts\test-local.ps1
# → nginx.local.conf 사용
```

### 4.2. ArgoCD 자동 배포

ECR에 이미지를 푸시하면 **ArgoCD가 자동으로 감지하여 EKS에 배포**합니다.

- ArgoCD는 GitHub 레포지토리의 `k8s/dev` 또는 `k8s/prod` 폴더를 모니터링
- `syncPolicy.automated`가 설정되어 있어 변경 감지 시 자동 배포
- `imagePullPolicy: Always`로 설정되어 최신 이미지 자동 적용

### 4.3. 수동 배포 (ArgoCD 없이)

ArgoCD를 사용하지 않는 경우:

```bash
# Dev 환경
kubectl apply -f k8s/dev/

# Prod 환경
kubectl apply -f k8s/prod/
```

## 5. 배포 확인

### 5.1. Pod 상태 확인

```bash
# Dev 환경
kubectl get pods -l app=newsugar-frontend,env=dev

# Prod 환경
kubectl get pods -l app=newsugar-frontend,env=prod

# 상세 정보
kubectl describe pod <pod-name>
```

### 5.2. Service 확인 (LoadBalancer URL)

```bash
# Dev 환경
kubectl get svc newsugar-frontend-service-dev

# Prod 환경
kubectl get svc newsugar-frontend-service-prod

# External IP 확인
kubectl get svc -o wide
```

### 5.3. HPA (Auto Scaling) 확인

```bash
# Dev 환경
kubectl get hpa newsugar-frontend-hpa-dev

# Prod 환경
kubectl get hpa newsugar-frontend-hpa-prod
```

### 5.4. ArgoCD 상태 확인

```bash
# Application 목록
kubectl get applications -n argocd

# 특정 앱 상태
kubectl describe application newsugar-frontend-dev -n argocd
kubectl describe application newsugar-frontend-prod -n argocd
```

## 6. 로그 및 디버깅

### 6.1. 로그 확인

```bash
# 실시간 로그 확인
kubectl logs -f <pod-name>

# 최근 100줄 로그
kubectl logs --tail=100 <pod-name>

# 이전 Pod 로그 (재시작된 경우)
kubectl logs <pod-name> --previous
```

### 6.2. Pod 접속

```bash
# Pod 내부 접속 (디버깅용)
kubectl exec -it <pod-name> -- sh
```

### 6.3. 이벤트 확인

```bash
# 네임스페이스 이벤트
kubectl get events --sort-by=.metadata.creationTimestamp

# 특정 Pod 이벤트
kubectl describe pod <pod-name>
```

## 7. 롤백 및 재배포

### 7.1. 이미지 강제 재배포

같은 태그로 푸시했는데 변경이 반영되지 않는 경우:

```bash
# Dev 환경
kubectl rollout restart deployment/newsugar-frontend-dev

# Prod 환경
kubectl rollout restart deployment/newsugar-frontend-prod
```

### 7.2. 배포 히스토리 확인

```bash
kubectl rollout history deployment/newsugar-frontend-prod
```

### 7.3. 이전 버전으로 롤백

```bash
# 바로 이전 버전으로 롤백
kubectl rollout undo deployment/newsugar-frontend-prod

# 특정 리비전으로 롤백
kubectl rollout undo deployment/newsugar-frontend-prod --to-revision=2
```

## 8. 스케일링

### 8.1. 수동 스케일링

```bash
# Replica 수 변경 (일시적)
kubectl scale deployment/newsugar-frontend-prod --replicas=5
```

### 8.2. HPA 수정

```bash
# HPA 설정 편집
kubectl edit hpa newsugar-frontend-hpa-prod

# 또는 YAML 파일 수정 후 재적용
kubectl apply -f k8s/prod/hpa.yaml
```

## 9. 트러블슈팅

### 9.1. Pod가 시작하지 않는 경우

```bash
# Pod 상태 확인
kubectl get pods
kubectl describe pod <pod-name>

# 일반적인 원인:
# - ImagePullBackOff: ECR 권한 문제 또는 이미지 태그 오류
# - CrashLoopBackOff: 컨테이너 시작 실패 (nginx 설정 오류)
```

### 9.2. LoadBalancer가 Pending 상태인 경우

```bash
kubectl describe svc newsugar-frontend-service-dev

# AWS Load Balancer Controller 설치 필요할 수 있음
```

### 9.3. ArgoCD 동기화 실패

```bash
# ArgoCD 앱 상태 확인
kubectl get applications -n argocd

# 수동 동기화
kubectl patch application newsugar-frontend-dev -n argocd \
  --type merge -p '{"metadata":{"annotations":{"argocd.argoproj.io/refresh":"normal"}}}'
```

## 10. 보안 및 모범 사례

### 10.1. 이미지 스캔

```bash
# ECR 이미지 취약점 스캔
aws ecr start-image-scan \
  --repository-name newsugar-frontend \
  --image-id imageTag=prod \
  --region ap-northeast-2
```

### 10.2. Resource Limits 설정

- 항상 `requests`와 `limits` 설정
- Prod 환경은 충분한 리소스 할당

### 10.3. Health Check 설정

- Prod 환경은 `livenessProbe`, `readinessProbe` 필수
- 적절한 `initialDelaySeconds` 설정 (Nginx는 빠르게 시작)

## 11. 참고 사항

- **이미지 태그 전략**: `dev`, `prod` 고정 태그 사용 (현재)
  - 향후 버전 관리를 위해 `v1.0.0`, `v1.0.1` 형태 권장
- **DR (재해 복구)**: 도쿄 리전 확장 시 `k8s/dr/` 폴더 추가 고려
- **모니터링**: Prometheus + Grafana 연동 권장 (별도 문서 참조)
- **비용 최적화**: Dev 환경은 필요시에만 실행 고려
