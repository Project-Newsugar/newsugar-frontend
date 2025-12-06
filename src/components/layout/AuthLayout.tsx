import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout = () => {
  return (
    // 배경: PC에선 회색, 모바일에선 흰색일 수도 있음
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4">
      {/* 컨텐츠 박스: PC에선 최대 너비 제한(max-w-md), 모바일에선 100% */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 md:p-8">
        <Outlet />
      </div>
    </div>
  );
};