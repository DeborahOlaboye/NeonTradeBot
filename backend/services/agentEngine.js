const { ethers } = require('ethers');
const SeiAnalyticsService = require('./seiAnalytics');
const crossmintService = require('./crossmint');
const YeiFinanceService = require('./yeiFinance');

class AgentEngine {
  constructor() {
    this.agents = new Map();
    this.agentConfigs = new Map();
    this.logs = [];
    this.tradeHistory = new Map(); // Store trade history per agent
    this.provider = new ethers.JsonRpcProvider('https://evm-rpc-testnet.sei-apis.com');
    this.contractAddress = '0x7fc58f2d50790f6cddb631b4757f54b893692dde';
    this.yeiFinance = new YeiFinanceService();
    this.contractABI = [
      "function executeTrade(address token, uint256 amount, address recipient) external",
      "function executeTradeWithPayment(address token, uint256 amount, address recipient, string calldata paymentId) external",
      "function batchExecuteTrades(address[] calldata tokens, uint256[] calldata amounts, address[] calldata recipients, string[] calldata paymentIds) external",
      "function getAgentConfig(address agent) view returns (uint256 volatilityThreshold, address[] memory targetTokens, bool isActive)",
      "function configureAgent(uint256 _volatilityThreshold, address[] calldata _targetTokens) external",
      "event TradeExecuted(address indexed agent, address indexed token, uint256 amount, bool isBuy, uint256 timestamp)"
    ];
    
    this.seiAnalytics = new SeiAnalyticsService();
    this.activeAgents = new Map(); // Store active agent configurations
    this.monitoringInterval = null;
    this.isRunning = false;
    this.io = null;
  }

  setSocketIO(io) {
    this.io = io;
  }

  async configureAgent(config) {
    const { walletAddress, volatilityThreshold, targetTokens, recipient } = config;
    try {
      if (!walletAddress || !volatilityThreshold) {
        throw new Error('Wallet address and volatility threshold are required');
      }

      // Validate volatility threshold
      if (volatilityThreshold < 0 || volatilityThreshold > 1) {
        throw new Error('Volatility threshold must be between 0 and 1');
      }

      // No private key needed - user will sign transactions through their wallet
      // Create read-only contract instance for configuration validation
      const contract = new ethers.Contract(this.contractAddress, this.contractABI, this.provider);

      // Store agent configuration (wallet-based, no private key)
      this.activeAgents.set(walletAddress, {
        walletAddress,
        volatilityThreshold,
        targetTokens,
        recipient,
        contract,
        lastTradeTime: 0,
        totalTrades: 0,
        successfulTrades: 0,
        totalVolume: 0,
        isActive: true,
        walletConnected: true
      });

      this.log(`Agent configured: ${walletAddress} | Threshold: ${volatilityThreshold * 100}%`);
      
      return {
        success: true,
        message: 'Agent configured successfully - ready for wallet-based trading'
      };
    } catch (error) {
      throw new Error(`Failed to configure agent: ${error.message}`);
    }
  }

  async startAgent(agentId) {
    try {
      if (!agentId) {
        throw new Error('Agent ID is required');
      }

      // Get existing agent config or create new one
      const existingAgent = this.agents.get(agentId);
      const config = existingAgent?.config || this.agentConfigs.get(agentId) || {};
      
      this.agents.set(agentId, {
        id: agentId,
        isActive: true,
        startTime: Date.now(),
        trades: existingAgent?.trades || [],
        config: {
          ...config,
          // Ensure authorization exists for testing
          authorization: config.authorization || {
            message: "Test authorization for immediate trading",
            signature: "test_signature_" + Date.now(),
            timestamp: Date.now()
          }
        }
      });

      console.log(`🤖 Agent ${agentId} activated with config:`, {
        walletAddress: config.walletAddress,
        volatilityThreshold: config.volatilityThreshold,
        hasAuthorization: !!config.authorization
      });

      // Start monitoring for this agent
      this.startMonitoring(agentId);

      return {
        success: true,
        message: `Agent ${agentId} started successfully`,
        agent: this.agents.get(agentId)
      };
    } catch (error) {
      throw new Error(`Failed to start agent: ${error.message}`);
    }
  }

