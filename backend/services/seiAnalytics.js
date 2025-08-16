const { ethers } = require('ethers');

class SeiAnalyticsService {
  constructor() {
    this.provider = new ethers.JsonRpcProvider('https://evm-rpc-testnet.sei-apis.com');
    this.contractAddress = '0x7fc58f2d50790f6cddb631b4757f54b893692dde';
    this.contractABI = [
      "function getAgentConfig(address agent) view returns (uint256 volatilityThreshold, address[] memory targetTokens, bool isActive)",
      "function getTotalTrades() view returns (uint256)",
      "function getTradeHistory(address agent, uint256 limit) view returns (tuple(address token, uint256 amount, uint256 timestamp, bool isBuy)[])",
      "event TradeExecuted(address indexed agent, address indexed token, uint256 amount, bool isBuy, uint256 timestamp)",
      "event AgentConfigured(address indexed agent, uint256 volatilityThreshold, address[] targetTokens)"
    ];
    this.contract = new ethers.Contract(this.contractAddress, this.contractABI, this.provider);
    this.isMonitoring = false;
    this.eventListeners = [];
  }

  async getNetworkStats() {
    try {
      const [blockNumber, gasPrice, balance] = await Promise.all([
        this.provider.getBlockNumber(),
        this.provider.getFeeData(),
        this.provider.getBalance(this.contractAddress)
      ]);

      return {
        blockNumber,
        gasPrice: gasPrice.gasPrice ? ethers.formatUnits(gasPrice.gasPrice, 'gwei') : '0',
        contractBalance: ethers.formatEther(balance),
        networkStatus: 'CONNECTED',
        chainId: 1328,
        finality: '<400ms'
      };
    } catch (error) {
      console.error('Error fetching network stats:', error);
      return {
        blockNumber: 0,
        gasPrice: '0',
        contractBalance: '0',
        networkStatus: 'DISCONNECTED',
        chainId: 1328,
        finality: 'N/A'
      };
    }
  }

  async getAgentStats(agentAddress) {
    try {
      const [config, totalTrades] = await Promise.all([
        this.contract.getAgentConfig(agentAddress),
        this.contract.getTotalTrades()
      ]);

      return {
        isActive: config.isActive,
        volatilityThreshold: config.volatilityThreshold.toString(),
        targetTokens: config.targetTokens,
        totalTrades: totalTrades.toString()
      };
    } catch (error) {
      console.error('Error fetching agent stats:', error);
      return {
        isActive: false,
        volatilityThreshold: '0',
        targetTokens: [],
        totalTrades: '0'
      };
    }
  }

  async getTradeHistory(agentAddress, limit = 10) {
    try {
      const trades = await this.contract.getTradeHistory(agentAddress, limit);
      return trades.map(trade => ({
        token: trade.token,
        amount: ethers.formatEther(trade.amount),
        timestamp: new Date(Number(trade.timestamp) * 1000).toISOString(),
        isBuy: trade.isBuy,
        type: trade.isBuy ? 'BUY' : 'SELL'
      }));
    } catch (error) {
      console.error('Error fetching trade history:', error);
      return [];
    }
  }

  async getTokenPrice(tokenAddress) {
    try {
      // Simulate token price fetching - in production, integrate with DEX APIs
      const mockPrices = {
        '0x0000000000000000000000000000000000000000': 0.12, // SEI
        '0x1111111111111111111111111111111111111111': 1.00, // USDC
        '0x2222222222222222222222222222222222222222': 2500.00 // ETH
      };
      
      return mockPrices[tokenAddress] || Math.random() * 100;
    } catch (error) {
      console.error('Error fetching token price:', error);
      return 0;
    }
  }

  async calculateVolatility(tokenAddress, timeframe = '1h') {
    try {
      // Simulate volatility calculation - in production, use historical price data
      const baseVolatility = Math.random() * 20; // 0-20%
      return {
        volatility: baseVolatility.toFixed(2),
        timeframe,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error calculating volatility:', error);
      return { volatility: '0.00', timeframe, timestamp: new Date().toISOString() };
    }
  }

  startRealTimeMonitoring(io) {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    console.log('Starting Sei MCP real-time monitoring...');

    // Listen for trade events
    const tradeFilter = this.contract.filters.TradeExecuted();
    this.contract.on(tradeFilter, (agent, token, amount, isBuy, timestamp, event) => {
      const tradeData = {
        agent,
        token,
        amount: ethers.formatEther(amount),
        isBuy,
        timestamp: new Date(Number(timestamp) * 1000).toISOString(),
        txHash: event.transactionHash,
        blockNumber: event.blockNumber
      };
      
      io.emit('tradeExecuted', tradeData);
      console.log('Trade executed:', tradeData);
    });

    // Listen for agent configuration events
    const configFilter = this.contract.filters.AgentConfigured();
    this.contract.on(configFilter, (agent, volatilityThreshold, targetTokens, event) => {
      const configData = {
        agent,
        volatilityThreshold: volatilityThreshold.toString(),
        targetTokens,
        txHash: event.transactionHash,
        blockNumber: event.blockNumber
      };
      
      io.emit('agentConfigured', configData);
      console.log('Agent configured:', configData);
    });

    // Periodic stats updates
    const statsInterval = setInterval(async () => {
      try {
        const networkStats = await this.getNetworkStats();
        io.emit('networkStats', networkStats);
      } catch (error) {
        console.error('Error in stats update:', error);
      }
    }, 10000); // Every 10 seconds

    // Periodic volatility updates
    const volatilityInterval = setInterval(async () => {
      try {
        const tokens = [
          '0x0000000000000000000000000000000000000000',
          '0x1111111111111111111111111111111111111111',
          '0x2222222222222222222222222222222222222222'
        ];
        
        for (const token of tokens) {
          const [price, volatility] = await Promise.all([
            this.getTokenPrice(token),
            this.calculateVolatility(token)
          ]);
          
          io.emit('tokenUpdate', { token, price, volatility });
        }
      } catch (error) {
        console.error('Error in volatility update:', error);
      }
    }, 30000); // Every 30 seconds

    // Store intervals for cleanup
    this.eventListeners.push(statsInterval, volatilityInterval);
  }

  stopRealTimeMonitoring() {
    if (!this.isMonitoring) return;
    
    this.isMonitoring = false;
    console.log('Stopping Sei MCP real-time monitoring...');
    
    // Remove all event listeners
    this.contract.removeAllListeners();
    
    // Clear intervals
    this.eventListeners.forEach(interval => clearInterval(interval));
    this.eventListeners = [];
  }

  async getComprehensiveStats(agentAddress) {
    try {
      const [networkStats, agentStats, tradeHistory] = await Promise.all([
        this.getNetworkStats(),
        this.getAgentStats(agentAddress),
        this.getTradeHistory(agentAddress, 5)
      ]);

      // Calculate success rate from trade history
      const successfulTrades = tradeHistory.filter(trade => trade.amount > 0).length;
      const successRate = tradeHistory.length > 0 ? 
        ((successfulTrades / tradeHistory.length) * 100).toFixed(1) : '0.0';

      // Calculate total volume
      const totalVolume = tradeHistory.reduce((sum, trade) => 
        sum + parseFloat(trade.amount), 0
      ).toFixed(2);

      return {
        network: networkStats,
        agent: {
          ...agentStats,
          successRate: parseFloat(successRate),
          totalVolume: parseFloat(totalVolume),
          recentTrades: tradeHistory.length
        },
        trades: tradeHistory,
        lastUpdate: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting comprehensive stats:', error);
      throw error;
    }
  }
}

module.exports = SeiAnalyticsService;
