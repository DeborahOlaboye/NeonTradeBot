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
import { apiService } from "./services/api";
import { NetworkStats } from "./services/api";
import Sidebar from "./components/Sidebar";
import { WalletConnection } from "./components/WalletConnection";

interface OverviewDashboardProps {
  walletAddress: string;
  onDisconnect: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

function OverviewDashboard({ walletAddress, onDisconnect, onNavigate, currentPage }: OverviewDashboardProps) {
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
        // Set fallback data to show something
        setNetworkStats({
          blockNumber: 0,
          gasPrice: '0',
          contractBalance: '0',
          networkStatus: 'DISCONNECTED',
          chainId: 1328,
          finality: 'N/A'
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch with delay to ensure backend is ready
    setTimeout(fetchNetworkStats, 1000);

    // Set up real-time updates
    apiService.onNetworkUpdate((data) => {
      setNetworkStats(data);
      setError(null);
    });

    // Fetch network stats every 10 seconds
    const interval = setInterval(fetchNetworkStats, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <CleanPageLayout>
      <div className="flex h-full w-full flex-col items-start bg-[#0a0f2aff] min-h-screen">
        <div className="flex w-full items-center gap-4 border-b border-solid border-neutral-border px-6 py-6">
          <img
            className="h-10 flex-none object-contain cursor-pointer hover:opacity-80 transition-opacity"
            src="/src/assets/neon-logo.svg"
            alt="NeonTradeBot"
            onClick={() => window.location.href = '/'}
          />
          <span className="grow shrink-0 basis-0 text-heading-2 font-heading-2 text-[#00f0ffff]">
            Dashboard
          </span>
          <div className="flex items-center gap-4">
            <WalletConnection onDisconnect={onDisconnect} />
          </div>
        </div>
        
        <div className="flex w-full flex-col items-center justify-center gap-8 px-6 pt-8">
          <Sidebar currentPage={currentPage} onNavigate={onNavigate} />
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
              <FeatherBarChart3 style={{ width: '32px', height: '32px', color: '#c82fff', margin: '0 auto 12px' }} />
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
              <div className="w-8 h-8 text-[#c82fff] mx-auto mb-3 flex items-center justify-center">
                <FeatherDollarSign />
              </div>
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
              <div className="w-8 h-8 text-[#c82fff] mx-auto mb-3 flex items-center justify-center">
                <FeatherWallet />
              </div>
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
