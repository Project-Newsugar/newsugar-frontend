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

## 참고

- Ingress Controller는 클러스터당 한 번만 설치하면 됩니다.
- `internet-facing` 설정이 없으면 외부에서 접속할 수 없으므로 주의하세요.
- DNS 전파에 2-3분 정도 소요될 수 있습니다.
