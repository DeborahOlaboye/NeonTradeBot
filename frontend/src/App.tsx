"use client";

import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/ui/components/Button";
import { CleanPageLayout } from "@/ui/layouts/clean-page-layout";
import LandingPage from "./LandingPage";
import AgentConfig from "./AgentConfig";
import OverviewDashboard from "./OverviewDashboard";
import CryptoDashboard from "./CryptoDashboard";
import Dashboard from "./Dashboard";
import Payments from "./Payments";
import { WalletProvider } from "./providers/WalletProvider";

function AppContent() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const navigate = useNavigate();

  const connectWallet = (address: string) => {
    setWalletAddress(address);
    setIsConnected(true);
    navigate('/dashboard');
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress("");
    // Force navigation to root and replace history
    setTimeout(() => navigate('/', { replace: true }), 0);
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
            <OverviewDashboard
              walletAddress={walletAddress}
              onDisconnect={disconnectWallet}
              onNavigate={navigateToPage}
              currentPage="overview"
            />
        } 
      />
      <Route 
        path="/trades" 
        element={
          !isConnected ? 
            <Navigate to="/" replace /> : 
            <CryptoDashboard
              walletAddress={walletAddress}
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
              walletAddress={walletAddress}
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
              walletAddress={walletAddress}
              onDisconnect={disconnectWallet}
              onNavigate={navigateToPage}
              currentPage="payments"
            />
        } 
      />
      <Route 
        path="/settings" 
        element={
          !isConnected ? 
            <Navigate to="/" replace /> : 
            <CryptoDashboard
              walletAddress={walletAddress}
              onDisconnect={disconnectWallet}
              onNavigate={navigateToPage}
              currentPage="settings"
            />
        } 
      />
    </Routes>
  );
}

export default function App() {
  return (
    <WalletProvider>
      <Router>
        <AppContent />
      </Router>
    </WalletProvider>
  );
}
