# Newsugar

> AI가 선별하고 요약한 주요 뉴스를 간결하게 확인하세요

뉴슈가(Newsugar)는 복잡한 뉴스를 AI가 요약하여 간단하게 제공하는 뉴스 큐레이션 플랫폼입니다.
사용자는 관심 카테고리를 즐겨찾기하고, 시간대별 퀴즈를 풀며 뉴스를 재미있게 소비할 수 있습니다.

---

## 목차

- [프로젝트 개요](#프로젝트-개요)
- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [프로젝트 구조](#프로젝트-구조)
- [설치 및 실행](#설치-및-실행)
- [인프라 구성](#인프라-구성)
- [화면 구성](#화면-구성)

---

## 프로젝트 개요

### 프로젝트 정보

- **프로젝트명**: Newsugar (뉴슈가)
- **개발 기간**: 2024.12 - 2025.01
- **팀 구성**: 멋쟁이사자처럼 대학 3기 프로젝트

### 개발 목표

현대인들은 매일 쏟아지는 수많은 뉴스 속에서 정작 중요한 정보를 놓치기 쉽습니다.
Newsugar는 이러한 문제를 해결하기 위해 AI 기술을 활용하여 핵심 뉴스를 선별하고 요약해 제공합니다.
사용자는 즐겨찾기 기능으로 관심 분야의 뉴스를 빠르게 확인하고, 퀴즈를 통해 재미있게 뉴스를 학습할 수 있습니다.

---

## 주요 기능

### 1. 뉴스 큐레이션

- **카테고리별 뉴스**: 정치, 경제, 사회, IT, 스포츠 등 다양한 카테고리의 뉴스 제공
- **AI 요약**: 긴 뉴스 기사를 AI가 핵심만 추려 요약
- **즐겨찾기**: 관심 카테고리를 즐겨찾기하여 맞춤형 뉴스 피드 구성
- **뉴스 검색**: 키워드로 원하는 뉴스를 빠르게 검색

### 2. 시간대별 퀴즈

- **4개 시간대 퀴즈**: 06시, 12시, 18시, 24시 시간대별 퀴즈 제공
- **실시간 채점**: 퀴즈 제출 후 즉시 정답 확인 및 해설 제공
- **퀴즈 기록 관리**: 이전 시간대의 퀴즈 기록 조회 가능
- **배지 시스템**: 퀴즈 풀이 성과에 따른 다양한 배지 획득

### 3. 사용자 기능

- **소셜 로그인**: Google OAuth 간편 로그인
- **마이페이지**: 획득한 배지, 퀴즈 통계 확인
- **프로필 관리**: 사용자 정보 및 프로필 이미지 관리
- **온보딩**: 신규 사용자를 위한 관심 카테고리 설정

### 4. 반응형 디자인

- 모바일, 태블릿, 데스크톱 모든 환경에서 최적화된 UI 제공
- TailwindCSS를 활용한 깔끔하고 직관적인 디자인

---

## 기술 스택

### Frontend

- **Framework**: React 19.1
- **Language**: TypeScript 5.8
- **Build Tool**: Vite 7.1
- **Styling**: TailwindCSS 4.1
- **Routing**: React Router Dom 7.10
- **State Management**: Jotai 2.15
- **Data Fetching**: TanStack Query 5.90, Axios 1.13
- **Form**: React Hook Form 7.68, Zod 4.1
- **Authentication**: React OAuth Google 0.13

### Development Tools

- **Linting**: ESLint 9.36
- **Version Control**: Git, GitHub
- **Package Manager**: npm

---

## 프로젝트 구조

```
newsugar-frontend/
├── src/
│   ├── api/              # API 통신 로직
│   │   ├── auth.tsx      # 인증 관련 API
│   │   ├── news.tsx      # 뉴스 관련 API
│   │   ├── quiz.tsx      # 퀴즈 관련 API
│   │   └── category.tsx  # 카테고리 관련 API
│   ├── components/       # 재사용 가능한 컴포넌트
│   │   ├── home/         # 홈 화면 컴포넌트
│   │   ├── news/         # 뉴스 관련 컴포넌트
│   │   ├── quiz/         # 퀴즈 관련 컴포넌트
│   │   ├── badge/        # 배지 시스템 컴포넌트
│   │   ├── myPage/       # 마이페이지 컴포넌트
│   │   └── effects/      # 시각 효과 컴포넌트
│   ├── pages/            # 페이지 컴포넌트
│   │   ├── HomePage.tsx
│   │   ├── CategoryPage.tsx
│   │   ├── MyPage.tsx
│   │   ├── LoginPage.tsx
│   │   └── ...
│   ├── hooks/            # 커스텀 훅
│   │   ├── useAuth.ts
│   │   ├── useNewsQuery.tsx
│   │   ├── useQuizQuery.tsx
│   │   └── ...
│   ├── layout/           # 레이아웃 컴포넌트
│   │   ├── MainLayout.tsx
│   │   └── AuthLayout.tsx
│   ├── types/            # TypeScript 타입 정의
│   ├── schema/           # Zod 스키마 정의
│   ├── store/            # Jotai 상태 관리
│   ├── utils/            # 유틸리티 함수
│   ├── constants/        # 상수 정의
│   └── Router.tsx        # 라우팅 설정
├── public/               # 정적 파일
├── .github/              # GitHub 설정
│   ├── workflows/        # CI/CD 워크플로우
│   └── ISSUE_TEMPLATE/   # 이슈 템플릿
├── vite.config.ts        # Vite 설정
├── tsconfig.json         # TypeScript 설정
└── package.json          # 프로젝트 의존성
```

---

## 설치 및 실행

### 사전 요구사항

- Node.js 18.0 이상
- npm 또는 yarn
- 백엔드 API 서버 실행 중 (기본 포트: 8080)

### 설치 방법

```bash
# 저장소 클론
git clone https://github.com/your-repo/newsugar-frontend.git

# 프로젝트 디렉토리 이동
cd newsugar-frontend

# 의존성 설치
npm install
```

### 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 입력하세요:

```env
# API 서버 주소
VITE_API_TARGET=http://localhost:8080

# Google OAuth Client ID
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### 실행 방법

```bash
# 개발 서버 실행
npm run dev

# 모바일 테스트용 서버 실행 (네트워크 접근 허용)
npm run dev:mobile

# 프로덕션 빌드
npm run build

# 프로덕션 빌드 (타입 체크 포함)
npm run build:check

# 빌드 결과 미리보기
npm run preview

# 린트 검사
npm run lint
```

개발 서버가 실행되면 브라우저에서 `http://localhost:5173`으로 접속할 수 있습니다.

### 프로덕션 배포

GitHub Actions를 통해 자동으로 빌드 및 배포가 이루어집니다.
자세한 내용은 [docs/k8s-deployment-guide.md](docs/k8s-deployment-guide.md)를 참고하세요.

---

## 인프라 아키텍처

본 프로젝트는 AWS EKS 기반의 Kubernetes 환경에서 운영되며, Terraform을 통해 인프라가 관리됩니다.

- **환경 구성**: Primary(Seoul), DR(Tokyo) 멀티 리전
- **컴퓨팅**: AWS EKS, Auto Scaling Node Group
- **데이터베이스**: Aurora MySQL Global DB
- **캐시**: ElastiCache Redis
- **로드 밸런싱**: ALB (aws-load-balancer-controller)
- **CI/CD**: GitHub Actions → ECR → ArgoCD
- **모니터링**: Prometheus/Grafana, CloudWatch
- **DR 자동화**: Lambda 기반 Failover

---

## 화면 구성

### 메인 화면

- 시간대별 요약 뉴스 카드
- 시간대별 퀴즈 섹션
- 카테고리 그리드 (즐겨찾기 기능)
- 즐겨찾기 뉴스 피드

### 카테고리 페이지

- 선택한 카테고리의 뉴스 목록
- 뉴스 상세보기 모달

### 퀴즈 화면

- 시간대별 퀴즈 (06시/12시/18시/24시)
- 객관식 문제 형식
- 실시간 채점 및 해설
- 퀴즈 결과 및 통계

### 마이페이지

- 사용자 프로필 정보
- 획득한 배지 갤러리
- 퀴즈 통계 (전체/카테고리별)
- 즐겨찾기 카테고리 관리

### 로그인/회원가입

- Google OAuth 소셜 로그인
- 일반 이메일 회원가입
- 온보딩 (관심 카테고리 선택)

---

## 라이센스

이 프로젝트는 학습 및 포트폴리오 목적으로 제작되었습니다.

---

<div align="center">
  <sub>Built by Likelion 3rd Team</sub>
</div>
