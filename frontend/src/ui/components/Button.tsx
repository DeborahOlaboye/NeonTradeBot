"use client";

import { cn } from "@/lib/utils";
import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "brand-primary"
    | "brand-secondary"
    | "brand-tertiary"
    | "destructive-primary"
    | "destructive-secondary"
    | "destructive-tertiary"
    | "neutral-primary"
    | "neutral-secondary"
    | "neutral-tertiary";
  size?: "medium" | "large" | "x-large";
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  loading?: boolean;
  children?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "brand-primary",
      size = "medium",
      icon = null,
      iconRight = null,
      loading = false,
      className,
      children,
      ...otherProps
    }: ButtonProps,
    ref
  ) {
    return (
      <button
        className={cn(
          "flex cursor-pointer items-center justify-center gap-2 rounded-md border font-medium transition-all hover:shadow-sm active:shadow-none disabled:cursor-not-allowed",
          {
            "h-8 px-3 text-sm": size === "medium",
            "h-10 px-4 text-base": size === "large",
            "h-12 px-6 text-lg font-semibold": size === "x-large",
            "border-[#00f0ffff] bg-[#00f0ffff] text-[#0a0f2aff] hover:bg-[#00d4e6ff] hover:border-[#00d4e6ff] focus:border-[#00d4e6ff] focus:bg-[#00d4e6ff]":
              variant === "brand-primary",
            "border-[#00f0ffff] bg-transparent text-[#00f0ffff] hover:bg-[#00f0ff1a] focus:bg-[#00f0ff1a]":
              variant === "brand-secondary",
            "border-transparent bg-transparent text-[#00f0ffff] hover:bg-[#00f0ff1a] focus:bg-[#00f0ff1a]":
              variant === "brand-tertiary",
            "border-[#ff4757ff] bg-[#ff4757ff] text-white hover:bg-[#ff3742ff] hover:border-[#ff3742ff]":
              variant === "destructive-primary",
            "border-[#ff4757ff] bg-transparent text-[#ff4757ff] hover:bg-[#ff47571a]":
              variant === "destructive-secondary",
            "border-transparent bg-transparent text-[#ff4757ff] hover:bg-[#ff47571a]":
              variant === "destructive-tertiary",
            "border-[#4269aaff] bg-[#4269aaff] text-[#00f0ffff] hover:bg-[#365a9aff] hover:border-[#365a9aff]":
              variant === "neutral-primary",
            "border-[#4269aaff] bg-transparent text-[#8ca1ccff] hover:bg-[#4269aa1a]":
              variant === "neutral-secondary",
            "border-transparent bg-transparent text-[#8ca1ccff] hover:bg-[#4269aa1a]":
              variant === "neutral-tertiary",
          },
          className
        )}
        ref={ref}
        {...otherProps}
      >
        {icon && <div className="flex items-center">{icon}</div>}
        {children && <div className="flex items-center">{children}</div>}
        {iconRight && <div className="flex items-center">{iconRight}</div>}
      </button>
    );
  }
);

export { Button };
