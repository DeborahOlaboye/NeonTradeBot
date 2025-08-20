"use client";

import React, { useState } from "react";
import { Button } from "@/ui/components/Button";
import { CleanPageLayout } from "@/ui/layouts/clean-page-layout";
import LandingPage from "./LandingPage";
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
    return <LandingPage onConnectWallet={connectWallet} />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "trades":
        return (
          <CryptoDashboard
            walletAddress={walletAddress}
            onDisconnect={disconnectWallet}
            onNavigate={navigateToPage}
            currentPage={currentPage}
          />
        );
      case "agent-config":
        return (
          <AgentConfig
            walletAddress={walletAddress}
            onDisconnect={disconnectWallet}
            onNavigate={navigateToPage}
            currentPage={currentPage}
          />
        );
      case "settings":
        return (
          <Settings
            walletAddress={walletAddress}
            onDisconnect={disconnectWallet}
            onNavigate={navigateToPage}
            currentPage={currentPage}
          />
        );
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
