# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Build ARG: 빌드 시점에 API URL을 외부에서 주입받음
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# 의존성 설치
COPY package*.json ./
RUN npm ci

# 소스 복사 및 빌드
COPY . .
RUN npm run build

# Stage 2: Production
FROM nginx:alpine

# Nginx 설정 파일 선택 (기본값: 프로덕션용)
ARG NGINX_CONF=nginx.conf
COPY ${NGINX_CONF} /etc/nginx/conf.d/default.conf

# 빌드된 정적 파일 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx 실행 (기본 포트 80)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
