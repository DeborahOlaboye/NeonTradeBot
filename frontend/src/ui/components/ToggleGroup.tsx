"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ToggleGroupProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

interface ToggleGroupItemProps {
  value: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

function ToggleGroupRoot({ value, onValueChange, children, className }: ToggleGroupProps) {
  return (
    <div className={cn("flex items-center rounded-md bg-[#1a2b5aff] p-1", className)}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            ...child.props,
            isActive: child.props.value === value,
            onClick: () => onValueChange(child.props.value),
          });
        }
        return child;
      })}
    </div>
  );
}

function ToggleGroupItem({ 
  value, 
  icon, 
  children, 
  className,
  isActive,
  onClick,
  ...props 
}: ToggleGroupItemProps & { isActive?: boolean; onClick?: () => void }) {
  return (
    <button
      className={cn(
        "flex items-center gap-2 rounded px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-[#00f0ffff] text-[#0a0f2aff]"
          : "text-[#8ca1ccff] hover:bg-[#4269aaff] hover:text-[#00f0ffff]",
        className
      )}
      onClick={onClick}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}

export const ToggleGroup = Object.assign(ToggleGroupRoot, {
  Item: ToggleGroupItem,
});
