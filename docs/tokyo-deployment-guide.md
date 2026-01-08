# Tokyo Region Deployment Guide

도쿄 리전(ap-northeast-1)에 프론트엔드를 배포하는 전체 절차입니다.

---

## 사전 준비 사항

- AWS CLI 설정 완료
- Docker Desktop 실행 중
- kubectl 설치 완료
- Git repository 접근 권한

---

## 1. 도쿄 ECR에 이미지 푸시

### 1-1. Docker Desktop 실행 확인
```powershell
# Docker 상태 확인
docker ps
```

### 1-2. ECR 이미지 푸시 스크립트 실행
```powershell
# 프로젝트 루트 디렉토리에서
.\scripts\ecr-push-tokyo.ps1
```

**스크립트 동작:**
1. 서울 ECR 로그인
2. 서울 리전에서 이미지 pull
3. 도쿄 리전용으로 태그
4. 도쿄 ECR 로그인
5. 도쿄 리전으로 push

---

## 2. Git 커밋 & 푸시

```powershell
# 변경사항 확인
git status

# 파일 추가 (최초 배포 시)
git add k8s/argocd-app-prod-tokyo.yaml
git add k8s/prod-tokyo/
git add scripts/ecr-push-tokyo.ps1

# 또는 변경된 매니페스트만 추가 (재배포 시)
git add k8s/prod-tokyo/*.yaml

# 커밋
git commit -m "deploy: Update Tokyo region deployment"

# 푸시
git push origin main
```

---

## 3. 도쿄 EKS 클러스터 연결

### 3-1. 현재 컨텍스트 확인
```powershell
kubectl config get-contexts
```

### 3-2. 도쿄 DR EKS로 전환
```powershell
aws eks update-kubeconfig --region ap-northeast-1 --name newsugar-dr-eks
```

### 3-3. 전환 확인
```powershell
kubectl config current-context
# 출력: arn:aws:eks:ap-northeast-1:061039804626:cluster/newsugar-dr-eks
```

---

## 4. aws-auth ConfigMap 확인 (최초 1회만)

### 4-1. 현재 설정 확인
```powershell
kubectl get configmap aws-auth -n kube-system -o yaml
```

### 4-2. DR 노드 역할 확인
다음 내용이 있는지 확인:
```yaml
- rolearn: arn:aws:iam::061039804626:role/newsugar-dr-eks-node-role
  username: system:node:{{EC2PrivateDNSName}}
  groups:
    - system:bootstrappers
    - system:nodes
```

**없다면 추가:**
```powershell
kubectl patch configmap aws-auth -n kube-system --type merge -p '{"data":{"mapRoles":"- rolearn: arn:aws:iam::061039804626:role/newsugar-prod-eks-node-role\n  username: system:node:{{EC2PrivateDNSName}}\n  groups:\n    - system:bootstrappers\n    - system:nodes\n- rolearn: arn:aws:iam::061039804626:role/newsugar-dr-eks-node-role\n  username: system:node:{{EC2PrivateDNSName}}\n  groups:\n    - system:bootstrappers\n    - system:nodes\n"}}'
```

---

## 5. 노드 상태 확인

```powershell
# 노드 목록 확인
kubectl get nodes

# 노드 상세 정보 확인 (리전 포함)
kubectl get nodes -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.metadata.labels.topology\.kubernetes\.io/region}{"\t"}{.metadata.labels.topology\.kubernetes\.io/zone}{"\n"}{end}'
```

**기대 결과:**
```
NAME                                               STATUS   ROLES    AGE   VERSION
ip-172-16-10-126.ap-northeast-1.compute.internal   Ready    <none>   10m   v1.34.2-eks-ecaa3a6
ip-172-16-11-223.ap-northeast-1.compute.internal   Ready    <none>   10m   v1.34.2-eks-ecaa3a6
```

**노드가 NotReady 또는 없는 경우:**
- aws-auth ConfigMap 재확인 (섹션 4)
- 10-30초 대기 후 다시 확인

---

