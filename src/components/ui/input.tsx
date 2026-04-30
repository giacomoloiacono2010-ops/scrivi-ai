import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, type, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[#374151] mb-1.5">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-[#E5E7EB] bg-white px-3 py-2 text-sm placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/10 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
            error && "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/10",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-[#EF4444]">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";