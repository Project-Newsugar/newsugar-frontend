# Infrastructure Setup

EKS 클러스터를 새로 생성할 때마다 실행해야 하는 인프라 설정 파일들입니다.

## 설치 순서

### 1. Nginx Ingress Controller 설치

```bash
# 공식 manifest 설치
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.11.1/deploy/static/provider/aws/deploy.yaml

# Service를 internet-facing LoadBalancer로 변경
kubectl apply -f k8s/infra/ingress-nginx-controller.yaml
```

### 2. 프론트엔드 배포

```bash
# Production 환경 배포
kubectl apply -f k8s/prod/deployment.yaml
kubectl apply -f k8s/prod/service.yaml
kubectl apply -f k8s/prod/ingress.yaml
kubectl apply -f k8s/prod/hpa.yaml
```

### 3. 배포 확인

```bash
# Ingress Controller 확인
kubectl get svc -n ingress-nginx
kubectl get pods -n ingress-nginx

# 애플리케이션 확인
kubectl get pods -n default
kubectl get svc -n default
kubectl get ingress -n default
```

### 4. 접속 URL 확인

```bash
kubectl get ingress newsugar-frontend-ingress-prod -n default
```

출력된 ADDRESS로 접속하면 됩니다.

### 5. IP 주소 찾기

LoadBalancer의 실제 IP 주소를 확인하려면:

```bash
nslookup k8s-ingressn-ingressn-3b0fd3996c-8f3e69b781742977.elb.ap-northeast-2.amazonaws.com
```

## Route 53 DNS 설정

### 🚀 간단한 방법: Simple routing 사용

Multivalue answer가 복잡하다면 Simple routing 추천:

#### Simple routing 방식:

**첫 번째 레코드:**
- Record name: (비워두기)
- Record type: A
- Value: 52.79.177.127
- TTL: 60
- Routing policy: Simple routing ← 이걸로 선택

**두 번째 레코드:**
- Record name: (비워두기)
- Record type: A
- Value: 43.202.21.217
- TTL: 60
- Routing policy: Simple routing

#### Simple routing의 장점:
- ✅ Record ID 불필요
- ✅ 설정 더 간단
- ✅ 같은 효과 (DNS가 두 IP를 번갈아 반환)

## 참고

- Ingress Controller는 클러스터당 한 번만 설치하면 됩니다.
- `internet-facing` 설정이 없으면 외부에서 접속할 수 없으므로 주의하세요.
- DNS 전파에 2-3분 정도 소요될 수 있습니다.
