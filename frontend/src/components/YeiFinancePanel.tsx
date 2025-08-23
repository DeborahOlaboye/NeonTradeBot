import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Button } from "@/ui/components/Button";
import { TextField } from "@/ui/components/TextField";
import { Badge } from "@/ui/components/Badge";
import { Alert } from "@/ui/components/Alert";
import { 
  FeatherTrendingUp, 
  FeatherDollarSign, 
  FeatherShield,
  FeatherRefreshCw,
  FeatherPlay,
  FeatherZap
} from "@/subframe/core";

interface YieldOpportunity {
  asset: string;
  supplyAPY: number;
  borrowAPY: number;
  netYield: number;
  protocol: string;
  risk: string;
}

interface AccountData {
  totalCollateralETH: string;
  totalDebtETH: string;
  availableBorrowsETH: string;
  healthFactor: string;
}

interface ProtocolStats {
  totalValueLocked: string;
  bestYieldAsset: string;
  bestYieldAPY: string;
  supportedAssets: string;
}

function YeiFinancePanel() {
  const { address, isConnected } = useAccount();
  const [opportunities, setOpportunities] = useState<YieldOpportunity[]>([]);
  const [accountData, setAccountData] = useState<AccountData | null>(null);
  const [protocolStats, setProtocolStats] = useState<ProtocolStats | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Supply form state
  const [supplyAsset, setSupplyAsset] = useState('SEI');
  const [supplyAmount, setSupplyAmount] = useState('');
  const [isSupplying, setIsSupplying] = useState(false);
  
  // Yield optimization state
  const [optimizeAmount, setOptimizeAmount] = useState('');
  const [riskTolerance, setRiskTolerance] = useState('medium');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (address) {
      fetchYeiData();
      const interval = setInterval(fetchYeiData, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [address]);

  const fetchYeiData = async () => {
    try {
      // Fetch yield opportunities
      const response = await fetch('http://localhost:3002/api/agents/yei/opportunities');
      const data = await response.json();
      setOpportunities(data.opportunities || []);
      
      // Fetch account data if wallet is connected
      if (address) {
        const accountResponse = await fetch(`http://localhost:3002/api/agents/yei/account/${address}`);
        const accountData = await accountResponse.json();
        setAccountData(accountData);
      }
      
      // Fetch protocol stats
      const statsResponse = await fetch('http://localhost:3002/api/agents/yei/stats');
      const statsData = await statsResponse.json();
      setProtocolStats(statsData);
    } catch (error) {
      console.error('Error fetching Yei Finance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSupply = async () => {
    if (!supplyAmount || !supplyAsset) {
      setStatusMessage('Please enter amount and select asset');
      return;
    }

    setIsSupplying(true);
    setStatusMessage('Supplying assets to Yei Finance...');

    try {
      const response = await fetch('http://localhost:3002/api/agents/yei/supply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          asset: supplyAsset,
          amount: parseFloat(supplyAmount),
          userAddress: address
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setStatusMessage(`Successfully supplied ${supplyAmount} ${supplyAsset}! APY: ${result.yieldAPY || 'N/A'}%`);
        setSupplyAmount('');
        fetchYeiData(); // Refresh data
      } else {
        setStatusMessage(`Supply failed: ${result.error}`);
      }
    } catch (error) {
      setStatusMessage('Error supplying assets');
      console.error('Supply error:', error);
    } finally {
      setIsSupplying(false);
      setTimeout(() => setStatusMessage(''), 5000);
    }
  };

  const handleOptimizeYield = async () => {
    setIsOptimizing(true);
    setStatusMessage('Optimizing yield strategy...');

    try {
      const response = await fetch('http://localhost:3002/api/agents/yei/optimize-yield', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAddress: address,
          availableBalance: parseFloat(optimizeAmount) || 100,
          riskTolerance: riskTolerance
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setStatusMessage(`Yield optimized! Strategy: ${result.strategy}`);
        setOptimizeAmount('');
        fetchYeiData();
      } else {
        setStatusMessage(`Optimization failed: ${result.error || result.message}`);
      }
    } catch (error) {
      setStatusMessage('Error optimizing yield');
      console.error('Optimization error:', error);
    } finally {
      setIsOptimizing(false);
      setTimeout(() => setStatusMessage(''), 5000);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#0a0f2a] via-[#1a1f3a] to-[#2a2f4a] rounded-lg p-6 border-2 border-[#00f0ff]/50 shadow-[0_0_40px_rgba(0,240,255,0.3)]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#00f0ff] animate-pulse shadow-[0_0_10px_rgba(0,240,255,0.8)]"></div>
          <h2 className="text-2xl font-bold text-white drop-shadow-[0_0_10px_rgba(0,240,255,0.6)]">
            Yei Finance
          </h2>
        </div>
        <Button
          variant="brand-secondary"
          size="medium"
          icon={<FeatherRefreshCw />}
          onClick={fetchYeiData}
          disabled={loading}
          className="hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]"
        >
          Refresh
        </Button>
      </div>

      {statusMessage && (
        <div className="mb-4 p-3 bg-[#1a1f3a] border border-[#00f0ff]/30 rounded-lg">
          <div className="text-[#00f0ff] text-sm">{statusMessage}</div>
        </div>
      )}

      {/* Protocol Stats */}
      {protocolStats && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#1a1f3a] rounded-lg p-4 border border-[#4269aa]/50">
            <div className="text-[#8ca1cc] text-sm mb-1">Total Value Locked</div>
            <div className="text-2xl font-bold text-[#00f0ff]">${protocolStats.totalValueLocked}</div>
          </div>
          <div className="bg-[#1a1f3a] rounded-lg p-4 border border-[#4269aa]/50">
            <div className="text-[#8ca1cc] text-sm mb-1">Best Yield Asset</div>
            <div className="text-lg font-bold text-[#c82fff]">{protocolStats.bestYieldAsset}</div>
            <div className="text-sm text-green-400">{protocolStats.bestYieldAPY}% APY</div>
          </div>
          <div className="bg-[#1a1f3a] rounded-lg p-4 border border-[#4269aa]/50">
            <div className="text-[#8ca1cc] text-sm mb-1">Supported Assets</div>
            <div className="text-2xl font-bold text-[#00f0ff]">{protocolStats.supportedAssets}</div>
          </div>
        </div>
      )}

      {/* Account Data */}
      {accountData && (
        <div className="mb-6 bg-[#1a1f3a] rounded-lg p-4 border border-[#4269aa]/50">
          <h3 className="text-lg font-semibold text-white mb-3">Your Yei Finance Account</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-[#8ca1cc] text-sm">Collateral</div>
              <div className="text-white font-mono">{parseFloat(accountData.totalCollateralETH).toFixed(4)} ETH</div>
            </div>
            <div>
              <div className="text-[#8ca1cc] text-sm">Debt</div>
              <div className="text-white font-mono">{parseFloat(accountData.totalDebtETH).toFixed(4)} ETH</div>
            </div>
            <div>
              <div className="text-[#8ca1cc] text-sm">Available to Borrow</div>
              <div className="text-white font-mono">{parseFloat(accountData.availableBorrowsETH).toFixed(4)} ETH</div>
            </div>
            <div>
              <div className="text-[#8ca1cc] text-sm">Health Factor</div>
              <div className={`font-mono ${parseFloat(accountData.healthFactor) > 1.5 ? 'text-green-400' : 'text-red-400'}`}>
                {parseFloat(accountData.healthFactor).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Supply Interface */}
      <div className="mb-6 bg-[#1a1f3a] rounded-lg p-4 border border-[#4269aa]/50">
        <h3 className="text-lg font-semibold text-white mb-3">Supply Assets</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#8ca1cc] mb-2">Asset</label>
            <select 
              value={supplyAsset}
              onChange={(e) => setSupplyAsset(e.target.value)}
              className="w-full bg-[#0a0f2a] border border-[#4269aa]/50 rounded px-3 py-2 text-white"
            >
              <option value="SEI">SEI</option>
              <option value="USDC">USDC</option>
              <option value="USDT">USDT</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#8ca1cc] mb-2">Amount</label>
            <input
              type="number"
              placeholder="0.0"
              value={supplyAmount}
              onChange={(e) => setSupplyAmount(e.target.value)}
              className="w-full bg-[#0a0f2a] border border-[#4269aa]/50 rounded px-3 py-2 text-white"
            />
          </div>
          <div className="flex items-end">
            <Button
              variant="brand-primary"
              onClick={handleSupply}
              disabled={isSupplying || !supplyAmount}
              className="w-full hover:shadow-[0_0_25px_rgba(0,240,255,0.6)]"
              icon={<FeatherPlay />}
            >
              Supply
            </Button>
          </div>
        </div>
      </div>

      {/* Yield Opportunities */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Yield Opportunities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {opportunities.map((opp, index) => (
            <div key={index} className="bg-[#1a1f3a] rounded-lg p-4 border border-[#4269aa]/30 hover:border-[#00f0ff]/50 transition-all duration-300">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[#00f0ff] font-bold text-lg">{opp.asset}</span>
                <Badge variant={opp.risk === 'low' ? 'success' : opp.risk === 'medium' ? 'warning' : 'error'}>
                  {opp.risk.toUpperCase()}
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#8ca1cc]">Supply APY:</span>
                  <span className="text-green-400 font-medium">{(opp.supplyAPY || 0).toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8ca1cc]">Borrow APY:</span>
                  <span className="text-red-400 font-medium">{(opp.borrowAPY || 0).toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8ca1cc]">Net Yield:</span>
                  <span className={`font-medium ${(opp.netYield || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {(opp.netYield || 0).toFixed(2)}%
                  </span>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-[#4269aa]/30">
                <div className="text-xs text-[#8ca1cc]">Protocol: {opp.protocol}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Yield Optimization */}
      <div className="bg-[#1a1f3a] rounded-lg p-4 border border-[#c82fff]/50">
        <h3 className="text-lg font-semibold text-white mb-3">Yield Optimization</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#8ca1cc] mb-2">Amount to Optimize</label>
            <input
              type="number"
              placeholder="100.0"
              value={optimizeAmount}
              onChange={(e) => setOptimizeAmount(e.target.value)}
              className="w-full bg-[#0a0f2a] border border-[#4269aa]/50 rounded px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#8ca1cc] mb-2">Risk Tolerance</label>
            <select
              value={riskTolerance}
              onChange={(e) => setRiskTolerance(e.target.value)}
              className="w-full bg-[#0a0f2a] border border-[#4269aa]/50 rounded px-3 py-2 text-white"
            >
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button
              variant="brand-secondary"
              onClick={handleOptimizeYield}
              disabled={isOptimizing || !optimizeAmount}
              className="w-full hover:shadow-[0_0_20px_rgba(200,47,255,0.4)]"
              icon={<FeatherZap />}
            >
              {isOptimizing ? 'Optimizing...' : 'Optimize Yield'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default YeiFinancePanel;
