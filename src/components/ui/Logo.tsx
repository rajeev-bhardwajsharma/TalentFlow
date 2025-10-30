import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = "md", showText = true }) => {
  const sizes = {
    sm: { icon: "h-8 w-8", text: "text-xl" },
    md: { icon: "h-10 w-10", text: "text-2xl" },
    lg: { icon: "h-12 w-12", text: "text-3xl" },
  };

  return (
    <div className="flex items-center gap-3">
      {/* Modern Logo Icon with Gradient */}
      <div className={`${sizes[size].icon} relative`}>
        <div className="absolute inset-0 gradient-primary rounded-xl rotate-6 blur-sm opacity-75"></div>
        <div className="relative gradient-primary rounded-xl flex items-center justify-center h-full w-full shadow-lg">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-6 h-6 text-white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 7H16V5C16 3.9 15.1 3 14 3H10C8.9 3 8 3.9 8 5V7H4C2.9 7 2 7.9 2 9V20C2 21.1 2.9 22 4 22H20C21.1 22 22 21.1 22 20V9C22 7.9 21.1 7 20 7ZM10 5H14V7H10V5Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={`${sizes[size].text} font-bold text-gradient leading-none`}>
            TalentFlow
          </span>
          <span className="text-xs text-slate-500 font-medium">
            Hiring Platform
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
