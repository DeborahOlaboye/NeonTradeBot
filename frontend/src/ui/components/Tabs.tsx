"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface TabsProps {
  children: React.ReactNode;
  className?: string;
}

interface TabsItemProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

function TabsRoot({ children, className }: TabsProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {children}
    </div>
  );
}

function TabsItem({ children, active = false, onClick, className }: TabsItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 text-sm font-medium transition-all rounded-md border-b-2 border-transparent hover:bg-[#4269aa1a]",
        {
          "text-[#00f0ffff] border-b-[#00f0ffff] bg-[#00f0ff1a]": active,
          "text-[#8ca1ccff] hover:text-[#00f0ffff]": !active,
        },
        className
      )}
    >
      {children}
    </button>
  );
}

export const Tabs = Object.assign(TabsRoot, {
  Item: TabsItem,
});
