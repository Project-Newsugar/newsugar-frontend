import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthLayout } from './layout/AuthLayout';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OnboardingBasicPage from './pages/OnboardingBasicPage';
import { MainLayout } from './layout/MainLayout';
import AlarmListPage from './pages/AlarmListPage';
import MyPage from './pages/MyPage';
import NewsFeedPage from './pages/NewsFeedPage';

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignupPage /> },
      { path: '/onboarding', element: <OnboardingBasicPage /> },
    ],
  },
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <NewsFeedPage /> },   // 메인
      { path: '/news', element: <NewsFeedPage /> },
      { path: '/alarm', element: <AlarmListPage /> },
      { path: '/mypage', element: <MyPage /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);

export default router