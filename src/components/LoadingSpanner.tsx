import React from "react";

interface LoadingSpinnerProps {
  size?: number; // px 단위
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 40,
  color = "border-blue-600",
}) => {
  return (
    <div className="flex justify-center items-center py-6">
      <div
        className={`animate-spin rounded-full border-t-4 border-b-4 ${color}`}
        style={{ width: size, height: size }}
      ></div>
    </div>
  );
};

export default LoadingSpinner;