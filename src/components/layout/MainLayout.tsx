import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export const MainLayout = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* 상단 헤더 (네비게이션) */}
      <header className="border-b border-slate-200 sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* 로고 */}
          <Link to="/news" className="text-xl font-bold text-blue-600">
            NewSugar
          </Link>

          {/* PC용 메뉴 (모바일에선 숨김 or 햄버거 메뉴 필요하지만 일단 심플하게) */}
          <nav className="flex items-center space-x-4">
            <Link to="/news" className="text-sm font-medium text-slate-700 hover:text-blue-600">
              뉴스
            </Link>
            <Link to="/alarm" className="text-sm font-medium text-slate-700 hover:text-blue-600">
              알림
            </Link>
            {/* 로그아웃 버튼 예시 */}
            <Button variant="ghost" className="text-xs">로그아웃</Button>
          </nav>
        </div>
      </header>

      {/* 메인 컨텐츠 영역 */}
      {/* max-w-7xl: PC에서 너무 퍼지지 않게 잡아줌 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};