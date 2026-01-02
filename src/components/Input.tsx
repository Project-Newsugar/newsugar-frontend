import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string; // 라벨은 있을 수도 있고 없을 수도 있음
  error?: string; // 에러 메시지 (나중에 유효성 검사 때 씀)
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {/* 라벨이 있을 때만 표시 */}
        {label && (
          <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <input
          ref={ref}
          className={`
            w-full rounded-lg border px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base min-h-[44px] outline-none transition-all
            placeholder:text-slate-400
            ${error
              ? "border-red-500 focus:ring-2 focus:ring-red-200"
              : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            }
            ${className}
          `}
          {...props}
        />

        {/* 에러 메시지가 있으면 빨간 글씨로 표시 */}
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input"; // React DevTools에서 이름 잘 보이게 설정