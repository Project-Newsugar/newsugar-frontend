# Newsugar Frontend - 모니터링 전략

## 1. 모니터링 개요

### 1.1. 목표

- **가용성**: 서비스 다운타임 최소화 (목표: 99.9% uptime)
- **성능**: 페이지 로드 시간 3초 이내 유지
- **안정성**: 장애 발생 시 5분 이내 감지 및 대응
- **사용자 경험**: 실시간 사용자 행동 분석 및 오류 추적

### 1.2. 모니터링 레이어

```
┌─────────────────────────────────────────────┐
│  사용자 경험 모니터링 (RUM)                   │
│  - Google Analytics, Sentry                 │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│  애플리케이션 모니터링                        │
│  - Nginx Access/Error Logs                  │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│  인프라 모니터링 (Kubernetes)                │
│  - Prometheus, Grafana, CloudWatch          │
└─────────────────────────────────────────────┘
```

## 2. 인프라 모니터링 (Kubernetes + AWS)

### 2.1. Prometheus + Grafana 스택

#### 2.1.1. Prometheus 설치

```bash
# Helm으로 Prometheus 설치
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace
```

#### 2.1.2. 주요 메트릭

- **CPU 사용률**: Pod별, Node별 CPU 사용량
- **메모리 사용률**: Pod별, Node별 메모리 사용량
- **네트워크**: Ingress/Egress 트래픽
- **Pod 상태**: Running, Pending, Failed, CrashLoopBackOff
- **HPA 메트릭**: 현재 Replica 수, 목표 메트릭

#### 2.1.3. Grafana 대시보드 권장

```bash
# Grafana 접속
kubectl port-forward -n monitoring svc/prometheus-grafana 3000:80

# 추천 대시보드 ID:
# - 15172: Kubernetes Cluster Monitoring
# - 13770: Kubernetes Pod Monitoring
# - 12114: Kubernetes Nginx Ingress
```

### 2.2. AWS CloudWatch 메트릭

#### 2.2.1. Load Balancer 모니터링

```bash
# CloudWatch 메트릭:
# - TargetResponseTime (평균 응답 시간)
# - RequestCount (요청 수)
# - HealthyHostCount (정상 타겟 수)
# - UnHealthyHostCount (비정상 타겟 수)
# - HTTPCode_Target_2XX_Count (성공 응답)
# - HTTPCode_Target_4XX_Count (클라이언트 오류)
# - HTTPCode_Target_5XX_Count (서버 오류)
```

#### 2.2.2. EKS 클러스터 메트릭

```bash
# Container Insights 활성화
aws eks update-cluster-config \
  --name <클러스터-이름> \
  --logging '{"clusterLogging":[{"types":["api","audit","authenticator","controllerManager","scheduler"],"enabled":true}]}'

# CloudWatch Log Groups:
# - /aws/eks/<cluster-name>/cluster
# - /aws/containerinsights/<cluster-name>/performance
```

## 3. 애플리케이션 모니터링

### 3.1. Nginx 로그 수집

#### 3.1.1. Access Log 포맷 (nginx.conf)

```nginx
log_format json_combined escape=json
'{'
  '"time_local":"$time_local",'
  '"remote_addr":"$remote_addr",'
  '"request":"$request",'
  '"status": "$status",'
  '"body_bytes_sent":"$body_bytes_sent",'
  '"request_time":"$request_time",'
  '"http_referrer":"$http_referer",'
  '"http_user_agent":"$http_user_agent"'
'}';

access_log /var/log/nginx/access.log json_combined;
error_log /var/log/nginx/error.log warn;
```

#### 3.1.2. 로그 수집 방법

**옵션 1: kubectl logs (간단한 확인)**

```bash
kubectl logs -f <pod-name> --tail=100
```

**옵션 2: Fluentd + Elasticsearch + Kibana (EFK Stack)**

```bash
# Fluentd DaemonSet 배포
kubectl apply -f https://raw.githubusercontent.com/fluent/fluentd-kubernetes-daemonset/master/fluentd-daemonset-elasticsearch.yaml
```

**옵션 3: CloudWatch Logs (AWS 네이티브)**

```bash
# Fluent Bit을 사용한 CloudWatch 전송
helm repo add eks https://aws.github.io/eks-charts
helm install aws-for-fluent-bit eks/aws-for-fluent-bit \
  --namespace kube-system
```

### 3.2. 주요 로그 메트릭

- **HTTP Status Code 분포**: 2xx, 4xx, 5xx 비율
- **응답 시간**: P50, P95, P99
- **에러율**: 5xx 에러 발생 비율 (목표: 0.1% 이하)
- **트래픽 패턴**: 시간대별 요청 수

