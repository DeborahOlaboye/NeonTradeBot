"use client";

import React from "react";
import { Button } from "@/ui/components/Button";
import { 
  FeatherActivity,
  FeatherSettings,
  FeatherBarChart3,
  FeatherCreditCard,
  FeatherTrendingUp
} from "@/subframe/core";

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navigationItems = [
  { id: "overview", label: "Overview", icon: FeatherActivity },
  { id: "agent-config", label: "Agent Config", icon: FeatherTrendingUp },
  { id: "trades", label: "Trades", icon: FeatherBarChart3 },
  { id: "payments", label: "Payments", icon: FeatherCreditCard },
  { id: "settings", label: "Settings", icon: FeatherSettings },
];

function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <div className="w-full max-w-[1280px] bg-[#1a1f3aff] rounded-lg p-4 mb-8 border border-[#c82fff33]">
      <div className="flex flex-wrap items-center justify-center gap-4">
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Button
              key={item.id}
              size="medium"
              variant={currentPage === item.id ? "brand-primary" : "neutral-tertiary"}
              icon={<IconComponent />}
              onClick={() => onNavigate(item.id)}
            >
              {item.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export default Sidebar;
