"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface TextFieldProps {
  variant?: "filled" | "outlined";
  label?: string;
  helpText?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

interface TextFieldInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

function TextFieldRoot({ variant = "filled", label, helpText, icon, children, className }: TextFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label && (
        <label className="text-sm font-medium text-[#8ca1ccff]">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3 z-10 text-[#8ca1ccff]">
            {icon}
          </div>
        )}
        {children}
      </div>
      {helpText && (
        <span className="text-xs text-[#8ca1ccff]">
          {helpText}
        </span>
      )}
    </div>
  );
}

function TextFieldInput({ placeholder, value, onChange, className }: TextFieldInputProps) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={cn(
        "w-full rounded-md border border-[#4269aaff] bg-[#030c36ff] px-3 py-2 pl-10 text-sm text-[#00f0ffff] placeholder-[#8ca1ccff] focus:border-[#00f0ffff] focus:outline-none focus:ring-1 focus:ring-[#00f0ffff]",
        className
      )}
    />
  );
}

export const TextField = Object.assign(TextFieldRoot, {
  Input: TextFieldInput,
});