## 4. 사용자 경험 모니터링 (RUM)

### 4.1. Google Analytics 4 (GA4)

#### 4.1.1. 설치 (React)

```typescript
// src/utils/analytics.ts
import ReactGA from "react-ga4";

export const initGA = () => {
  ReactGA.initialize("G-XXXXXXXXXX");
};

export const logPageView = () => {
  ReactGA.send({ hitType: "pageview", page: window.location.pathname });
};
```

#### 4.1.2. 주요 추적 메트릭

- **Core Web Vitals**:
  - LCP (Largest Contentful Paint): 2.5초 이하
  - FID (First Input Delay): 100ms 이하
  - CLS (Cumulative Layout Shift): 0.1 이하
- **페이지별 체류 시간**
- **사용자 플로우**: 주요 페이지 이동 경로
- **이탈률**: 페이지별 Bounce Rate

### 4.2. Sentry (오류 추적)

#### 4.2.1. 설치

```bash
npm install @sentry/react
```

```typescript
// src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://xxxxx@sentry.io/xxxxx",
  environment: import.meta.env.MODE, // dev or prod
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0, // Prod에서는 0.1 권장
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

#### 4.2.2. 주요 추적 항목

- **JavaScript 에러**: 런타임 오류, Promise rejection
- **네트워크 에러**: API 호출 실패 (axios interceptor 연동)
- **사용자 세션 재생**: 오류 발생 시 사용자 행동 재현
- **에러율**: 사용자당 에러 발생 빈도

## 5. 알림 (Alerting) 전략

### 5.1. 중요도별 알림 설정

#### 5.1.1. Critical (즉시 대응 필요)

- **Pod가 모두 다운**: `kubectl get pods | grep Running` 결과 0개
- **5xx 에러율 > 5%**: 서버 장애 가능성
- **응답 시간 > 10초**: 심각한 성능 저하
- **알림 채널**: Slack, SMS, PagerDuty

#### 5.1.2. Warning (모니터링 필요)

- **HPA Max Replicas 도달**: 스케일링 한계
- **5xx 에러율 > 1%**: 부분적 장애
- **응답 시간 > 5초**: 성능 저하
- **알림 채널**: Slack

#### 5.1.3. Info (참고 정보)

- **배포 완료**: ArgoCD 동기화 성공
- **HPA 스케일 변경**: Replica 증가/감소
- **알림 채널**: Slack

### 5.2. Prometheus Alertmanager 설정 예시

```yaml
# prometheus-alerts.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-alerts
  namespace: monitoring
