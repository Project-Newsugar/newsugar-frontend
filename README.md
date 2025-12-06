**1. 개발 환경 (Environment)**

- **Core:** React 18 + TypeScript + Vite (SWC)
- **Styling:** Tailwind CSS (v3.4+)
- **Plugins:** `@tailwindcss/line-clamp` 설치 완료 (뉴스 제목 말줄임 처리용)
- **Path Alias:** `@/` 경로 별칭 설정 (`../../` 지옥 해결)
- **OS:** WSL(Ubuntu) 기반 Node.js 환경

**2. 프로젝트 아키텍처 (Architecture)**

- **Feature-Sliced Design:** `features/auth`, `news`, `alarm` 등 도메인별 폴더 격리
- **Colocation:** 페이지와 관련 컴포넌트를 한 폴더에 응집시켜 유지보수성 강화

**3. 공통 디자인 시스템 (Common UI)**

- **Atomic Components (`components/ui`):**
    - `Button`: Primary, Secondary, Outline, Ghost 등 다양한 스타일 지원
    - `Input`: Label, Error Msg, Validation Style 내장 (재사용성 극대화)
- **Layouts (`components/layout`):**
    - `AuthLayout`: 로그인/회원가입용 (중앙 집중형 카드 UI)
    - `MainLayout`: 뉴스/알람용 (헤더 + 반응형 컨테이너)
- **Utilities:** `scrollbar-hide` 커스텀 클래스 (`index.css`에 직접 구현)

**4. 구현된 기능 (Completed Features)**

- **Router:** 전체 페이지 라우팅 연결 (`/login` ~ `/alarm`)
- **Auth (담당자: 본인):**
    - **로그인:** 실시간 유효성 검사, 구글 로그인 UI 배치
    - **회원가입:** 비밀번호 일치 확인 로직 구현
    - **온보딩:** 닉네임(필수/관리자사칭 방지/중복체크Mock), 전화번호(선택/자동하이픈)
- **News/Alarm (담당자: 팀원):**
    - **템플릿 제공:** 검색창, 필터 버튼, 뉴스 리스트 카드 등 즉시 사용 가능한 UI 뼈대 구현 완료