## 6. Nginx Ingress Controller 설치 (최초 1회만)

### 6-1. 공식 Nginx Ingress Controller 설치
```powershell
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.11.1/deploy/static/provider/aws/deploy.yaml
```

### 6-2. Service를 internet-facing으로 변경
```powershell
kubectl apply -f k8s/infra/ingress-nginx-controller.yaml
```

**이 파일의 주요 설정:**
- AWS NLB(Network Load Balancer) 사용
- `internet-facing` 스킴으로 외부 접근 허용
- HTTP(80), HTTPS(443) 포트 오픈

### 6-3. Ingress Controller 확인
```powershell
# 파드 상태 확인
kubectl get pods -n ingress-nginx

# 서비스 확인 (LoadBalancer 생성 대기)
kubectl get svc -n ingress-nginx
```

**기대 결과:**
```
NAME                                 TYPE           EXTERNAL-IP                                                                    PORT(S)
ingress-nginx-controller             LoadBalancer   a1234567890abcdef1234567890abcdef-1234567890.ap-northeast-1.elb.amazonaws.com   80:xxxxx/TCP,443:xxxxx/TCP
```

> **참고:** EXTERNAL-IP가 `<pending>`에서 실제 도메인으로 변경되기까지 1-2분 소요됩니다.

---

## 7. 애플리케이션 배포

### 방법 A: ArgoCD 사용 (권장)

#### 7-1. ArgoCD 설치 확인
```powershell
kubectl get pods -n argocd
```

**설치되지 않은 경우:**
```powershell
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# ArgoCD 파드가 Ready 될 때까지 대기 (1-2분)
kubectl get pods -n argocd -w
```

#### 7-2. ArgoCD Application 등록
```powershell
kubectl apply -f k8s/argocd-app-prod-tokyo.yaml
```

#### 7-3. ArgoCD Application 상태 확인
```powershell
kubectl get application newsugar-frontend-prod-tokyo -n argocd
```

#### 7-4. 동기화 (필요 시)
```powershell
# ArgoCD CLI 사용
argocd app sync newsugar-frontend-prod-tokyo

# 또는 재등록으로 강제 동기화
kubectl delete application newsugar-frontend-prod-tokyo -n argocd
kubectl apply -f k8s/argocd-app-prod-tokyo.yaml
```

### 방법 B: kubectl 직접 배포

```powershell
# 전체 매니페스트 적용
kubectl apply -f k8s/prod-tokyo/

# 또는 개별 파일 적용
kubectl apply -f k8s/prod-tokyo/deployment.yaml
kubectl apply -f k8s/prod-tokyo/service.yaml
kubectl apply -f k8s/prod-tokyo/ingress.yaml
kubectl apply -f k8s/prod-tokyo/hpa.yaml
```

---

## 8. 배포 확인

### 8-1. 파드 상태 확인
```powershell
# 기본 확인
kubectl get pods -n default

# 상세 정보 (노드 포함)
kubectl get pods -n default -o wide

# 특정 파드 상세
kubectl describe pod <pod-name> -n default
```

**기대 결과:**
```
NAME                                      READY   STATUS             RESTARTS   AGE
newsugar-frontend-prod-7bd58c6b86-xxxxx   0/1     CrashLoopBackOff   N          Xm
```
> **참고:** 백엔드가 배포되지 않았다면 CrashLoopBackOff는 정상입니다.

### 8-2. 전체 리소스 확인
```powershell
kubectl get all -n default
```

### 8-3. 파드 로그 확인
```powershell
kubectl logs <pod-name> -n default
```

**예상 에러 (백엔드 미배포 시):**
```
nginx: [emerg] host not found in upstream "newsugar-backend-service-prod"
```

### 8-4. 리전 확인
```powershell
# 파드가 실행 중인 노드의 리전 확인
kubectl get pod <pod-name> -n default -o jsonpath='{.spec.nodeName}' && echo ""
kubectl get node $(kubectl get pod <pod-name> -n default -o jsonpath='{.spec.nodeName}') -o jsonpath='Region: {.metadata.labels.topology\.kubernetes\.io/region}{"\n"}Zone: {.metadata.labels.topology\.kubernetes\.io/zone}{"\n"}'
```

