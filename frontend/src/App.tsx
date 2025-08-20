"use client";

import React, { useState } from "react";
import { Button } from "@/ui/components/Button";
import { CleanPageLayout } from "@/ui/layouts/clean-page-layout";
import CryptoDashboard from "./CryptoDashboard";
import OverviewDashboard from "./OverviewDashboard";
import AgentConfig from "./AgentConfig";
import Settings from "./Settings";
import Payments from "./Payments";

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [currentPage, setCurrentPage] = useState("overview");

  const connectWallet = () => {
    // Simulate wallet connection
    const mockAddress = "0x1234...5678";
    setWalletAddress(mockAddress);
    setIsConnected(true);
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress("");
    setCurrentPage("overview");
  };

  const navigateToPage = (page: string) => {
    setCurrentPage(page);
  };

  if (!isConnected) {
    return (
      <CleanPageLayout>
        <div className="flex h-full w-full flex-col items-start bg-[#0a0f2aff] min-h-screen">
          <div className="flex w-full flex-col items-center justify-center gap-2 px-6 py-6">
            <div className="flex w-full max-w-[1280px] items-center justify-between">
              <img
                className="h-8 flex-none object-cover"
                src="https://images.unsplash.com/photo-1701195618122-95f98c1b1164?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
              />
            </div>
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-8 px-6 pt-20 pb-24">
            <span className="max-w-[1024px] whitespace-pre-wrap font-['Montserrat'] text-[72px] font-[900] leading-[68px] text-[#00f0ffff] text-center -tracking-[0.04em]">
              {"NEONTRADE BOT"}
            </span>
            <span className="max-w-[576px] whitespace-pre-wrap font-['Montserrat'] text-[20px] font-[500] leading-[28px] text-[#8ca1ccff] text-center -tracking-[0.015em]">
              {
                "Connect your wallet to access the AI-powered crypto trading platform. Experience automated trading with advanced risk management."
              }
            </span>
            <Button size="x-large" onClick={connectWallet}>
              Connect Wallet
            </Button>
          </div>
        </div>
      </CleanPageLayout>
    );
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "trades":
        return <CryptoDashboard />;
      case "agent-config":
        return <AgentConfig />;
      case "settings":
        return <CryptoDashboard />;
      case "payments":
        return (
          <Payments
            walletAddress={walletAddress}
            onDisconnect={disconnectWallet}
            onNavigate={navigateToPage}
            currentPage={currentPage}
          />
        );
      default:
        return (
          <OverviewDashboard
            walletAddress={walletAddress}
            onDisconnect={disconnectWallet}
            onNavigate={navigateToPage}
            currentPage={currentPage}
          />
        );
    }
  };

  return renderCurrentPage();
}
