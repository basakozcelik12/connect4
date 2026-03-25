import { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "success" | "outline";

interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  variant?: ButtonVariant;
  children: ReactNode;
  className?: string;
}

export function Button({ 
  onClick, 
  disabled = false, 
  variant = "primary", 
  children,
  className = ""
}: ButtonProps) {
  const baseStyles = "px-6 py-3 rounded-lg transition-colors font-semibold";
  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-300 text-gray-700 hover:bg-gray-400",
    success: "bg-green-600 text-white hover:bg-green-700",
    outline: "border border-gray-300 px-4 py-2 rounded hover:bg-gray-100",
  };
  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${disabledStyles} ${className}`}
    >
      {children}
    </button>
  );
}
