const { ethers } = require('ethers');
const SeiAnalyticsService = require('./seiAnalytics');
const crossmintService = require('./crossmint');

class AgentEngine {
  constructor() {
    this.provider = new ethers.JsonRpcProvider('https://evm-rpc-testnet.sei-apis.com');
    this.contractAddress = '0x7fc58f2d50790f6cddb631b4757f54b893692dde';
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

  async configureAgent(agentConfig) {
    const { walletAddress, privateKey, volatilityThreshold, targetTokens, recipient } = agentConfig;
    
    try {
      // Validate configuration
      if (!walletAddress || !privateKey || !volatilityThreshold || !targetTokens || !recipient) {
        throw new Error('Missing required agent configuration parameters');
      }

      // Create signer for this agent
      const signer = new ethers.Wallet(privateKey, this.provider);
      const contract = new ethers.Contract(this.contractAddress, this.contractABI, signer);

      // Configure agent on-chain
      const tx = await contract.configureAgent(
        Math.floor(volatilityThreshold * 100), // Convert to basis points
        targetTokens
      );
      await tx.wait();

      // Store agent configuration
      this.activeAgents.set(walletAddress, {
        ...agentConfig,
        signer,
        contract,
        lastTradeTime: 0,
        totalTrades: 0,
        successfulTrades: 0,
        totalVolume: 0,
        isActive: true
      });

      this.log(`Agent configured: ${walletAddress} | Threshold: ${volatilityThreshold * 100}%`);
      
      return {
        success: true,
        transactionHash: tx.hash,
        message: 'Agent configured successfully'
      };
    } catch (error) {
      console.error('Error configuring agent:', error);
      throw error;
    }
  }

  async startMonitoring() {
    if (this.isRunning) {
      return { success: false, message: 'Monitoring already running' };
    }

    this.isRunning = true;
    this.log('Starting automated trading engine...');

    // Start real-time monitoring with Sei analytics
    if (this.io) {
      this.seiAnalytics.startRealTimeMonitoring(this.io);
    }

    // Monitor volatility and execute trades
    this.monitoringInterval = setInterval(async () => {
      await this.monitorAndTrade();
    }, 15000); // Check every 15 seconds

    return { success: true, message: 'Automated trading engine started' };
  }

  async stopMonitoring() {
    if (!this.isRunning) {
      return { success: false, message: 'Monitoring not running' };
    }

    this.isRunning = false;
    
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }

    this.seiAnalytics.stopRealTimeMonitoring();
    this.log('Automated trading engine stopped');

    return { success: true, message: 'Automated trading engine stopped' };
  }

  async monitorAndTrade() {
    if (!this.isRunning || this.activeAgents.size === 0) {
      return;
    }

    try {
      for (const [agentAddress, agentConfig] of this.activeAgents) {
        if (!agentConfig.isActive) continue;

        // Check each target token for volatility
        for (const token of agentConfig.targetTokens) {
          await this.checkTokenAndTrade(agentAddress, agentConfig, token);
        }
      }
    } catch (error) {
      console.error('Error in monitoring cycle:', error);
      this.log(`Monitoring error: ${error.message}`);
    }
  }

  async checkTokenAndTrade(agentAddress, agentConfig, tokenAddress) {
    try {
      // Get current volatility
      const volatilityData = await this.seiAnalytics.calculateVolatility(tokenAddress);
      const currentVolatility = parseFloat(volatilityData.volatility) / 100;

      // Check if volatility exceeds threshold
      if (currentVolatility > agentConfig.volatilityThreshold) {
        // Implement cooldown to prevent too frequent trades
        const now = Date.now();
        const cooldownPeriod = 60000; // 1 minute cooldown
        
        if (now - agentConfig.lastTradeTime < cooldownPeriod) {
          return;
        }

        // Execute trade
        await this.executeTrade(agentAddress, agentConfig, tokenAddress, currentVolatility);
      }
    } catch (error) {
      console.error(`Error checking token ${tokenAddress} for agent ${agentAddress}:`, error);
    }
  }