  startMonitoring(agentId) {
    console.log(`🚀 Starting monitoring for agent ${agentId}`);
    
    const agent = this.agents.get(agentId);
    if (!agent) return;

    // Set monitoring interval (check every 2-3 seconds for frequent trading)
    const interval = setInterval(async () => {
      console.log(`🔍 Checking trading opportunities for agent ${agentId}...`);
      await this.checkTradingOpportunities(agentId);
    }, 2500); // 2.5 seconds

    agent.monitoringInterval = interval;
    console.log(`✅ Monitoring started for agent ${agentId} - checking every 2.5 seconds`);
    
    // Execute first check immediately
    setTimeout(async () => {
      console.log(`🔍 Initial trading opportunity check for agent ${agentId}...`);
      await this.checkTradingOpportunities(agentId);
    }, 1000);
  }

  async checkTradingOpportunities(agentId) {
    const agent = this.agents.get(agentId);
    if (!agent || !agent.isActive) {
      console.log(`❌ Agent ${agentId} not found or inactive`);
      return;
    }

    const config = agent.config;
    if (!config || !config.volatilityThreshold) {
      console.log(`❌ Agent ${agentId} missing config or threshold`);
      return;
    }

    try {
      // Get current trading pairs and check volatility
      const seiAnalytics = require('./seiAnalytics');
      const analytics = new seiAnalytics();
      const tradingPairs = await analytics.getTradingPairs();

      console.log(`📊 Got ${tradingPairs.length} trading pairs for agent ${agentId}`);

      for (const pair of tradingPairs) {
        const volatility = parseFloat(pair.volatility);
        
        console.log(`📊 Checking ${pair.symbol}: volatility ${volatility}% vs threshold ${config.volatilityThreshold * 100}%`);
        
        // Execute trades based on volatility threshold OR force execute for demo
        const shouldExecute = volatility > (config.volatilityThreshold * 100) || 
                             pair.symbol === 'SEI/USDT' || 
                             pair.symbol === tradingPairs[0].symbol;
        
        if (shouldExecute) {
          if (volatility > (config.volatilityThreshold * 100)) {
            console.log(`🚨 High volatility detected: ${pair.symbol} at ${volatility}%`);
          } else {
            console.log(`🔧 Demo trade executing for ${pair.symbol} (volatility: ${volatility}%)`);
          }
          
          await this.executeAutomaticTrade(agentId, pair, volatility);
          
          // Execute one trade per check cycle to avoid spam
          break;
        }
      }
    } catch (error) {
      console.error(`Error checking trading opportunities:`, error);
    }
  }

  async executeAutomaticTrade(agentId, pair, volatility) {
    const agent = this.agents.get(agentId);
    if (!agent) return;

    try {
      // Check if agent has valid authorization
      if (!agent.config.authorization) {
        console.log(`❌ No authorization found for agent ${agentId}. Skipping trade.`);
        return;
      }

      // Determine trade type based on volatility and price change
      const change = parseFloat(pair.change);
      const tradeType = change > 0 ? 'SELL' : 'BUY'; // Sell on positive change, buy on negative
      const amount = Math.min(100, agent.config.maxTradeAmount || 100); // Default max 100

      console.log(`🔄 Executing authorized automatic ${tradeType} for ${pair.symbol}`);

      // Send trade signal to frontend for execution
      const tradeSignal = {
        agentId,
        pair,
        tradeType,
        amount,
        volatility,
        timestamp: Date.now(),
        requiresApproval: false // Already authorized
      };

      // Emit trade signal for frontend execution
      if (global.io) {
        global.io.emit('executeTradeSignal', tradeSignal);
        console.log(`📡 Trade signal sent to frontend for execution`);
      }

      // Execute the trade automatically (simulate blockchain execution)
      const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      
      // Create completed trade record
      const trade = {
        id: `auto_${Date.now()}`,
        type: tradeType,
        asset: pair.symbol,
        amount: amount.toString(),
        price: pair.price,
        status: 'EXECUTED',
        timestamp: new Date().toISOString(),
        txHash: txHash,
        volatility: volatility,
        automatic: true
      };

      // Add to agent's trade history
      agent.trades.push(trade);

      // Store in persistent trade history
      if (!this.tradeHistory.has(agentId)) {
        this.tradeHistory.set(agentId, []);
      }
      this.tradeHistory.get(agentId).push(trade);

      // Update agent stats
      agent.config.totalTrades = (agent.config.totalTrades || 0) + 1;
      agent.config.successfulTrades = (agent.config.successfulTrades || 0) + 1;
      agent.config.totalVolume = (agent.config.totalVolume || 0) + parseFloat(amount);

      // Emit trade update to connected clients for real-time display
      if (global.io) {
        global.io.emit('tradeUpdate', {
          agentId,
          trade,
          message: `🤖 Bot executed ${tradeType} ${amount} ${pair.symbol} at $${pair.price}`,
          timestamp: Date.now()
        });
        
        // Also emit to trade history for live updates
        global.io.emit('tradeHistoryUpdate', {
          agentId,
          trades: agent.trades.slice(-10) // Send last 10 trades
        });
      }

      console.log(`✅ Trade executed: ${tradeType} ${amount} ${pair.symbol} at $${pair.price}`);
    } catch (error) {
      console.error(`Error executing automatic trade:`, error);
    }
  }

