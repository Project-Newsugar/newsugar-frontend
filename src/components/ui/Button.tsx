import React from 'react';

// 버튼이 받을 수 있는 옵션들을 정의합니다 (타입스크립트의 힘!)
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'; // 버튼 스타일 종류
  fullWidth?: boolean; // 꽉 찬 너비 여부
}

export const Button = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}: ButtonProps) => {
  
  // 1. 공통적으로 들어갈 디자인 (둥근 모서리, 폰트, 트랜지션 등)
  const baseStyle = "px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  // 2. 종류별 디자인 (배경색, 글자색)
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm",
    secondary: "bg-slate-200 text-slate-800 hover:bg-slate-300",
    outline:
      'border-2 border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50',
    ghost:
      'bg-transparent text-slate-500 hover:bg-slate-100 active:bg-slate-200',
  };

  // 3. 너비 설정
  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${widthStyle} ${className}`}
      {...props} // 나머지 onClick, type 등의 속성을 그대로 전달
    >
      {children}
    </button>
  );
};