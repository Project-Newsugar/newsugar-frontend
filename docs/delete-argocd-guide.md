# ArgoCD 제거 가이드

ArgoCD Application 및 ArgoCD 자체를 제거하는 방법을 설명합니다.

---

## 사전 확인 사항

- AWS CLI 설정 완료
- kubectl 설치 완료
- 적절한 EKS 클러스터에 연결되어 있는지 확인

---

## 1. 현재 ArgoCD 상태 확인

### 1-1. 현재 연결된 클러스터 확인
```powershell
kubectl config current-context
```

### 1-2. ArgoCD Application 목록 확인
```powershell
# ArgoCD에 등록된 애플리케이션 확인
kubectl get application -n argocd

# 모든 네임스페이스에서 확인
kubectl get application -A
```

### 1-3. ArgoCD 파드 상태 확인
```powershell
kubectl get pods -n argocd
```

---

## 2. 제거 방법별 가이드

### 방법 A: ArgoCD Application만 제거 (파드는 유지)

ArgoCD의 관리에서만 제외하고, 실제 배포된 리소스는 유지됩니다.

```powershell
# 특정 Application 삭제
kubectl delete application newsugar-frontend-prod-tokyo -n argocd

# 모든 Application 삭제
kubectl delete application --all -n argocd
```

**사용 시나리오:**
- ArgoCD 관리에서만 제외하고 싶을 때
- 배포된 서비스는 계속 실행하고 싶을 때

---

### 방법 B: ArgoCD Application과 배포된 리소스 모두 제거

ArgoCD Application과 실제 배포된 파드/서비스를 함께 제거합니다.

```powershell
# 1. ArgoCD Application 삭제
kubectl delete application newsugar-frontend-prod-tokyo -n argocd

# 2. 배포된 리소스 직접 삭제
kubectl delete -f k8s/prod-tokyo/

# 또는 개별 리소스 삭제
kubectl delete deployment newsugar-frontend-prod -n default
kubectl delete service newsugar-frontend-service-prod -n default
kubectl delete ingress newsugar-frontend-ingress-prod -n default
kubectl delete hpa newsugar-frontend-hpa-prod -n default
```

**사용 시나리오:**
- 배포를 완전히 중단하고 싶을 때
- 리소스를 정리하고 새로 배포할 때

---

### 방법 C: ArgoCD 전체 제거

ArgoCD 자체를 클러스터에서 완전히 제거합니다.

```powershell
# 1. 모든 ArgoCD Application 삭제
kubectl delete application --all -n argocd

# 2. ArgoCD 설치 매니페스트 삭제
kubectl delete -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# 3. ArgoCD namespace 삭제
kubectl delete namespace argocd
```

**사용 시나리오:**
- ArgoCD를 더 이상 사용하지 않을 때
- ArgoCD를 재설치해야 할 때
- 클러스터를 완전히 정리할 때

---

## 3. 리전별 ArgoCD 제거

### 3-1. 서울 리전 (ap-northeast-2) ArgoCD 제거

```powershell
# 1. 서울 EKS로 전환
aws eks update-kubeconfig --region ap-northeast-2 --name newsugar-prod-eks

# 2. 현재 컨텍스트 확인
kubectl config current-context
# 출력: arn:aws:eks:ap-northeast-2:061039804626:cluster/newsugar-prod-eks

# 3. ArgoCD 상태 확인
kubectl get application -n argocd

# 4. ArgoCD Application 삭제
kubectl delete application --all -n argocd

# 5. ArgoCD 전체 삭제
kubectl delete -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# 6. ArgoCD namespace 삭제
kubectl delete namespace argocd
```

### 3-2. 도쿄 리전 (ap-northeast-1) ArgoCD 제거

```powershell
# 1. 도쿄 EKS로 전환
aws eks update-kubeconfig --region ap-northeast-1 --name newsugar-dr-eks

# 2. 현재 컨텍스트 확인
kubectl config current-context
# 출력: arn:aws:eks:ap-northeast-1:061039804626:cluster/newsugar-dr-eks

# 3. ArgoCD 상태 확인
kubectl get application -n argocd

# 4. ArgoCD Application 삭제
kubectl delete application --all -n argocd

# 5. ArgoCD 전체 삭제
kubectl delete -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# 6. ArgoCD namespace 삭제
kubectl delete namespace argocd
```

