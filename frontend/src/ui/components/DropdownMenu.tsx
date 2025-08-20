"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface DropdownMenuProps {
  children: React.ReactNode;
  className?: string;
}

interface DropdownItemProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

function DropdownMenuRoot({ children, className }: DropdownMenuProps) {
  return (
    <div
      className={cn(
        "min-w-[200px] rounded-md border border-[#4269aaff] bg-[#030c36ff] p-1 shadow-lg",
        className
      )}
    >
      {children}
    </div>
  );
}

function DropdownMenuItem({ children, icon, onClick, className }: DropdownItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-sm px-3 py-2 text-sm text-[#00f0ffff] cursor-pointer hover:bg-[#4269aa1a] focus:bg-[#4269aa1a]",
        className
      )}
    >
      {icon && <div className="flex items-center">{icon}</div>}
      {children}
    </div>
  );
}

export const DropdownMenu = Object.assign(DropdownMenuRoot, {
  DropdownItem: DropdownMenuItem,
});
