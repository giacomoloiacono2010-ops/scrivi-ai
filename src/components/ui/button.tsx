import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  loading?: boolean;
  size?: "sm" | "default" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", loading, children, disabled, ...props }, ref) => {
    const variants = {
      primary: "bg-[#16A34A] text-white hover:bg-[#15803D] focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:ring-offset-2",
      secondary: "bg-white text-[#374151] border border-[#E5E7EB] hover:bg-[#F9FAFB]",
      ghost: "bg-transparent text-[#6B7280] hover:bg-[#F3F4F6] border-none",
      danger: "bg-[#EF4444] text-white hover:bg-[#DC2626]",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      default: "px-5 py-2.5 text-sm",
      lg: "px-6 py-3 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        <span className={loading ? "opacity-70" : ""}>{children}</span>
      </button>
    );
  }
);

Button.displayName = "Button";