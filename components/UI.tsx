
import React from 'react';

export const Button: React.FC<{
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  disabled?: boolean;
  className?: string;
}> = ({ onClick, children, variant = 'primary', disabled = false, className = '' }) => {
  const baseStyles = "px-6 py-3 rounded-2xl font-bold text-xl bouncy shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200";
  const variants = {
    primary: "bg-yellow-400 text-yellow-900 hover:bg-yellow-500",
    secondary: "bg-orange-400 text-white hover:bg-orange-500",
    danger: "bg-red-500 text-white hover:bg-red-600",
    ghost: "bg-white/50 text-gray-700 border-2 border-dashed border-gray-300",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-3xl p-6 shadow-xl border-4 border-yellow-200 ${className}`}>
    {children}
  </div>
);

export const Badge: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = 'bg-yellow-100' }) => (
  <span className={`${color} text-yellow-800 px-3 py-1 rounded-full text-sm font-bold`}>
    {children}
  </span>
);

export const Title: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h1 className="text-4xl font-bold text-center text-orange-600 drop-shadow-sm mb-4">
    {children}
  </h1>
);
