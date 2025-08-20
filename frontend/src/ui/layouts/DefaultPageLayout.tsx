"use client";

import React from "react";

interface DefaultPageLayoutProps {
  children: React.ReactNode;
}

export function DefaultPageLayout({ children }: DefaultPageLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-[#0a0f2aff]">
      {children}
    </div>
  );
}
