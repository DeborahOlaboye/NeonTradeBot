"use client";

import React from "react";
import { Button } from "@/ui/components/Button";
import { DefaultPageLayout } from "@/ui/layouts/DefaultPageLayout";
import Sidebar from "./components/Sidebar";
import { 
  FeatherSettings,
  FeatherWallet,
  FeatherUser,
  FeatherBell,
  FeatherShield,
  FeatherMonitor
} from "@/subframe/core";

interface SettingsProps {
  walletAddress: string;
  onDisconnect: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

function Settings({ walletAddress, onDisconnect, onNavigate, currentPage }: SettingsProps) {
  return (
    <DefaultPageLayout>
      <div className="container max-w-none flex h-full w-full flex-col items-start bg-[#0a0f2aff]">
        <div className="flex w-full items-center gap-4 border-b border-solid border-neutral-border px-6 py-6">
          <img
            className="h-10 flex-none object-contain"
            src="/src/assets/neon-logo.svg"
            alt="NeonTradeBot"
          />
          <span className="grow shrink-0 basis-0 text-heading-2 font-heading-2 text-[#00f0ffff]">
            Settings
          </span>
          <div className="flex items-start gap-2">
            <Button
              icon={<FeatherWallet />}
              onClick={onDisconnect}
            >
              Disconnect ({walletAddress})
            </Button>
          </div>
        </div>
        
        <div className="flex w-full flex-col items-center justify-center gap-8 px-6 pt-8">
          <Sidebar currentPage={currentPage} onNavigate={onNavigate} />
        </div>
        
        <div className="flex w-full flex-col items-center justify-center px-6 py-12">
          <div className="w-full max-w-[1280px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[#1a1f3aff] rounded-lg p-6">
              <FeatherUser className="mb-4 text-[#00f0ffff] w-8 h-8" />
              <h3 className="text-xl font-bold text-white mb-2">Profile</h3>
              <p className="text-[#8ca1ccff] mb-4">Update your personal information</p>
              <Button variant="brand-secondary">Edit Profile</Button>
            </div>
            
            <div className="bg-[#1a1f3aff] rounded-lg p-6">
              <FeatherBell className="mb-4 text-[#00f0ffff] w-8 h-8" />
              <h3 className="text-xl font-bold text-white mb-2">Notifications</h3>
              <p className="text-[#8ca1ccff] mb-4">Configure alert preferences</p>
              <Button variant="brand-secondary">Manage</Button>
            </div>
            
            <div className="bg-[#1a1f3aff] rounded-lg p-6">
              <FeatherShield className="mb-4 text-[#00f0ffff] w-8 h-8" />
              <h3 className="text-xl font-bold text-white mb-2">Security</h3>
              <p className="text-[#8ca1ccff] mb-4">Two-factor authentication and security</p>
              <Button variant="brand-secondary">Configure</Button>
            </div>
          </div>
        </div>
      </div>
    </DefaultPageLayout>
  );
}

export default Settings;