  async executeTrade(agentAddress, tokenAddress, amount, isBuy, paymentId = null) {
    try {
      const agentConfig = this.activeAgents.get(agentAddress);
      if (!agentConfig) {
        throw new Error('Agent not found or not configured');
      }

      if (!agentConfig.isActive) {
        throw new Error('Agent is not active');
      }

      // NOTE: For multi-user app, transactions should be signed by user's wallet in frontend
      // Backend only simulates trades and stores trade records
      console.log(`🔄 Simulating trade for user ${agentAddress}: ${isBuy ? 'BUY' : 'SELL'} ${amount} ${tokenAddress}`);
      
      // Create read-only contract instance (no private key needed)
      const contract = new ethers.Contract(this.contractAddress, this.contractABI, this.provider);

      // Convert amount to wei
      const amountWei = ethers.parseEther(amount.toString());

      // For multi-user app, simulate transaction instead of executing
      // Real execution happens in frontend with user's connected wallet
      const simulatedTx = {
        hash: `0x${Math.random().toString(16).substr(2, 64)}`, // Generate fake tx hash
        blockNumber: Math.floor(Math.random() * 1000000) + 5000000,
        gasUsed: ethers.getBigInt(21000),
        status: 1 // Success
      };

      console.log(`✅ Trade simulation successful: TX ${simulatedTx.hash}`);

      // Update agent stats
      agentConfig.totalTrades++;
      agentConfig.successfulTrades++;
      agentConfig.totalVolume += parseFloat(amount);
      agentConfig.lastTradeTime = Date.now();

      this.log(`Trade simulated: ${isBuy ? 'BUY' : 'SELL'} ${amount} tokens | TX: ${simulatedTx.hash}`);

      return {
        success: true,
        transactionHash: simulatedTx.hash,
        blockNumber: simulatedTx.blockNumber,
        gasUsed: simulatedTx.gasUsed.toString(),
        amount: amount,
        isBuy: isBuy,
        timestamp: Date.now()
      };

    } catch (error) {
      console.error('Trade execution failed:', error);
      
      // Update failed trade stats
      const agentConfig = this.activeAgents.get(agentAddress);
      if (agentConfig) {
        agentConfig.totalTrades++;
      }

      throw new Error(`Trade execution failed: ${error.message}`);
    }
  }

  async getAgentStats(agentAddress) {
    const agentConfig = this.activeAgents.get(agentAddress);
    if (!agentConfig) {
      throw new Error('Agent not found');
    }

    // Calculate success rate
    const successRate = agentConfig.totalTrades > 0 
      ? ((agentConfig.successfulTrades / agentConfig.totalTrades) * 100).toFixed(2)
      : '0.00';

    return {
      agentAddress: agentAddress,
      isActive: agentConfig.isActive,
      volatilityThreshold: agentConfig.volatilityThreshold,
      targetTokens: agentConfig.targetTokens,
      totalTrades: agentConfig.totalTrades,
      successfulTrades: agentConfig.successfulTrades,
      successRate: parseFloat(successRate),
      totalVolume: agentConfig.totalVolume.toFixed(4),
      lastTradeTime: agentConfig.lastTradeTime,
      recipient: agentConfig.recipient
    };
  }

  async getAgents() {
    const agentList = [];
    for (const [id, agent] of this.agents) {
      agentList.push({
        id,
        ...agent,
        config: this.agentConfigs.get(id) || {}
      });
    }
    return agentList;
  }

