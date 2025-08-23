"use client";

import React, { useState, useEffect } from "react";
import { useWalletClient } from 'wagmi';
import { Button } from "@/ui/components/Button";
import { TextField } from "@/ui/components/TextField";
import { Badge } from "@/ui/components/Badge";
import { DefaultPageLayout } from "@/ui/layouts/DefaultPageLayout";
import Sidebar from "./components/Sidebar";
import { WalletConnection } from "./components/WalletConnection";
import { useBotContext } from "./contexts/BotContext";
import { apiService } from "./services/api";
import { 
  FeatherSettings,
  FeatherWallet,
  FeatherUser,
  FeatherBell,
  FeatherShield,
  FeatherMonitor,
  FeatherCreditCard,
  FeatherActivity,
  FeatherRefreshCw,
  FeatherTrendingUp,
  FeatherZap,
  FeatherPlay,
  FeatherPause
} from "@/subframe/core";

// Agent Configuration Panel Component
function AgentConfigPanel({ walletAddress }: { walletAddress: string }) {
  const { botState, startBot, stopBot, updateStatus, getSavedConfig } = useBotContext();
  const [config, setConfig] = useState({
    walletAddress: walletAddress,
    isActive: false
  });
  const { data: walletClient } = useWalletClient();
  const [isLoading, setIsLoading] = useState(false);
  const signer = walletClient;

  useEffect(() => {
    setConfig(prev => ({ ...prev, walletAddress }));
  }, [walletAddress]);


  const handleStartBot = async () => {
      if (botState.isRunning) {
        updateStatus('Bot is already running.');
        return;
      }
      
      // Get saved configuration from context
      const savedConfig = getSavedConfig();
      if (!config.walletAddress || !signer || !savedConfig || !savedConfig.volatilityThreshold || !savedConfig.maxTradeAmount) {
        updateStatus('Please connect wallet and configure bot in Agent Config first');
        return;
      }
  
      setIsLoading(true);
  
      try {
        // Request user approval for bot to execute trades
        updateStatus('Requesting approval to execute trades on your behalf...');
        
        const message = `Authorize NeonTradeBot to execute trades on your behalf\nWallet: ${config.walletAddress}\nMax Trade Amount: ${savedConfig.maxTradeAmount} USD\nVolatility Threshold: ${savedConfig.volatilityThreshold}%\nTimestamp: ${Date.now()}`;
        
        // Sign authorization message
        const signature = await signer?.signMessage({ message });
        
        updateStatus('Authorization signed! Starting bot...');
        
        // Start bot with signed authorization and saved config
        await startBot({
          ...savedConfig,
          walletAddress: config.walletAddress,
          authorization: {
            message,
            signature,
            timestamp: Date.now()
          }
        });
        
        setConfig((prev: any) => ({ ...prev, isActive: true }));
        updateStatus('Bot started successfully! Monitoring for trading opportunities...');
      } catch (error: any) {
        updateStatus(`Error: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

  const handleStopBot = async () => {
    if (!botState.isRunning) {
      updateStatus('No bot is currently running.');
      return;
    }
    
    setIsLoading(true);

    try {
      await stopBot();
      setConfig((prev: any) => ({ ...prev, isActive: false }));
    } catch (error: any) {
      updateStatus(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#1a0f3a] via-[#2a1f4a] to-[#3a2f5a] rounded-lg p-6 border-2 border-[#c82fff]/50 shadow-[0_0_40px_rgba(200,47,255,0.3)]">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-3 h-3 rounded-full bg-[#00f0ff] animate-pulse shadow-[0_0_10px_rgba(0,240,255,0.8)]"></div>
        <h2 className="text-2xl font-bold text-white drop-shadow-[0_0_10px_rgba(0,240,255,0.6)]">
          Bot Control Panel
        </h2>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-4">
          <div className="bg-[#0a0f2a] rounded-lg p-4 border border-[#4269aa]/30">
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-3 h-3 rounded-full ${botState.isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
              <span className="text-white font-medium">
                Agent Status: {botState.isRunning ? 'ACTIVE' : 'INACTIVE'}
              </span>
            </div>
            <div className="text-sm text-[#8ca1cc] mb-2">
              {botState.status}
            </div>
            {botState.isRunning && (
              <div className="text-sm text-[#00f0ff]">
                Monitoring markets for trading opportunities
              </div>
            )}
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="brand-primary"
              disabled={isLoading || !config.walletAddress || botState.isRunning}
              onClick={handleStartBot}
              icon={<FeatherPlay />}
              className="flex-1 hover:shadow-[0_0_25px_rgba(0,240,255,0.6)]"
            >
              {isLoading ? 'Deploying...' : 'Start Bot'}
            </Button>
            
            <Button
              variant="destructive-primary"
              disabled={!botState.isRunning || isLoading}
              onClick={handleStopBot}
              icon={<FeatherPause />}
              className="flex-1"
            >
              {isLoading ? 'Stopping...' : 'Stop Bot'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Trading Pairs Display Component
function TradingPairsPanel() {
  const [tradingPairs, setTradingPairs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTradingPairs();
    const interval = setInterval(fetchTradingPairs, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchTradingPairs = async () => {
    setIsLoading(true);
    try {
      // Fetch directly from backend services (Sei MCP -> Rivalz -> Hive -> Mock)
      const response = await fetch('http://localhost:3002/api/agents/trading-pairs');
      const pairs = await response.json();
      setTradingPairs(pairs);
    } catch (error) {
      console.error('Error fetching trading pairs:', error);
      // Fallback to empty array on error
      setTradingPairs([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#0a0f2a] via-[#1a1f3a] to-[#2a2f4a] rounded-lg p-6 border-2 border-[#00f0ff]/50 shadow-[0_0_40px_rgba(0,240,255,0.3)]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#c82fff] animate-pulse shadow-[0_0_10px_rgba(200,47,255,0.8)]"></div>
          <h2 className="text-2xl font-bold text-white drop-shadow-[0_0_10px_rgba(200,47,255,0.6)]">
            Live Trading Pairs
          </h2>
        </div>
        <Button
          variant="brand-secondary"
          size="medium"
          icon={<FeatherRefreshCw />}
          onClick={fetchTradingPairs}
          disabled={isLoading}
          className="hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]"
        >
          {isLoading ? 'Updating...' : 'Refresh'}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tradingPairs.map((pair: any, index) => {
          const changeValue = typeof pair.change === 'string' ? parseFloat(pair.change) : (pair.change || 0);
          const volatilityValue = typeof pair.volatility === 'string' ? parseFloat(pair.volatility) : (pair.volatility || 0);
          const isHighVolatility = volatilityValue > 8;
          
          return (
            <div key={index} className={`p-4 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${
              isHighVolatility 
                ? 'bg-gradient-to-br from-[#2a1f4a] to-[#3a2f5a] border-[#c82fff]/50 shadow-[0_0_20px_rgba(200,47,255,0.3)]'
                : 'bg-[#1a1f3a] border-[#4269aa]/30'
            }`}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[#00f0ff] font-bold text-lg">{pair.symbol}</span>
                <div className="flex items-center gap-1">
                  <div className={`w-4 h-4 ${changeValue >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {changeValue >= 0 ? '↗' : '↘'}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#8ca1cc]">Price:</span>
                  <span className="text-white font-mono">{pair.price || '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8ca1cc]">24h Change:</span>
                  <span className={`font-medium ${changeValue >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {changeValue.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8ca1cc]">Volatility:</span>
                  <span className={`font-medium ${isHighVolatility ? 'text-[#c82fff]' : 'text-[#00f0ff]'}`}>
                    {volatilityValue.toFixed(2)}%
                    {isHighVolatility && <FeatherZap className="inline w-3 h-3 ml-1" />}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8ca1cc]">Volume:</span>
                  <span className="text-white text-xs">{pair.volume || 'N/A'}</span>
                </div>
              </div>
              
              {isHighVolatility && (
                <div className="mt-3 p-2 bg-[#c82fff]/20 rounded border border-[#c82fff]/30">
                  <span className="text-[#c82fff] text-xs font-medium">⚡ High Volatility - Trade Candidate</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Live Activity Monitor Component
function LiveActivityMonitor() {
  const { botState } = useBotContext();
  const [activities, setActivities] = useState([
    { id: 1, type: 'info', message: 'System initialized', timestamp: new Date(), color: 'text-green-400' }
  ]);

  // Update activities based on bot state changes
  useEffect(() => {
    const newActivity = {
      id: Date.now(),
      type: botState.isRunning ? 'status' : 'info',
      message: botState.status,
      timestamp: new Date(),
      color: botState.isRunning ? 'text-green-400' : 'text-[#8ca1cc]'
    };
    
    setActivities(prev => [newActivity, ...prev.slice(0, 9)]); // Keep last 10 activities
  }, [botState.status, botState.isRunning]);

  return (
    <div className="bg-gradient-to-br from-[#1a0f3a] via-[#2a1f4a] to-[#3a2f5a] rounded-lg p-6 border-2 border-[#ca4e98]/50 shadow-[0_0_40px_rgba(202,78,152,0.3)]">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-3 h-3 rounded-full bg-[#ca4e98] animate-pulse shadow-[0_0_10px_rgba(202,78,152,0.8)]"></div>
        <h2 className="text-2xl font-bold text-white drop-shadow-[0_0_10px_rgba(202,78,152,0.6)]">
          ⚡ Live Activity Monitor
        </h2>
        <Badge variant={botState.isRunning ? 'success' : 'default'}>
          {botState.isRunning ? 'ACTIVE' : 'INACTIVE'}
        </Badge>
      </div>
      
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 p-3 bg-[#0a0f2a]/50 rounded-lg border border-[#4269aa]/20 hover:border-[#ca4e98]/30 transition-all duration-300">
            <div className="w-2 h-2 rounded-full bg-[#ca4e98] animate-pulse mt-2"></div>
            <div className="flex-1">
              <div className={`text-sm font-mono ${activity.color}`}>
                {activity.message}
              </div>
              <div className="text-xs text-[#8ca1cc] mt-1">
                {activity.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0a0f2a]/50 rounded-lg p-3 border border-[#4269aa]/30">
          <div className="text-[#8ca1cc] text-sm">Network Status</div>
          <div className="text-green-400 font-medium">Sei Testnet</div>
        </div>
        <div className="bg-[#0a0f2a]/50 rounded-lg p-3 border border-[#4269aa]/30">
          <div className="text-[#8ca1cc] text-sm">Finality</div>
          <div className="text-[#00f0ff] font-medium">&lt;400ms ⚡</div>
        </div>
        <div className="bg-[#0a0f2a]/50 rounded-lg p-3 border border-[#4269aa]/30">
          <div className="text-[#8ca1cc] text-sm">Active Pairs</div>
          <div className="text-[#c82fff] font-medium">4 Monitored</div>
        </div>
      </div>
    </div>
  );
}

// Crossmint Integration Panel Component
function CrossmintIntegrationPanel() {
  const [balance, setBalance] = useState('2.45 SEI');
  const [settlements, setSettlements] = useState([
    { id: '0x71C...9E3F', status: 'Completed', amount: '2.5 SEI', color: 'green' },
    { id: '0x82D...7A1B', status: 'Pending', amount: '1.8 SEI', color: 'yellow' },
    { id: '0x93F...2D4C', status: 'Failed', amount: '0.5 SEI', color: 'red' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const handleWithdraw = async () => {
    setIsLoading(true);
    setStatusMessage('Processing withdrawal...');
    try {
      const response = await fetch('http://localhost:3002/api/agents/crossmint/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: '0x1Ff9eA9F062C31cfF19Ade558E34894f07Cf7817',
          amount: balance
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setStatusMessage('Withdrawal initiated successfully!');
        setBalance('0.00 SEI');
        // Add new settlement record
        const newSettlement = {
          id: result.withdrawal.txHash.substring(0, 8) + '...' + result.withdrawal.txHash.slice(-4),
          status: 'Processing',
          amount: result.withdrawal.amount,
          color: 'yellow'
        };
        setSettlements(prev => [newSettlement, ...prev.slice(0, 2)]);
        // Refresh transaction history
        window.dispatchEvent(new CustomEvent('refreshTransactions'));
      } else {
        setStatusMessage('Withdrawal failed. Please try again.');
      }
    } catch (error) {
      setStatusMessage('Error processing withdrawal.');
    } finally {
      setIsLoading(false);
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  const handleMintNFT = async () => {
    setIsLoading(true);
    setStatusMessage('Minting Agent NFT...');
    try {
      const response = await fetch('http://localhost:3002/api/agents/crossmint/mint-nft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: '0x1Ff9eA9F062C31cfF19Ade558E34894f07Cf7817'
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setStatusMessage(`NFT minted successfully! Token ID: ${result.nft.tokenId || result.nft.id}`);
        // Refresh transaction history
        window.dispatchEvent(new CustomEvent('refreshTransactions'));
      } else {
        setStatusMessage('NFT minting failed. Please try again.');
      }
    } catch (error) {
      setStatusMessage('Error minting NFT.');
    } finally {
      setIsLoading(false);
      setTimeout(() => setStatusMessage(''), 5000);
    }
  };

  const handleProcessPayment = async () => {
    setIsLoading(true);
    setStatusMessage('Processing payment...');
    try {
      const response = await fetch('http://localhost:3002/api/agents/crossmint/process-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: '0x1Ff9eA9F062C31cfF19Ade558E34894f07Cf7817',
          amount: '10.0',
          currency: 'SEI',
          description: 'NeonTradeBot payment processing'
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setStatusMessage(`Payment processed successfully! TX: ${result.payment.txHash?.substring(0, 10)}...`);
        // Update balance
        const currentBalance = parseFloat(balance.replace(' SEI', ''));
        setBalance(`${(currentBalance + 10.0).toFixed(2)} SEI`);
        // Refresh transaction history
        window.dispatchEvent(new CustomEvent('refreshTransactions'));
      } else {
        setStatusMessage('Payment processing failed. Please try again.');
      }
    } catch (error) {
      setStatusMessage('Error processing payment.');
    } finally {
      setIsLoading(false);
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#0a0f2a] via-[#1a1f3a] to-[#2a2f4a] rounded-lg p-6 border-2 border-[#00f0ff]/50 shadow-[0_0_40px_rgba(0,240,255,0.3)]">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-3 h-3 rounded-full bg-[#00f0ff] animate-pulse shadow-[0_0_10px_rgba(0,240,255,0.8)]"></div>
        <h2 className="text-2xl font-bold text-white drop-shadow-[0_0_10px_rgba(0,240,255,0.6)]">
          💳 Crossmint Payments
        </h2>
      </div>
      
      {statusMessage && (
        <div className="mb-4 p-3 bg-[#1a1f3a] border border-[#00f0ff]/30 rounded-lg">
          <div className="text-[#00f0ff] text-sm">{statusMessage}</div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1a1f3a] rounded-lg p-4 border border-[#4269aa]/50">
          <div className="text-[#8ca1cc] text-sm mb-1">Available Balance</div>
          <div className="text-2xl font-bold text-[#00f0ff]">{balance}</div>
          <Button 
            variant="brand-primary" 
            size="medium" 
            className="mt-2 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]"
            onClick={handleWithdraw}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Withdraw'}
          </Button>
        </div>
        
        {settlements.map((settlement, index) => (
          <div key={index} className={`bg-[#1a1f3a] rounded-lg p-4 border border-${settlement.color}-500/30`}>
            <div className="text-[#8ca1cc] text-sm mb-1">{settlement.id}</div>
            <div className={`text-lg font-bold text-${settlement.color}-400`}>{settlement.status}</div>
            <div className="text-[#00f0ff]">{settlement.amount}</div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button 
          variant="brand-primary" 
          className="hover:shadow-[0_0_25px_rgba(0,240,255,0.6)]"
          onClick={handleMintNFT}
          disabled={isLoading}
        >
          {isLoading ? 'Minting...' : 'Mint Agent NFT'}
        </Button>
        <Button 
          variant="brand-secondary" 
          className="hover:shadow-[0_0_20px_rgba(200,47,255,0.4)]"
          onClick={handleProcessPayment}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Process Payment'}
        </Button>
      </div>
    </div>
  );
}

// Transaction History Table Component
function TransactionHistoryTable() {
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    try {
      const response = await fetch("http://localhost:3002/api/agents/transaction-history");
      const result = await response.json();
      setTransactions(result);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
    
    const interval = setInterval(fetchTransactions, 10000);
    return () => clearInterval(interval);
  }, []);

  // Listen for custom events to refresh transactions
  useEffect(() => {
    const handleRefresh = () => {
      fetchTransactions();
    };

    window.addEventListener('refreshTransactions', handleRefresh);
    return () => window.removeEventListener('refreshTransactions', handleRefresh);
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-[#4269aaff]">
            <th className="pb-3 text-[#8ca1ccff]">Transaction ID</th>
            <th className="pb-3 text-[#8ca1ccff]">Type</th>
            <th className="pb-3 text-[#8ca1ccff]">Asset</th>
            <th className="pb-3 text-[#8ca1ccff]">Amount</th>
            <th className="pb-3 text-[#8ca1ccff]">Status</th>
            <th className="pb-3 text-[#8ca1ccff]">Time</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-8 text-center text-[#8ca1ccff]">
                No transactions yet. Start trading to see your history here.
              </td>
            </tr>
          ) : (
            transactions.map((tx: any) => (
              <tr key={tx.id} className="border-b border-[#4269aaff]/30">
                <td className="py-3 text-[#00f0ffff] font-mono text-sm">{tx.id}</td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    tx.type === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {tx.type}
                  </span>
                </td>
                <td className="py-3 text-white">{tx.asset}</td>
                <td className="py-3 text-[#8ca1ccff]">{tx.amount}</td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    tx.status === 'EXECUTED' ? 'bg-green-500/20 text-green-400' :
                    tx.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {tx.status}
                  </span>
                </td>
                <td className="py-3 text-[#8ca1ccff]">{new Date(tx.timestamp).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}


interface TradingProps {
  walletAddress: string;
  onDisconnect: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

function Trading({ walletAddress, onDisconnect, onNavigate, currentPage }: TradingProps) {
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
          <span className="grow shrink-0 basis-0 text-heading-2 font-heading-2 text-[#00f0ffff] drop-shadow-[0_0_20px_rgba(0,240,255,0.6)]">
            NeonTradeBot Trading
          </span>
          <div className="flex items-center gap-4">
            <WalletConnection onDisconnect={onDisconnect} />
          </div>
        </div>
        
        <div className="flex w-full flex-col items-center justify-center gap-8 px-6 pt-8">
          <Sidebar currentPage={currentPage} onNavigate={onNavigate} />
        </div>
        
        <div className="flex w-full flex-col items-center justify-center px-6 py-12">
          <div className="w-full max-w-[1280px] flex flex-col gap-8">
            {/* Agent Configuration Section */}
            <AgentConfigPanel walletAddress={walletAddress} />
            
            {/* Trading Pairs Section */}
            <TradingPairsPanel />
            
            {/* Live Activity Monitor */}
            <LiveActivityMonitor />
            
            {/* Transaction History Section */}
            <div className="bg-gradient-to-br from-[#1a1f3a] via-[#2a2f4a] to-[#3a3f5a] rounded-lg p-6 border-2 border-[#ca4e98]/50 shadow-[0_0_40px_rgba(202,78,152,0.3)]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#ca4e98] animate-pulse shadow-[0_0_10px_rgba(202,78,152,0.8)]"></div>
                  <h2 className="text-2xl font-bold text-white drop-shadow-[0_0_10px_rgba(202,78,152,0.6)]">
                    Transaction History
                  </h2>
                </div>
                <Button variant="brand-secondary" icon={<FeatherRefreshCw />} className="hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]">
                  Refresh
                </Button>
              </div>
              
              <TransactionHistoryTable />
            </div>
            
            {/* Crossmint Integration Section */}
            <CrossmintIntegrationPanel />
          </div>
        </div>
      </div>
    </DefaultPageLayout>
  );
}

export default Trading;
