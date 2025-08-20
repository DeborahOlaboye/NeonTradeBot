"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AlertProps {
  variant?: "default" | "brand" | "warning" | "error" | "success";
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function Alert({
  variant = "default",
  icon,
  title,
  description,
  actions,
  className,
}: AlertProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-md border p-4",
        {
          "border-[#4269aaff] bg-[#030c36ff]": variant === "default",
          "border-[#00f0ffff] bg-[#00f0ff1a]": variant === "brand",
          "border-[#ffa502ff] bg-[#ffa5021a]": variant === "warning",
          "border-[#ff4757ff] bg-[#ff47571a]": variant === "error",
          "border-[#2ed573ff] bg-[#2ed5731a]": variant === "success",
        },
        className
      )}
    >
      {icon && (
        <div
          className={cn("flex-shrink-0 mt-0.5", {
            "text-[#8ca1ccff]": variant === "default",
            "text-[#00f0ffff]": variant === "brand",
            "text-[#ffa502ff]": variant === "warning",
            "text-[#ff4757ff]": variant === "error",
            "text-[#2ed573ff]": variant === "success",
          })}
        >
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h3
          className={cn("text-sm font-medium", {
            "text-[#00f0ffff]": variant === "default" || variant === "brand",
            "text-[#ffa502ff]": variant === "warning",
            "text-[#ff4757ff]": variant === "error",
            "text-[#2ed573ff]": variant === "success",
          })}
        >
          {title}
        </h3>
        {description && (
          <p className="mt-1 text-sm text-[#8ca1ccff]">{description}</p>
        )}
      </div>
      {actions && <div className="flex-shrink-0">{actions}</div>}
    </div>
  );
}
