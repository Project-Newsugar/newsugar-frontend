import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthLayout } from "./layout/AuthLayout";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import OnboardingBasicPage from "./pages/OnboardingBasicPage";
import { MainLayout } from "./layout/MainLayout";
import AlarmListPage from "./pages/AlarmListPage";
import HomePage from "./pages/HomePage";

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
      // { path: '/categories', element: <CategoriesPage /> },
      // { path: '/category/:categoryName', element: <CategoryDetailPage /> },
      // { path: '/news/:newsId', element: <NewsDetailPage /> },
      { path: "/", element: <HomePage /> },
      { path: "/alarm", element: <AlarmListPage /> },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export default router;
