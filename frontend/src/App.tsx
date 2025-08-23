"use client";

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { Button } from "@/ui/components/Button";
import { CleanPageLayout } from "@/ui/layouts/clean-page-layout";
import LandingPage from "./LandingPage";
import AgentConfig from "./AgentConfig";
import OverviewDashboard from "./OverviewDashboard";
import CryptoDashboard from "./CryptoDashboard";
import Dashboard from "./Dashboard";
import Payments from "./Payments";
import Trading from "./Settings";
import { WalletProvider } from "./providers/WalletProvider";
import { BotProvider } from "./contexts/BotContext";
import { TradeExecutor } from "./components/TradeExecutor";

function AppContent() {
  const { address, isConnected } = useAccount();
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Sync wallet state with Wagmi
  useEffect(() => {
    if (!isConnected && address) {
      // Wallet was disconnected, redirect to homepage
      navigate('/', { replace: true });
      setIsAuthorized(false);
    }
  }, [isConnected, address, navigate]);

  const connectWallet = (walletAddress: string) => {
    navigate('/dashboard');
  };

  const disconnectWallet = () => {
    // Force navigation to root and replace history
    navigate('/', { replace: true });
  };

  const navigateToPage = (page: string) => {
    navigate(`/${page}`);
  };

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          isConnected ? 
            <Navigate to="/dashboard" replace /> : 
            <LandingPage onConnect={connectWallet} />
        } 
      />
      <Route 
        path="/overview" 
        element={<Navigate to="/dashboard" replace />} 
      />
      <Route 
        path="/dashboard" 
        element={
          !isConnected ? 
            <Navigate to="/" replace /> : 
            <>
              <OverviewDashboard
                walletAddress={address || ""}
                onDisconnect={disconnectWallet}
                onNavigate={navigateToPage}
                currentPage="overview"
              />
              <TradeExecutor isAuthorized={isAuthorized} />
            </>
        } 
      />
      <Route 
        path="/trades" 
        element={
          !isConnected ? 
            <Navigate to="/" replace /> : 
            <Trading
              walletAddress={address || ""}
              onDisconnect={disconnectWallet}
              onNavigate={navigateToPage}
              currentPage="trades"
            />
        } 
      />
      <Route 
        path="/agent-config" 
        element={
          !isConnected ? 
            <Navigate to="/" replace /> : 
            <AgentConfig
              walletAddress={address || ""}
              onDisconnect={disconnectWallet}
              onNavigate={navigateToPage}
              currentPage="agent-config"
            />
        } 
      />
      <Route 
        path="/payments" 
        element={
          !isConnected ? 
            <Navigate to="/" replace /> : 
            <Payments
              walletAddress={address || ""}
              onDisconnect={disconnectWallet}
              onNavigate={navigateToPage}
              currentPage="payments"
            />
        } 
      />
      <Route 
        path="/transactions" 
        element={
          !isConnected ? 
            <Navigate to="/" replace /> : 
            <Dashboard
              walletAddress={address || ""}
              onDisconnect={disconnectWallet}
              onNavigate={navigateToPage}
              currentPage="transactions"
            />
        } 
      />
    </Routes>
  );
}

export default function App() {
  return (
    <WalletProvider>
      <BotProvider>
        <Router>
          <AppContent />
        </Router>
      </BotProvider>
    </WalletProvider>
  );
}
