import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthLayout } from './layout/AuthLayout';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OnboardingBasicPage from './pages/OnboardingBasicPage';
import { MainLayout } from './layout/MainLayout';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import MyPage from './pages/MyPage';
import NewsDetailPage from './pages/NewsDetailPage';
import HelpPage from './pages/HelpPage';
// ▼ [추가 1] 임시 페이지 가져오기
import BadgeGalleryDemo from './pages/BadgeGalleryDemo';
const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignupPage /> },
      { path: "/onboarding", element: <OnboardingBasicPage /> },
    ],
  },
  {
    element: <MainLayout />,
    children: [
      { path: '/news/:newsId', element: <NewsDetailPage /> },
      { path: "/", element: <HomePage /> },
      { path: '/mypage', element: <MyPage /> },
      { path: '/category/:categoryName', element: <CategoryPage /> },
      { path: '/help', element: <HelpPage /> },
    ],
  },
  // ▼ [추가 2] 테스트 페이지 경로 설정 (레이아웃 없이 독립적으로 띄움)
  {
    path: "/test",
    element: <BadgeGalleryDemo />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export default router;