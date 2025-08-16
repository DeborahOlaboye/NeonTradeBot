import { useState } from 'react';
import axios from 'axios';

interface AgentFormProps {
  setLogs: (log: string) => void;
}

export default function AgentForm({ setLogs }: AgentFormProps) {
  const [walletAddress, setWalletAddress] = useState('');
  const [volatilityThreshold, setVolatilityThreshold] = useState('10');
  const [token, setToken] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDeploying(true);
    
    try {
      setLogs(`INITIALIZING AGENT DEPLOYMENT...`);
      setLogs(`WALLET TARGET: ${walletAddress}`);
      setLogs(`VOLATILITY THRESHOLD: ${volatilityThreshold}%`);
      setLogs(`TOKEN: ${token}`);
      
      // Simulate deployment process
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLogs(`CONNECTING TO SEI NETWORK...`);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      setLogs(`AGENT DEPLOYED SUCCESSFULLY`);
      setLogs(`STATUS: MONITORING ACTIVE`);
      
    } catch (error) {
      setLogs(`ERROR: DEPLOYMENT FAILED - ${error}`);
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-cyber font-bold mb-4 neon-text">
          AGENT CONFIGURATION
        </h2>
        <p className="font-mono text-neon-blue text-sm">
          CONFIGURE YOUR AI TRADING AGENT PARAMETERS
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-neon-purple to-neon-blue mx-auto mt-2"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Wallet Address */}
          <div className="space-y-2">
            <label className="block text-sm font-cyber font-bold text-neon-blue uppercase tracking-wider">
              TARGET WALLET
            </label>
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="cyber-input w-full"
              placeholder="0x1234...abcd"
              required
            />
            <p className="text-xs font-mono text-cyber-white/60">
              Wallet address to monitor for activity
            </p>
          </div>

          {/* Volatility Threshold */}
          <div className="space-y-2">
            <label className="block text-sm font-cyber font-bold text-neon-blue uppercase tracking-wider">
              VOLATILITY TRIGGER
            </label>
            <div className="relative">
              <input
                type="number"
                value={volatilityThreshold}
                onChange={(e) => setVolatilityThreshold(e.target.value)}
                className="cyber-input w-full pr-8"
                placeholder="10"
                min="1"
                max="100"
                required
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neon-purple font-mono">
                %
              </span>
            </div>
            <p className="text-xs font-mono text-cyber-white/60">
              Execute trades when volatility exceeds this threshold
            </p>
          </div>
        </div>

        {/* Token Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-cyber font-bold text-neon-blue uppercase tracking-wider">
            TARGET TOKEN
          </label>
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="cyber-input w-full"
            placeholder="SEI, USDC, or token contract address"
            required
          />
          <p className="text-xs font-mono text-cyber-white/60">
            Token symbol or contract address for trading
          </p>
        </div>

        {/* Advanced Settings */}
        <div className="cyber-card bg-cyber-dark/50">
          <h3 className="text-lg font-cyber font-bold text-neon-purple mb-4">
            ADVANCED PARAMETERS
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm font-mono">
            <div className="flex justify-between">
              <span className="text-cyber-white/80">Network:</span>
              <span className="text-neon-blue">SEI TESTNET</span>
            </div>
            <div className="flex justify-between">
              <span className="text-cyber-white/80">Finality:</span>
              <span className="text-neon-blue">&lt;400MS</span>
            </div>
            <div className="flex justify-between">
              <span className="text-cyber-white/80">Status:</span>
              <span className="text-green-400">READY</span>
            </div>
          </div>
        </div>

        {/* Deploy Button */}
        <div className="text-center pt-4">
          <button 
            type="submit" 
            disabled={isDeploying}
            className={`
              cyber-button text-lg px-12 py-4 relative overflow-hidden
              ${isDeploying ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {isDeploying ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-neon-purple border-t-transparent rounded-full animate-spin"></div>
                <span>DEPLOYING...</span>
              </div>
            ) : (
              <span className="flex items-center justify-center space-x-2">
                <span>DEPLOY AGENT</span>
                <span className="text-neon-blue">▶</span>
              </span>
            )}
          </button>
        </div>
      </form>

      {/* Contract Info */}
      <div className="cyber-card bg-cyber-dark/30 border-neon-blue/50">
        <h3 className="text-sm font-cyber font-bold text-neon-blue mb-3 uppercase tracking-wider">
          DEPLOYED CONTRACT
        </h3>
        <div className="font-mono text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-cyber-white/60">Address:</span>
            <span className="text-neon-purple">0x7fc58f2d50790f6cddb631b4757f54b893692dde</span>
          </div>
          <div className="flex justify-between">
            <span className="text-cyber-white/60">Network:</span>
            <span className="text-neon-blue">Sei Testnet (1328)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-cyber-white/60">Status:</span>
            <span className="text-green-400 animate-pulse">ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
}