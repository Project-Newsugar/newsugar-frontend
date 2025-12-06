import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { MainLayout } from '@/components/layout/MainLayout'

// 본인 담당
import LoginPage from '@/features/auth/pages/LoginPage'
import SignupPage from '@/features/auth/pages/SignupPage'
import OnboardingBasicPage from '@/features/onboarding/pages/OnboardingBasicPage'

// 팀원 담당
import NewsFeedPage from '@/features/news/pages/NewsFeedPage'
import AlarmListPage from '@/features/alarm/pages/AlarmListPage'

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. 인증/온보딩 그룹 (AuthLayout 적용) */}
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/onboarding" element={<OnboardingBasicPage />} />
        </Route>

        {/* 2. 메인 서비스 그룹 (MainLayout 적용 - 헤더 있음) */}
        <Route element={<MainLayout />}>
          <Route path="/news" element={<NewsFeedPage />} />
          <Route path="/alarm" element={<AlarmListPage />} />
        </Route>

        {/* 예외 처리 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App