---

## 4. 삭제 확인

### 4-1. ArgoCD Application 확인
```powershell
# Application이 없어야 정상
kubectl get application -n argocd
```

**기대 결과:**
```
No resources found in argocd namespace.
```

또는 namespace 자체가 없다는 에러:
```
Error from server (NotFound): namespaces "argocd" not found
```

### 4-2. ArgoCD Namespace 확인
```powershell
kubectl get namespace argocd
```

**기대 결과:**
```
Error from server (NotFound): namespaces "argocd" not found
```

### 4-3. 모든 리소스 확인
```powershell
# argocd namespace의 모든 리소스 확인
kubectl get all -n argocd
```

---

## 5. 배포된 애플리케이션 리소스 확인

ArgoCD를 제거해도 실제 배포된 파드/서비스는 남아있을 수 있습니다.

### 5-1. 현재 실행 중인 파드 확인
```powershell
kubectl get pods -n default
```

### 5-2. 모든 리소스 확인
```powershell
kubectl get all -n default
```

### 5-3. 필요 시 애플리케이션 리소스 삭제
```powershell
# 도쿄 리전 배포 제거
kubectl delete -f k8s/prod-tokyo/

# 서울 리전 배포 제거 (있다면)
kubectl delete -f k8s/prod/
```

---

## 6. 문제 해결 (Troubleshooting)

### 문제 1: ArgoCD namespace가 Terminating 상태에서 멈춤

**확인:**
```powershell
kubectl get namespace argocd
```

**해결:**
```powershell
# Finalizer 제거
kubectl get namespace argocd -o json | jq '.spec.finalizers = []' | kubectl replace --raw "/api/v1/namespaces/argocd/finalize" -f -

# 또는 수동으로 finalizer 제거
kubectl edit namespace argocd
# spec.finalizers 항목을 삭제하고 저장
```

### 문제 2: Application 삭제가 안 됨

**확인:**
```powershell
kubectl get application -n argocd -o yaml
```

**해결:**
```powershell
# Finalizer 제거 후 삭제
kubectl patch application <application-name> -n argocd -p '{"metadata":{"finalizers":[]}}' --type=merge
kubectl delete application <application-name> -n argocd
```

### 문제 3: ArgoCD 리소스 삭제 시 timeout 발생

**해결:**
```powershell
# 강제 삭제
kubectl delete -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml --grace-period=0 --force

# 또는 개별 리소스 강제 삭제
kubectl delete pods --all -n argocd --grace-period=0 --force
```

---

## 요약: 빠른 제거 명령어

### 서울 리전 ArgoCD 완전 제거
```powershell
# 1. 서울 EKS 연결
aws eks update-kubeconfig --region ap-northeast-2 --name newsugar-prod-eks

# 2. 확인
kubectl get application -n argocd

# 3. 제거
kubectl delete application --all -n argocd
kubectl delete -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
kubectl delete namespace argocd

# 4. 확인
kubectl get namespace argocd
```

### 도쿄 리전 ArgoCD 완전 제거
```powershell
# 1. 도쿄 EKS 연결
aws eks update-kubeconfig --region ap-northeast-1 --name newsugar-dr-eks

# 2. 확인
kubectl get application -n argocd

# 3. 제거
kubectl delete application --all -n argocd
kubectl delete -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
kubectl delete namespace argocd

# 4. 확인
kubectl get namespace argocd
```

---

## 참고 정보

### 주요 ArgoCD Application 이름
- **도쿄 프론트엔드:** newsugar-frontend-prod-tokyo
- **서울 프론트엔드:** (있다면) newsugar-frontend-prod

### 클러스터 정보
- **서울 Prod:** newsugar-prod-eks (ap-northeast-2)
- **도쿄 DR:** newsugar-dr-eks (ap-northeast-1)

### 관련 파일
- ArgoCD Application 매니페스트: `k8s/argocd-app-prod-tokyo.yaml`
- 배포 매니페스트: `k8s/prod-tokyo/*.yaml`

---

**작성일:** 2026-01-06
**관련 문서:** [Tokyo Deployment Guide](tokyo-deployment-guide.md)
