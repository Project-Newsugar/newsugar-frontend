import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthLayout } from './layout/AuthLayout';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OnboardingBasicPage from './pages/OnboardingBasicPage';
import { MainLayout } from './layout/MainLayout';
import AlarmListPage from './pages/AlarmListPage';
import HomePage from './pages/HomePage';

const router = createBrowserRouter([
{
    element: <AuthLayout />,
    children: [
    { path: '/', element: <Navigate to="/login" replace /> },
    { path: '/login', element: <LoginPage /> },
    { path: '/signup', element: <SignupPage /> },
    { path: '/onboarding', element: <OnboardingBasicPage /> },
    ],
},
{
    element: <MainLayout />,
    children: [
    { path: '/news', element: <HomePage /> },
    { path: '/alarm', element: <AlarmListPage /> },
    ],
},
{
    path: '*',
    element: <Navigate to="/login" replace />,
},
]);

export default router