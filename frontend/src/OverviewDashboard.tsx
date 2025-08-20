"use client";

import React from "react";
import { Button } from "@/ui/components/Button";
import { CleanPageLayout } from "@/ui/layouts/clean-page-layout";
import { 
  FeatherTrendingUp, 
  FeatherDollarSign, 
  FeatherActivity,
  FeatherSettings,
  FeatherWallet,
  FeatherBarChart3,
  FeatherPieChart,
  FeatherCreditCard
} from "@/subframe/core";

interface OverviewDashboardProps {
  walletAddress: string;
  onDisconnect: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

function OverviewDashboard({ walletAddress, onDisconnect, onNavigate }: OverviewDashboardProps) {
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
            {"WELCOME TO\nNEONTRADE BOT"}
          </span>
          <span className="max-w-[576px] whitespace-pre-wrap font-['Montserrat'] text-[20px] font-[500] leading-[28px] text-[#8ca1ccff] text-center -tracking-[0.015em]">
            {
              "Your AI-powered crypto trading companion. Navigate through different sections to manage your portfolio and configure your trading bot."
            }
          </span>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Button
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
              variant="neutral-tertiary"
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
          <div className="w-full max-w-[1280px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#1a1f3aff] rounded-lg p-6 text-center">
              <FeatherBarChart3 className="mx-auto mb-4 text-[#00f0ffff] w-12 h-12" />
              <h3 className="text-xl font-bold text-white mb-2">Trading Dashboard</h3>
              <p className="text-[#8ca1ccff] mb-4">View real-time market data and execute trades</p>
              <Button onClick={() => onNavigate("trades")}>
                Go to Trades
              </Button>
            </div>
            
            <div className="bg-[#1a1f3aff] rounded-lg p-6 text-center">
              <FeatherSettings className="mx-auto mb-4 text-[#00f0ffff] w-12 h-12" />
              <h3 className="text-xl font-bold text-white mb-2">Bot Configuration</h3>
              <p className="text-[#8ca1ccff] mb-4">Configure your AI trading agent settings</p>
              <Button onClick={() => onNavigate("agent-config")}>
                Configure Bot
              </Button>
            </div>
            
            <div className="bg-[#1a1f3aff] rounded-lg p-6 text-center">
              <FeatherPieChart className="mx-auto mb-4 text-[#00f0ffff] w-12 h-12" />
              <h3 className="text-xl font-bold text-white mb-2">Portfolio</h3>
              <p className="text-[#8ca1ccff] mb-4">Monitor your crypto portfolio performance</p>
              <Button onClick={() => onNavigate("trades")}>
                View Portfolio
              </Button>
            </div>
            
            <div className="bg-[#1a1f3aff] rounded-lg p-6 text-center">
              <FeatherCreditCard className="mx-auto mb-4 text-[#00f0ffff] w-12 h-12" />
              <h3 className="text-xl font-bold text-white mb-2">Payments</h3>
              <p className="text-[#8ca1ccff] mb-4">Manage billing and subscription</p>
              <Button onClick={() => onNavigate("payments")}>
                Manage Billing
              </Button>
            </div>
          </div>
        </div>
      </div>
    </CleanPageLayout>
  );
}

export default OverviewDashboard;
