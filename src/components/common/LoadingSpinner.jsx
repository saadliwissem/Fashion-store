import React from "react";

const LoadingSpinner = ({ size = "medium", color = "purple" }) => {
  const sizes = {
    small: "w-6 h-6",
    medium: "w-10 h-10",
    large: "w-16 h-16",
  };

  const colors = {
    purple: "border-purple-600",
    white: "border-white",
    gray: "border-gray-400",
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`
          ${sizes[size]}
          ${colors[color]}
          border-4 border-t-transparent
          rounded-full
          animate-spin
        `}
      />
    </div>
  );
};

export default LoadingSpinner;
