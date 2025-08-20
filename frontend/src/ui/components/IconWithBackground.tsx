"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface IconWithBackgroundProps {
  icon?: React.ReactNode;
  variant?: "default" | "brand" | "neutral" | "success" | "error" | "warning";
  size?: "default" | "large" | "x-large";
  className?: string;
}

export function IconWithBackground({
  size = "default",
  variant = "default",
  icon,
  className,
}: IconWithBackgroundProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-md",
        {
          "h-8 w-8": size === "default",
          "h-12 w-12": size === "large",
          "h-16 w-16": size === "x-large",
          "bg-[#4269aaff] text-[#00f0ffff]": variant === "default",
          "bg-[#00f0ff1a] text-[#00f0ffff]": variant === "brand",
          "bg-[#8ca1cc1a] text-[#8ca1ccff]": variant === "neutral",
          "bg-[#2ed5731a] text-[#2ed573ff]": variant === "success",
          "bg-[#ff47571a] text-[#ff4757ff]": variant === "error",
          "bg-[#ffa5021a] text-[#ffa502ff]": variant === "warning",
        },
        className
      )}
    >
      {icon}
    </div>
  );
}
