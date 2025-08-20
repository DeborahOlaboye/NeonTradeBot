"use client";

import React from "react";
import { Button } from "@/ui/components/Button";
import { CleanPageLayout } from "@/ui/layouts/clean-page-layout";
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

function Settings({ walletAddress, onDisconnect, onNavigate }: SettingsProps) {
  return (
    <CleanPageLayout>
      <div className="flex h-full w-full flex-col items-start bg-[#0a0f2aff] min-h-screen">
        <div className="flex w-full flex-col items-center justify-center gap-2 px-6 py-6">
          <div className="flex w-full max-w-[1280px] items-center justify-between">
            <img
              className="h-8 flex-none object-cover"
              src="https://images.unsplash.com/photo-1701195618122-95f98c1b1164?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
            />
            <div className="flex items-center gap-4">
              <Button
                icon={<FeatherWallet />}
                onClick={onDisconnect}
              >
                Disconnect ({walletAddress})
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex w-full flex-col items-center justify-center gap-8 px-6 pt-20 pb-24">
          <span className="max-w-[1024px] whitespace-pre-wrap font-['Montserrat'] text-[72px] font-[900] leading-[68px] text-[#00f0ffff] text-center -tracking-[0.04em]">
            {"SETTINGS"}
          </span>
          <span className="max-w-[576px] whitespace-pre-wrap font-['Montserrat'] text-[20px] font-[500] leading-[28px] text-[#8ca1ccff] text-center -tracking-[0.015em]">
            {
              "Manage your account preferences, security settings, and application configuration"
            }
          </span>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Button
              variant="neutral-tertiary"
              size="large"
              onClick={() => onNavigate("overview")}
            >
              Overview
            </Button>
            <Button
              variant="neutral-tertiary"
              size="large"
              onClick={() => onNavigate("trades")}
            >
              Trades
            </Button>
            <Button
              variant="neutral-tertiary"
              size="large"
              onClick={() => onNavigate("agent-config")}
            >
              Agent Config
            </Button>
            <Button
              size="large"
              onClick={() => onNavigate("settings")}
            >
              Settings
            </Button>
            <Button
              variant="neutral-tertiary"
              size="large"
              onClick={() => onNavigate("payments")}
            >
              Payments
            </Button>
          </div>
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
    </CleanPageLayout>
  );
}

export default Settings;