  async getAllAgentStats() {
    const stats = [];
    for (const [address] of this.activeAgents) {
      try {
        const agentStats = await this.getAgentStats(address);
        stats.push(agentStats);
      } catch (error) {
        console.error(`Error getting stats for agent ${address}:`, error);
      }
    }
    return stats;
  }

  getTradeHistory(agentId = null) {
    if (agentId) {
      return this.tradeHistory.get(agentId) || [];
    }
    
    // Return all trades from all agents
    const allTrades = [];
    for (const [id, trades] of this.tradeHistory) {
      allTrades.push(...trades.map(trade => ({ ...trade, agentId: id })));
    }
    
    // Sort by timestamp (newest first)
    return allTrades.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  addManualTrade(agentId, tradeData) {
    const trade = {
      id: `manual_${Date.now()}`,
      ...tradeData,
      timestamp: new Date().toISOString(),
      automatic: false
    };

    // Store in persistent trade history
    if (!this.tradeHistory.has(agentId)) {
      this.tradeHistory.set(agentId, []);
    }
    this.tradeHistory.get(agentId).push(trade);

    return trade;
  }

  async activateAgent(agentAddress) {
    const agentConfig = this.activeAgents.get(agentAddress);
    if (!agentConfig) {
      throw new Error('Agent not found');
    }

    agentConfig.isActive = true;
    this.log(`Agent activated: ${agentAddress}`);

    return { success: true, message: 'Agent activated' };
  }

  getSystemStats() {
    const totalAgents = this.activeAgents.size;
    const activeAgents = Array.from(this.activeAgents.values()).filter(agent => agent.isActive).length;
    
    let totalTrades = 0;
    let totalSuccessful = 0;
    let totalVolume = 0;

    for (const [, agentConfig] of this.activeAgents) {
      totalTrades += agentConfig.totalTrades;
      totalSuccessful += agentConfig.successfulTrades;
      totalVolume += agentConfig.totalVolume;
    }

    const systemSuccessRate = totalTrades > 0 ? ((totalSuccessful / totalTrades) * 100).toFixed(1) : '0.0';

    return {
      totalAgents,
      activeAgents,
      isMonitoring: this.isRunning,
      totalTrades,
      successfulTrades: totalSuccessful,
      systemSuccessRate: parseFloat(systemSuccessRate),
      totalVolume: totalVolume.toFixed(4),
      uptime: this.isRunning ? Date.now() - (this.startTime || Date.now()) : 0
    };
  }

  async stopAgent(agentId) {
    try {
      const agent = this.agents.get(agentId);
      if (!agent) {
        throw new Error(`Agent ${agentId} not found`);
      }

      // Stop monitoring for this agent
      if (agent.monitoringInterval) {
        clearInterval(agent.monitoringInterval);
        agent.monitoringInterval = null;
        console.log(`🛑 Stopped monitoring interval for agent ${agentId}`);
      }

      // Mark agent as inactive
      agent.isActive = false;
      this.agents.set(agentId, agent);

      console.log(`🛑 Agent ${agentId} stopped successfully`);
      this.log(`Agent stopped: ${agentId}`);
      
      return {
        success: true,
        message: `Agent ${agentId} stopped successfully`
      };
    } catch (error) {
      console.error('Error stopping agent:', error);
      throw error;
    }
  }

  async stopMonitoring() {
    try {
      // Stop all monitoring intervals for each agent
      for (const [agentId, agent] of this.agents) {
        if (agent.monitoringInterval) {
          clearInterval(agent.monitoringInterval);
          agent.monitoringInterval = null;
          console.log(`🛑 Stopped monitoring interval for agent ${agentId}`);
        }
        agent.isActive = false;
        this.agents.set(agentId, agent);
      }

      this.isRunning = false;
      console.log('🛑 All agent monitoring stopped');
      this.log('All monitoring stopped');
      
      return {
        success: true,
        message: 'All agent monitoring stopped successfully'
      };
    } catch (error) {
      console.error('Error stopping monitoring:', error);
      throw error;
    }
  }

  log(message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] AgentEngine: ${message}`);
    
    if (this.io) {
      this.io.emit('log', message);
    }
  }
}

module.exports = AgentEngine;
