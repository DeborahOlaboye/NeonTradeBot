"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  variant?: "default" | "success" | "error" | "warning" | "brand";
  children: React.ReactNode;
  className?: string;
}

export function Badge({
  variant = "default",
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        {
          "bg-[#4269aa1a] text-[#8ca1ccff] border border-[#4269aaff]": variant === "default",
          "bg-[#2ed5731a] text-[#2ed573ff] border border-[#2ed573ff]": variant === "success",
          "bg-[#ff47571a] text-[#ff4757ff] border border-[#ff4757ff]": variant === "error",
          "bg-[#ffa5021a] text-[#ffa502ff] border border-[#ffa502ff]": variant === "warning",
          "bg-[#00f0ff1a] text-[#00f0ffff] border border-[#00f0ffff]": variant === "brand",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
