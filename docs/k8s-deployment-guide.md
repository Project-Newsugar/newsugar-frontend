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

### 3.2. ECR 레포지토리 생성 (최초 1회) - 이건 인프라 담당에서 해줌

```bash
aws ecr create-repository \
  --repository-name newsugar-frontend \
  --region ap-northeast-2
```

## 4. 신규 EKS 클러스터 배포 (처음부터 전체 배포)

새로운 EKS 클러스터를 생성했을 때는 다음 순서대로 배포합니다.

### Step 0: EKS 클러스터 연결

```bash
# EKS 클러스터에 kubectl 연결
aws eks update-kubeconfig --region ap-northeast-2 --name newsugar-prod-eks

# 연결 확인
kubectl get nodes
```

### Step 1: Nginx Ingress Controller 설치

```bash
# Nginx Ingress Controller 설치 (공식 manifest)
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.11.1/deploy/static/provider/aws/deploy.yaml
```

### Step 2: Service를 internet-facing으로 변경

```bash
# Service를 internet-facing LoadBalancer로 변경
kubectl apply -f k8s/infra/ingress-nginx-controller.yaml
```

### Step 3: 도커 이미지 빌드 및 ECR 푸시

GitHub Actions를 통해 이미지를 생성합니다.

```bash
# 변경사항이 있는 경우 커밋 후 푸시
git add .
git commit -m "feat: initial deployment"
git push origin develop

# 변경사항이 없는 경우 빈 커밋으로 트리거
git commit --allow-empty -m "trigger: initial image build for new EKS cluster"
git push origin develop
```

### Step 4: ArgoCD Application 등록

```bash
# Prod 환경 ArgoCD Application 등록
kubectl apply -f k8s/argocd-app-prod.yaml
```

ArgoCD가 자동으로 나머지 리소스(Deployment, Service, HPA 등)를 배포합니다.

## 5. 배포 확인

### 5.1. Pod 상태 확인

```bash
# Prod 환경
kubectl get pods -l app=newsugar-frontend,env=prod

# 상세 정보
kubectl describe pod <pod-name>
```

### 5.2. Service 확인 (LoadBalancer URL)

```bash
# Prod 환경
kubectl get svc newsugar-frontend-service-prod

# External IP 확인
kubectl get svc -o wide
```

### 5.3. HPA (Auto Scaling) 확인

```bash
# Prod 환경
kubectl get hpa newsugar-frontend-hpa-prod
```

### 5.4. ArgoCD 상태 확인 및 접속

```bash
# Application 목록 확인
kubectl get applications -n argocd

# 특정 앱 상태 확인
kubectl describe application newsugar-frontend-prod -n argocd
```

#### ArgoCD UI 접속 방법

```bash
# ArgoCD 초기 admin 패스워드 확인 (Windows PowerShell)
kubectl get secret argocd-initial-admin-secret -n argocd -o jsonpath="{.data.password}" | ForEach-Object { [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($_)) }

# ArgoCD UI 포트포워딩
kubectl port-forward svc/argocd-server -n argocd 8080:443

# 브라우저에서 접속
# URL: https://localhost:8080
# Username: admin
# Password: 위에서 확인한 패스워드
```

> **참고**: 포트포워딩은 터미널을 열어둔 상태에서만 유지됩니다. 접속을 종료하려면 `Ctrl+C`를 누르세요.

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
kubectl describe svc newsugar-frontend-service-prod

# AWS Load Balancer Controller 설치 필요할 수 있음
```

### 9.3. ArgoCD 동기화 실패

```bash
# ArgoCD 앱 상태 확인
kubectl get applications -n argocd

# 수동 동기화
kubectl patch application newsugar-frontend-prod -n argocd \
  --type merge -p '{"metadata":{"annotations":{"argocd.argoproj.io/refresh":"normal"}}}'
```

## 10. 수동 배포 (ArgoCD 없이)

ArgoCD를 사용하지 않는 경우:

```bash
# Prod 환경
kubectl apply -f k8s/prod/
```

## 11. 참고 사항

- **ArgoCD 자동 배포**: `syncPolicy.automated` 설정으로 Git 변경사항 자동 감지 및 배포
- **이미지 자동 업데이트**: `imagePullPolicy: Always`로 최신 이미지 자동 적용
- **이미지 태그 전략**: `dev`, `prod` 고정 태그 사용 (현재)
  - 향후 버전 관리를 위해 `v1.0.0`, `v1.0.1` 형태 권장
- **모니터링**: Prometheus + Grafana 연동 권장 (별도 문서 참조)
- **비용 최적화**: Dev 환경은 필요시에만 실행 고려