  async executeTrade(agentAddress, agentConfig, tokenAddress, volatility) {
    try {
      const tradeAmount = ethers.parseEther("0.1"); // Trade 0.1 SEI equivalent
      const recipient = agentConfig.recipient;

      this.log(`Executing trade for ${agentAddress} | Token: ${tokenAddress} | Volatility: ${(volatility * 100).toFixed(2)}%`);

      // Try to process payment via Crossmint first
      let paymentId = '';
      try {
        const payment = await crossmintService.processPayment({
          recipient,
          amount: '0.1',
          currency: 'ETH',
          description: `NeonTradeBot automated trade: ${tokenAddress}`
        });
        paymentId = payment.id;
      } catch (crossmintError) {
        console.log('Crossmint payment failed, proceeding with regular trade:', crossmintError.message);
      }

      // Execute trade on blockchain
      let tx;
      if (paymentId) {
        tx = await agentConfig.contract.executeTradeWithPayment(
          tokenAddress,
          tradeAmount,
          recipient,
          paymentId
        );
      } else {
        tx = await agentConfig.contract.executeTrade(
          tokenAddress,
          tradeAmount,
          recipient
        );
      }

      await tx.wait();

      // Update agent statistics
      agentConfig.lastTradeTime = Date.now();
      agentConfig.totalTrades++;
      agentConfig.successfulTrades++;
      agentConfig.totalVolume += 0.1;

      const tradeData = {
        agent: agentAddress,
        token: tokenAddress,
        amount: '0.1',
        volatility: (volatility * 100).toFixed(2) + '%',
        txHash: tx.hash,
        paymentId,
        timestamp: new Date().toISOString()
      };

      this.log(`Trade executed successfully: ${JSON.stringify(tradeData)}`);

      // Emit real-time update
      if (this.io) {
        this.io.emit('tradeExecuted', tradeData);
        this.io.emit('agentStats', {
          agent: agentAddress,
          totalTrades: agentConfig.totalTrades,
          successfulTrades: agentConfig.successfulTrades,
          totalVolume: agentConfig.totalVolume.toFixed(4),
          successRate: ((agentConfig.successfulTrades / agentConfig.totalTrades) * 100).toFixed(1)
        });
      }

      return tradeData;
    } catch (error) {
      console.error('Error executing trade:', error);
      agentConfig.totalTrades++;
      
      this.log(`Trade failed for ${agentAddress}: ${error.message}`);
      
      if (this.io) {
        this.io.emit('tradeFailed', {
          agent: agentAddress,
          token: tokenAddress,
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
      
      throw error;
    }
  }

  async getAgentStats(agentAddress) {
    const agentConfig = this.activeAgents.get(agentAddress);
    if (!agentConfig) {
      throw new Error('Agent not found');
    }

    const successRate = agentConfig.totalTrades > 0 
      ? ((agentConfig.successfulTrades / agentConfig.totalTrades) * 100).toFixed(1)
      : '0.0';

    return {
      address: agentAddress,
      isActive: agentConfig.isActive,
      volatilityThreshold: (agentConfig.volatilityThreshold * 100).toFixed(1) + '%',
      targetTokens: agentConfig.targetTokens,
      totalTrades: agentConfig.totalTrades,
      successfulTrades: agentConfig.successfulTrades,
      successRate: parseFloat(successRate),
      totalVolume: agentConfig.totalVolume.toFixed(4),
      lastTradeTime: agentConfig.lastTradeTime,
      recipient: agentConfig.recipient
    };
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

  async deactivateAgent(agentAddress) {
    const agentConfig = this.activeAgents.get(agentAddress);
    if (!agentConfig) {
      throw new Error('Agent not found');
    }

    agentConfig.isActive = false;
    this.log(`Agent deactivated: ${agentAddress}`);

    return { success: true, message: 'Agent deactivated' };
  }

  async reactivateAgent(agentAddress) {
    const agentConfig = this.activeAgents.get(agentAddress);
    if (!agentConfig) {
      throw new Error('Agent not found');
    }

    agentConfig.isActive = true;
    this.log(`Agent reactivated: ${agentAddress}`);

    return { success: true, message: 'Agent reactivated' };
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

  log(message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] AgentEngine: ${message}`);
    
    if (this.io) {
      this.io.emit('log', message);
    }
  }
}

module.exports = AgentEngine;