data:
  alerts.yml: |
    groups:
    - name: newsugar-frontend
      interval: 30s
      rules:
      # Pod 다운 알림
      - alert: FrontendPodsDown
        expr: kube_deployment_status_replicas_available{deployment="newsugar-frontend-prod"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Frontend Pods are down"
          description: "No available replicas for newsugar-frontend-prod"

      # 높은 5xx 에러율
      - alert: High5xxErrorRate
        expr: rate(nginx_http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "High 5xx error rate"
          description: "5xx error rate is above 5%"

      # CPU 사용률 높음
      - alert: HighCPUUsage
        expr: sum(rate(container_cpu_usage_seconds_total{pod=~"newsugar-frontend.*"}[5m])) by (pod) > 0.8
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High CPU usage"
          description: "Pod {{ $labels.pod }} CPU usage is above 80%"

      # HPA Max Replicas 도달
      - alert: HPAMaxReplicasReached
        expr: kube_horizontalpodautoscaler_status_current_replicas{horizontalpodautoscaler="newsugar-frontend-hpa-prod"} >= kube_horizontalpodautoscaler_spec_max_replicas
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "HPA reached max replicas"
          description: "Frontend HPA reached maximum replicas"
```

### 5.3. Slack 알림 연동

```bash
# Alertmanager Slack Webhook 설정
kubectl edit configmap prometheus-alertmanager -n monitoring

# alertmanager.yml:
global:
  slack_api_url: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXX'

route:
  receiver: 'slack-notifications'
  group_by: ['alertname', 'cluster', 'service']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 12h

receivers:
- name: 'slack-notifications'
  slack_configs:
  - channel: '#newsugar-alerts'
    title: '{{ .GroupLabels.alertname }}'
    text: '{{ range .Alerts }}{{ .Annotations.description }}{{ end }}'
```

## 6. 대시보드 구성

### 6.1. Grafana 대시보드 레이아웃

#### 6.1.1. 전체 개요 (Overview)

- **현재 상태**: Running Pods, Health Check
- **트래픽**: 실시간 요청 수 (req/s)
- **에러율**: 4xx, 5xx 비율
- **응답 시간**: P50, P95, P99

#### 6.1.2. 리소스 모니터링

- **CPU 사용률**: Pod별, Node별
- **메모리 사용률**: Pod별, Node별
- **네트워크**: Ingress/Egress 트래픽
- **HPA 상태**: 현재/목표 Replica 수

#### 6.1.3. 애플리케이션 성능

- **HTTP Status Code**: 시간대별 2xx/4xx/5xx 분포
- **응답 시간 히트맵**: 시간대별 응답 시간 분포
- **Top Slowest Pages**: 느린 페이지 Top 10
- **에러 로그**: 최근 5xx 에러 목록

### 6.2. CloudWatch 대시보드

```bash
# AWS Console > CloudWatch > Dashboards

위젯 추가:
1. Load Balancer - Request Count (Line)
2. Load Balancer - Target Response Time (Line)
3. Load Balancer - HTTP 5xx Count (Number)
4. EKS - Pod CPU Utilization (Stacked Area)
5. EKS - Pod Memory Utilization (Stacked Area)
```

## 7. 정기 점검 및 리포팅

### 7.1. 일일 점검 (Daily Check)

- [ ] Pod 상태 확인: `kubectl get pods`
- [ ] 5xx 에러율 확인 (목표: < 0.1%)
- [ ] 평균 응답 시간 확인 (목표: < 1초)
- [ ] CloudWatch 비용 확인

### 7.2. 주간 리포트 (Weekly Report)

- **가용성**: Uptime 비율
- **성능**: 평균 응답 시간, P95, P99
- **트래픽**: 총 요청 수, 일평균 사용자 수
- **에러**: 5xx 에러 상위 10개
- **비용**: AWS 리소스 사용 비용

### 7.3. 월간 리뷰 (Monthly Review)

- **Core Web Vitals 분석**: LCP, FID, CLS 추이
- **사용자 행동 분석**: GA4 데이터 분석
- **인프라 최적화**: 리소스 사용률 분석 및 조정
- **보안 점검**: ECR 이미지 스캔 결과

## 8. 장애 대응 프로세스

### 8.1. 장애 감지 (Detection)

```
알림 발생 → Slack/PagerDuty → 담당자 확인 (5분 이내)
```

### 8.2. 장애 분석 (Analysis)

```bash
# 1. Pod 상태 확인
kubectl get pods -l app=newsugar-frontend

# 2. 최근 로그 확인
kubectl logs -l app=newsugar-frontend --tail=100

# 3. 이벤트 확인
kubectl get events --sort-by=.metadata.creationTimestamp

# 4. CloudWatch 메트릭 확인
# - LoadBalancer 5xx 에러 급증
# - Target Response Time 증가
```

### 8.3. 장애 복구 (Recovery)

```bash
# 긴급 조치 1: Pod 재시작
kubectl rollout restart deployment/newsugar-frontend-prod

# 긴급 조치 2: 이전 버전 롤백
kubectl rollout undo deployment/newsugar-frontend-prod

# 긴급 조치 3: 수동 스케일링
kubectl scale deployment/newsugar-frontend-prod --replicas=10
```

### 8.4. 사후 분석 (Post-Mortem)

- **발생 시간**: 장애 시작/종료 시간
- **원인 분석**: 근본 원인 파악
- **영향 범위**: 영향받은 사용자 수, 서비스
- **대응 과정**: 취한 조치 및 소요 시간
- **재발 방지**: 개선 사항 및 액션 아이템

## 9. 비용 최적화

### 9.1. CloudWatch 비용 절감

```bash
# 로그 보존 기간 설정 (기본: 무제한)
aws logs put-retention-policy \
  --log-group-name /aws/eks/<cluster-name>/cluster \
  --retention-in-days 7

# 불필요한 메트릭 필터 제거
aws logs describe-metric-filters --log-group-name <log-group>
```

### 9.2. 리소스 최적화

- **Dev 환경**: 업무 시간 외 스케일 다운 (Replica 0)
- **Prod 환경**: HPA 최소/최대 Replica 조정
- **로그 레벨**: Prod는 ERROR 레벨만 수집

## 10. 참고 자료

- **Prometheus Query Examples**: https://prometheus.io/docs/prometheus/latest/querying/examples/
- **Grafana Dashboard Gallery**: https://grafana.com/grafana/dashboards/
- **AWS Container Insights**: https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html
- **Nginx Logging Guide**: https://docs.nginx.com/nginx/admin-guide/monitoring/logging/
- **Sentry Best Practices**: https://docs.sentry.io/platforms/javascript/guides/react/
