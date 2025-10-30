import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "glass" | "gradient";
  hoverable?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = "",
  variant = "default",
  hoverable = false,
  onClick,
}) => {
  const baseStyles = "rounded-2xl p-6 transition-all duration-300";
  
  const variantStyles = {
    default: "bg-white shadow-lg border border-slate-200",
    glass: "glass-effect shadow-xl",
    gradient: "gradient-primary text-white shadow-2xl",
  };

  const hoverStyles = hoverable
    ? "hover:shadow-2xl hover:-translate-y-1 hover:border-indigo-300"
    : "";

  const clickStyles = onClick ? "cursor-pointer" : "";

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${clickStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
