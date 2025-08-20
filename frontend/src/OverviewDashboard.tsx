"use client";

import React, { useState, useEffect } from "react";
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
import apiService, { NetworkStats } from "./services/api";

interface OverviewDashboardProps {
  walletAddress: string;
  onDisconnect: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

function OverviewDashboard({ walletAddress, onDisconnect, onNavigate }: OverviewDashboardProps) {
  const [networkStats, setNetworkStats] = useState<NetworkStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNetworkStats = async () => {
      try {
        setIsLoading(true);
        const stats = await apiService.getNetworkStats();
        setNetworkStats(stats);
        setError(null);
      } catch (err) {
        setError('Failed to connect to backend');
        console.error('Error fetching network stats:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNetworkStats();

    // Set up real-time updates
    apiService.onNetworkUpdate((data) => {
      setNetworkStats(data);
    });

    // Refresh every 10 seconds
    const interval = setInterval(fetchNetworkStats, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

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
            
            {/* Network Status Card */}
            <div className="bg-[#1a1f3aff] rounded-lg p-6 text-center border border-[#c82fff33]">
              <FeatherActivity className="w-8 h-8 text-[#c82fff] mx-auto mb-3" />
              <h3 className="text-[#00f0ffff] text-lg font-semibold mb-2">Network Status</h3>
              {isLoading ? (
                <p className="text-[#8ca1ccff]">Loading...</p>
              ) : error ? (
                <p className="text-red-400">Offline</p>
              ) : (
                <p className="text-green-400">{networkStats?.networkStatus || 'Unknown'}</p>
              )}
            </div>

            {/* Block Number Card */}
            <div className="bg-[#1a1f3aff] rounded-lg p-6 text-center border border-[#c82fff33]">
              <FeatherBarChart3 className="w-8 h-8 text-[#c82fff] mx-auto mb-3" />
              <h3 className="text-[#00f0ffff] text-lg font-semibold mb-2">Latest Block</h3>
              {isLoading ? (
                <p className="text-[#8ca1ccff]">Loading...</p>
              ) : (
                <p className="text-[#00f0ffff] text-xl font-mono">
                  {networkStats?.blockNumber?.toLocaleString() || '---'}
                </p>
              )}
            </div>

            {/* Gas Price Card */}
            <div className="bg-[#1a1f3aff] rounded-lg p-6 text-center border border-[#c82fff33]">
              <FeatherDollarSign className="w-8 h-8 text-[#c82fff] mx-auto mb-3" />
              <h3 className="text-[#00f0ffff] text-lg font-semibold mb-2">Gas Price</h3>
              {isLoading ? (
                <p className="text-[#8ca1ccff]">Loading...</p>
              ) : (
                <p className="text-[#00f0ffff] text-xl">
                  {networkStats?.gasPrice || '---'} gwei
                </p>
              )}
            </div>

            {/* Contract Balance Card */}
            <div className="bg-[#1a1f3aff] rounded-lg p-6 text-center border border-[#c82fff33]">
              <FeatherWallet className="w-8 h-8 text-[#c82fff] mx-auto mb-3" />
              <h3 className="text-[#00f0ffff] text-lg font-semibold mb-2">Contract Balance</h3>
              {isLoading ? (
                <p className="text-[#8ca1ccff]">Loading...</p>
              ) : (
                <p className="text-[#00f0ffff] text-xl">
                  {networkStats?.contractBalance || '0'} SEI
                </p>
              )}
            </div>

          </div>
          
          {/* Real-time Network Info */}
          <div className="w-full max-w-[1280px] mt-8 bg-[#1a1f3aff] rounded-lg p-6 border border-[#c82fff33]">
            <h3 className="text-[#00f0ffff] text-xl font-semibold mb-4">Live Network Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-[#8ca1ccff]">Chain ID:</span>
                <span className="text-[#00f0ffff] ml-2 font-mono">
                  {networkStats?.chainId || '---'}
                </span>
              </div>
              <div>
                <span className="text-[#8ca1ccff]">Finality:</span>
                <span className="text-[#00f0ffff] ml-2">
                  {networkStats?.finality || '---'}
                </span>
              </div>
              <div>
                <span className="text-[#8ca1ccff]">Contract:</span>
                <span className="text-[#00f0ffff] ml-2 font-mono text-xs">
                  0x7fc5...2dde
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CleanPageLayout>
  );
}

export default OverviewDashboard;
