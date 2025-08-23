"use client";

import React, { useState, useEffect } from "react";
import { useAccount, useWalletClient } from 'wagmi';
import { ethers } from 'ethers';
import { Button } from "@/ui/components/Button";
import { DefaultPageLayout } from "@/ui/layouts/DefaultPageLayout";
import { TextField } from "@/ui/components/TextField";
import { Badge } from "@/ui/components/Badge";
import { Alert } from "@/ui/components/Alert";
import { FeatherActivity, FeatherSettings, FeatherPlay, FeatherRefreshCw } from "@/subframe/core";
import Sidebar from "./components/Sidebar";
import { WalletConnection } from "./components/WalletConnection";
import { apiService } from "./services/api";
import { useBotContext } from "./contexts/BotContext";
import { LiveTradeHistory } from "./components/LiveTradeHistory";

interface AgentConfigProps {
  walletAddress: string;
  onDisconnect: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

function AgentConfig({ walletAddress, onDisconnect, onNavigate, currentPage }: AgentConfigProps) {
  const { botState, startBot, stopBot, updateStatus, saveConfig, getSavedConfig } = useBotContext();
  const [config, setConfig] = useState<any>({
    walletAddress: walletAddress,
    volatilityThreshold: '',
    maxTradeAmount: '',
    isActive: false
  });
  const [status, setStatus] = useState('Ready to configure agent');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [tradingPairs, setTradingPairs] = useState<any[]>([]);
  const { data: walletClient } = useWalletClient();
  const signer = walletClient;
  // Remove local botRunning state - use global botState instead

  useEffect(() => {
    setConfig((prev: any) => ({ ...prev, walletAddress: walletAddress }));
    fetchTradingPairs();
    
    // Listen for market updates
    const handleMarketUpdate = (data: any) => {
      console.log('Market update:', data);
    };
    
    window.addEventListener('marketUpdate', handleMarketUpdate);
    return () => window.removeEventListener('marketUpdate', handleMarketUpdate);
  }, [walletAddress]);


  const fetchTradingPairs = async () => {
    try {
      const pairs = await apiService.getTradingPairs();
      setTradingPairs(pairs);
    } catch (error) {
      console.error('Error fetching trading pairs:', error);
    }
  };

  const handleSaveConfig = () => {
    if (!config.volatilityThreshold || !config.maxTradeAmount) {
      updateStatus('Please fill in all configuration fields');
      return;
    }
    
    // Save to shared context
    saveConfig({
      walletAddress: config.walletAddress,
      volatilityThreshold: parseFloat(config.volatilityThreshold),
      maxTradeAmount: parseFloat(config.maxTradeAmount)
    });
    
    setIsSaved(true);
    updateStatus('Configuration saved successfully!');
    setTimeout(() => updateStatus('Ready to start bot with saved configuration'), 2000);
  };

  



  const handleTradeSignal = async (event: any) => {
    const tradeData = event.detail;
    if (!signer || !config.walletAddress) {
      updateStatus('Please connect your wallet first');
      return;
    }

    try {
      setStatus(`Trade opportunity detected! Volatility: ${tradeData.volatility}`);
      
      const contract = new ethers.Contract(
        '0x7fc58f2d50790f6cddb631b4757f54b893692dde',
        ['function executeTrade(address token, uint256 amount, bool isBuy) external'],
        signer
      );
      
      const tx = await contract.executeTrade(
        ethers.getAddress('0x1234567890123456789012345678901234567890'), // Mock token
        ethers.parseEther('0.1'),
        true
      );
      
      await tx.wait();
      updateStatus(`Trade executed successfully! TX: ${tx.hash}`);
    } catch (error: any) {
      updateStatus(`Trade failed: ${error.message}`);
    } 
  };

  return (
    <DefaultPageLayout>
      <div className="container max-w-none flex h-full w-full flex-col items-start bg-[#0a0f2aff]">
        <div className="flex w-full items-center gap-4 border-b border-solid border-neutral-border px-6 py-6">
        <img
            className="h-20 flex-none object-contain cursor-pointer hover:opacity-80 transition-opacity"
            src="/neon-logo.png"
            alt="NeonTradeBot"
            onClick={() => window.location.href = '/'}
          />
          <span className="grow shrink-0 basis-0 text-heading-2 font-heading-2 text-[#00f0ffff]">
            Agent Configuration
          </span>
          <div className="flex items-center gap-4">
            <WalletConnection onDisconnect={onDisconnect} />
          </div>
        </div>
        
        <div className="flex w-full flex-col items-center justify-center gap-8 px-6 pt-8">
          <Sidebar currentPage={currentPage} onNavigate={onNavigate} />
          
          <div className="w-full max-w-2xl">
            <Alert
              variant={status.includes('✅') ? 'success' : status.includes('❌') ? 'error' : 'brand'}
              title={status || 'Configure Your Trading Bot'}
              description={status || 'Set up your trading parameters. The bot will use your connected wallet for secure authentication.'}
            />
            
            <div className="mt-8 space-y-6">
              
              {/* Bot Configuration Section */}
              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700 space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">Bot Configuration</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Volatility Threshold (%)
                  </label>
                  <TextField>
                    <TextField.Input
                      placeholder="e.g., 8.5"
                      value={config.volatilityThreshold}
                      onChange={(e) => setConfig((prev: any) => ({ ...prev, volatilityThreshold: e.target.value }))}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </TextField>
                  <p className="text-xs text-gray-400 mt-1">
                    Bot will trigger trades when price changes exceed this percentage
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Max Trade Amount (USD)
                  </label>
                  <TextField>
                    <TextField.Input
                      placeholder="e.g., 500"
                      value={config.maxTradeAmount}
                      onChange={(e) => setConfig((prev: any) => ({ ...prev, maxTradeAmount: e.target.value }))}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </TextField>
                  <p className="text-xs text-gray-400 mt-1">
                    Maximum amount per trade in USD
                  </p>
                </div>
                
                <Button
                  variant="brand-secondary"
                  onClick={handleSaveConfig}
                  disabled={!config.volatilityThreshold || !config.maxTradeAmount}
                  className="w-full"
                >
                  {isSaved ? 'Configuration Saved' : 'Save Configuration'}
                </Button>
              </div>
              
              {status && (
                <div className="mb-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg text-blue-300">
                  {status}
                </div>
              )}
              
              {/* Trading Pairs Display */}
              {tradingPairs.length > 0 && (
                <div className="mt-6 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Available Trading Pairs</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tradingPairs.map((pair: any, index) => {
                      const changeValue = typeof pair.change === 'string' ? parseFloat(pair.change) : (pair.change || 0);
                      const volatilityValue = typeof pair.volatility === 'string' ? parseFloat(pair.volatility) : (pair.volatility || 0);
                      
                      return (
                        <div key={index} className="p-3 bg-gray-800/50 rounded border border-purple-500/30">
                          <div className="flex justify-between items-center">
                            <span className="text-purple-300 font-medium">{pair.symbol}</span>
                            <span className="text-green-400">{pair.price || '0.00'}</span>
                          </div>
                          <div className="flex justify-between items-center mt-2 text-sm">
                            <span className="text-gray-400">24h Change:</span>
                            <span className={`${changeValue >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {changeValue.toFixed(2)}%
                            </span>
                          </div>
                          <div className="flex justify-between items-center mt-1 text-sm">
                            <span className="text-gray-400">Volatility:</span>
                            <span className="text-blue-400">{volatilityValue.toFixed(2)}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {/* Bot Status Indicator */}
              <div className="mt-4 p-3 rounded-lg border">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${botState.isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
                  <span className="text-white font-medium">
                    Bot Status: {botState.isRunning ? 'ACTIVE - Monitoring Markets' : 'INACTIVE'}
                  </span>
                </div>
                {botState.isRunning && (
                  <div className="mt-2 text-sm text-gray-400">
                    Watching for volatility above {config.volatilityThreshold}% on {tradingPairs.length} pairs
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Live Trade History Section */}
          <div className="mt-6">
            <LiveTradeHistory 
              agentId="default" 
              isVisible={botState.isRunning} 
            />
          </div>
        </div>
      </div>
    </DefaultPageLayout>
  );
}

export default AgentConfig;
