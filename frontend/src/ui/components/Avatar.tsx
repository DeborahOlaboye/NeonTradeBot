"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps {
  size?: "small" | "medium" | "large";
  image?: string;
  children?: React.ReactNode;
  className?: string;
}

export function Avatar({ 
  size = "medium", 
  image, 
  children, 
  className 
}: AvatarProps) {
  const sizeClasses = {
    small: "h-8 w-8 text-xs",
    medium: "h-10 w-10 text-sm", 
    large: "h-12 w-12 text-base"
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-[#4269aaff] text-[#00f0ffff] font-medium overflow-hidden",
        sizeClasses[size],
        className
      )}
    >
      {image ? (
        <img 
          src={image} 
          alt="Avatar" 
          className="h-full w-full object-cover"
        />
      ) : (
        children
      )}
    </div>
  );
}
