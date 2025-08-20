"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "small" | "medium" | "large";
  variant?: "default" | "ghost" | "outline";
  icon: React.ReactNode;
}

export function IconButton({
  size = "medium",
  variant = "default",
  icon,
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#00f0ffff] focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
        {
          "h-8 w-8": size === "small",
          "h-10 w-10": size === "medium",
          "h-12 w-12": size === "large",
          "bg-[#4269aaff] text-[#00f0ffff] hover:bg-[#365a9aff]": variant === "default",
          "bg-transparent text-[#8ca1ccff] hover:bg-[#4269aa1a] hover:text-[#00f0ffff]": variant === "ghost",
          "border border-[#4269aaff] bg-transparent text-[#8ca1ccff] hover:bg-[#4269aa1a] hover:text-[#00f0ffff]": variant === "outline",
        },
        className
      )}
      {...props}
    >
      {icon}
    </button>
  );
}