**기대 결과:**
```
Region: ap-northeast-1
Zone: ap-northeast-1a
```

---

## 9. 서울 클러스터로 복귀

```powershell
# 서울 EKS로 전환
aws eks update-kubeconfig --region ap-northeast-2 --name newsugar-prod-eks

# 전환 확인
kubectl config current-context
```

---

## 문제 해결 (Troubleshooting)

### 문제 1: 노드가 NotReady 상태
**확인:**
```powershell
kubectl describe node <node-name>
```

**해결:**
1. aws-auth ConfigMap에 DR 노드 역할이 있는지 확인 (섹션 4)
2. 노드 재시작:
```powershell
kubectl delete node <node-name>
# Auto Scaling Group이 자동으로 새 노드 생성 (1-2분 대기)
```

### 문제 2: 파드가 Pending 상태
**확인:**
```powershell
kubectl describe pod <pod-name> -n default
```

**원인별 해결:**
- **Taint 문제:** 섹션 5 참고
- **리소스 부족:** 노드 스케일 업 또는 파드 리소스 제한 조정
- **이미지 Pull 실패:** ECR 이미지 확인 (섹션 1)

### 문제 3: ArgoCD Application이 동기화되지 않음
```powershell
# Application 상세 확인
kubectl describe application newsugar-frontend-prod-tokyo -n argocd

# 재등록
kubectl delete application newsugar-frontend-prod-tokyo -n argocd
kubectl apply -f k8s/argocd-app-prod-tokyo.yaml
```

### 문제 4: Ingress 배포 실패 (Webhook 오류)
```powershell
# Webhook 설정 삭제 (임시)
kubectl delete validatingwebhookconfiguration aws-load-balancer-webhook
kubectl delete mutatingwebhookconfiguration aws-load-balancer-webhook

# 재배포
kubectl apply -f k8s/prod-tokyo/ingress.yaml
```

---

## 요약: 빠른 재배포 명령어

```powershell
# 1. ECR 푸시
.\scripts\ecr-push-tokyo.ps1

# 2. Git 푸시
git add . && git commit -m "deploy: Update Tokyo deployment" && git push

# 3. 도쿄 EKS 연결
aws eks update-kubeconfig --region ap-northeast-1 --name newsugar-dr-eks

# 4. 노드 확인
kubectl get nodes

# 5. Nginx Ingress Controller 설치 (최초 1회만)
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.11.1/deploy/static/provider/aws/deploy.yaml
kubectl apply -f k8s/infra/ingress-nginx-controller.yaml

# 6. 배포 (ArgoCD)
kubectl apply -f k8s/argocd-app-prod-tokyo.yaml

# 또는 배포 (kubectl 직접)
kubectl apply -f k8s/prod-tokyo/

# 7. 확인
kubectl get pods -n default -o wide

# 8. 서울 복귀
aws eks update-kubeconfig --region ap-northeast-2 --name newsugar-prod-eks
```

---

## 참고 정보

### 리전 정보
- **서울:** ap-northeast-2
- **도쿄:** ap-northeast-1

### 클러스터 이름
- **서울 Prod:** newsugar-prod-eks
- **도쿄 DR:** newsugar-dr-eks

### ECR 리포지토리
- **서울:** 061039804626.dkr.ecr.ap-northeast-2.amazonaws.com/newsugar-frontend
- **도쿄:** 061039804626.dkr.ecr.ap-northeast-1.amazonaws.com/newsugar-frontend

### 주요 파일
- ArgoCD Application: `k8s/argocd-app-prod-tokyo.yaml`
- 매니페스트: `k8s/prod-tokyo/*.yaml`
- ECR 푸시 스크립트: `scripts/ecr-push-tokyo.ps1`

---

**작성일:** 2026-01-06
**최종 검증:** 도쿄 리전 배포 성공 확인 완료
