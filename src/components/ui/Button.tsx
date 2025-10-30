import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  type = "button",
  className = "",
  icon,
}) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-4";

  const variantStyles = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed",
    secondary:
      "bg-white text-indigo-600 border-2 border-indigo-600 hover:bg-indigo-600 hover:text-white focus:ring-indigo-200",
    outline:
      "bg-transparent border-2 border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-slate-200",
    ghost:
      "bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-200",
    danger:
      "bg-red-500 text-white hover:bg-red-600 focus:ring-red-200 shadow-lg shadow-red-500/30",
  };

  const sizeStyles = {
    sm: "text-sm px-4 py-2",
    md: "text-base px-6 py-3",
    lg: "text-lg px-8 py-4",
  };

  const widthStyles = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`}
    >
      {loading && (
        <svg
          className="animate-spin h-5 w-5 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4zm2 5.29A7.96 7.96 0 014 12H0c0 
               3.04 1.13 5.82 3 7.94l3-2.65z"
          />
        </svg>
      )}
      {!loading && icon}
      {children}
    </button>
  );
};

export default Button;
export { Button };
