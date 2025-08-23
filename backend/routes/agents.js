const express = require('express');
const router = express.Router();
const ethers = require('ethers');
const crossmintService = require('../services/crossmint');
const SeiAnalyticsService = require('../services/seiAnalytics');
const AgentEngine = require('../services/agentEngine');

const provider = new ethers.JsonRpcProvider('https://evm-rpc-testnet.sei-apis.com'); // Sei testnet RPC
const contractAddress = process.env.CONTRACT_ADDRESS || '0x7fc58f2d50790f6cddb631b4757f54b893692dde'; // Deployed contract address
const seiAnalytics = new SeiAnalyticsService();
const agentEngine = new AgentEngine();
const contractAbi = [ // ABI from Agent.sol compilation
  'function executeTrade(address token, uint256 amount, address recipient) external',
  'function executeTradeWithPayment(address token, uint256 amount, address recipient, string calldata paymentId) external',
  'function batchExecuteTrades(address[] calldata tokens, uint256[] calldata amounts, address[] calldata recipients, string[] calldata paymentIds) external',
  'function authorizeAgent(address agent) external',
  'function revokeAgent(address agent) external',
  'function authorizedAgents(address) external view returns (bool)',
  'function owner() external view returns (address)'
];

// Get comprehensive analytics dashboard data
router.get('/analytics/:agentAddress', async (req, res) => {
  try {
    const { agentAddress } = req.params;
    const stats = await seiAnalytics.getComprehensiveStats(agentAddress);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get network statistics
router.get('/network-stats', async (req, res) => {
  try {
    const stats = await seiAnalytics.getNetworkStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get transaction history for agents
router.get('/transaction-history', async (req, res) => {
  try {
    // Use the existing agentEngine instance that has the running agents
    const tradeHistory = agentEngine.getTradeHistory();
    console.log(`Fetching transaction history: ${tradeHistory.length} trades found`);
    res.json(tradeHistory);
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    res.status(500).json({ error: 'Failed to fetch transaction history' });
  }
});

// Execute trade via bot
router.post('/execute-trade', async (req, res) => {
  try {
    const { walletAddress, privateKey, tokenAddress, amount, tradeType, recipient } = req.body;
    
    if (!walletAddress || !privateKey || !tokenAddress || !amount) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Execute the trade via smart contract
    const provider = new ethers.JsonRpcProvider('https://evm-rpc-testnet.sei-apis.com');
    const wallet = new ethers.Wallet(privateKey, provider);
    const contractAddress = '0x7fc58f2d50790f6cddb631b4757f54b893692dde';
    const contractABI = [
      "function executeTrade(address token, uint256 amount, address recipient) external",
      "event TradeExecuted(address indexed agent, address indexed token, uint256 amount, bool isBuy, uint256 timestamp)"
    ];
    
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);
    const amountWei = ethers.parseEther(amount.toString());
    
    const tx = await contract.executeTrade(tokenAddress, amountWei, recipient || walletAddress);
    await tx.wait();

    // Store the trade in AgentEngine
    const agentEngine = require('../services/agentEngine');
    const engine = new agentEngine();
    const tradeData = {
      type: tradeType,
      asset: req.body.asset || 'Unknown',
      amount: amount.toString(),
      price: req.body.price || '0',
      status: 'EXECUTED',
      txHash: tx.hash
    };
    
    const tradeRecord = engine.addManualTrade(walletAddress, tradeData);

    res.json({
      success: true,
      txHash: tx.hash,
      message: `${tradeType} trade executed successfully`,
      trade: tradeRecord
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get agent list
router.get('/list', async (req, res) => {
  try {
    const agents = await agentEngine.getAllAgentStats();
    res.json({
      success: true,
      agents: agents || [],
      count: agents ? agents.length : 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get analytics data
router.get('/analytics', async (req, res) => {
  try {
    const stats = await seiAnalytics.getNetworkStats();
    const systemStats = agentEngine.getSystemStats();
    res.json({
      network: stats,
      system: systemStats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get token volatility data
router.get('/volatility/:tokenAddress', async (req, res) => {
  try {
    const { tokenAddress } = req.params;
    const { timeframe = '1h' } = req.query;
    const volatility = await seiAnalytics.calculateVolatility(tokenAddress, timeframe);
    res.json(volatility);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Configure and start automated agent
router.post('/configure', async (req, res) => {
  try {
    const { walletAddress, volatilityThreshold, tradingPairs, authorization, maxTradeAmount } = req.body;
    
    if (!walletAddress || !volatilityThreshold) {
      return res.status(400).json({ error: 'Missing required parameters: walletAddress and volatilityThreshold' });
    }

    const io = req.app.get('io');
    agentEngine.setSocketIO(io);

    const config = {
      walletAddress,
      volatilityThreshold: parseFloat(volatilityThreshold),
      maxTradeAmount: maxTradeAmount || 100,
      targetTokens: tradingPairs || ['SEI/USDT'],
      recipient: walletAddress,
      authorization: authorization || {
        message: "Test authorization for immediate trading",
        signature: "test_signature_" + Date.now(),
        timestamp: Date.now()
      }
    };

    const result = await agentEngine.configureAgent(config);

    // Store config for later use by start endpoint
    agentEngine.agentConfigs = agentEngine.agentConfigs || new Map();
    agentEngine.agentConfigs.set('default', config);

    console.log('🔧 Agent configured with:', {
      walletAddress: config.walletAddress,
      volatilityThreshold: config.volatilityThreshold,
      hasAuthorization: !!config.authorization
    });

    // Emit configuration update to frontend
    io.emit('agentConfigured', {
      walletAddress,
      volatilityThreshold,
      tradingPairs,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Agent configured successfully',
      config: {
        walletAddress,
        volatilityThreshold,
        tradingPairs,
        secureAuth: true
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start automated trading engine
router.post('/start-engine', async (req, res) => {
  try {
    const io = req.app.get('io');
    agentEngine.setSocketIO(io);
    
    const result = await agentEngine.startMonitoring();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start agent (alias for start-engine)
router.post('/start/:agentId', async (req, res) => {
  try {
    const { agentId } = req.params;
    const io = req.app.get('io');
    agentEngine.setSocketIO(io);
    
    const result = await agentEngine.startAgent(agentId || 'default');
    
    // Return only serializable data to avoid circular reference errors
    const safeResult = {
      success: result.success,
      message: result.message,
      agentId: agentId || 'default',
      timestamp: new Date().toISOString()
    };
    
    res.json(safeResult);
  } catch (error) {
    console.error('Error starting agent:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start agent without agentId parameter
router.post('/start', async (req, res) => {
  try {
    const { agentId } = req.body;
    const io = req.app.get('io');
    agentEngine.setSocketIO(io);
    
    const result = await agentEngine.startAgent(agentId || 'default');
    
    // Return only serializable data to avoid circular reference errors
    const safeResult = {
      success: result.success,
      message: result.message,
      agentId: agentId || 'default',
      timestamp: new Date().toISOString()
    };
    
    res.json(safeResult);
  } catch (error) {
    console.error('Error starting agent:', error);
    res.status(500).json({ error: error.message });
  }
});

// Stop automated trading engine
router.post('/stop-engine', async (req, res) => {
  try {
    const result = await agentEngine.stopMonitoring();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stop agent (alias for stop-engine)
router.post('/stop', async (req, res) => {
  try {
    const { agentId } = req.body;
    const result = await agentEngine.stopAgent(agentId || 'default');
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get trading pairs endpoint - direct from Sei MCP
router.get('/trading-pairs', async (req, res) => {
  try {
    console.log('🔍 Fetching trading pairs from Sei MCP...');
    const seiTradingPairs = await seiAnalytics.getTradingPairs();
    console.log('✅ Retrieved pairs:', seiTradingPairs.length);
    res.json(seiTradingPairs);
  } catch (error) {
    console.error('Error fetching trading pairs:', error);
    res.status(500).json({ error: 'Failed to fetch trading pairs' });
  }
});

// Crossmint Integration Endpoints
router.post('/crossmint/withdraw', async (req, res) => {
  try {
    const { walletAddress, amount } = req.body;
    
    // Simulate withdrawal process
    const withdrawal = {
      id: `withdraw_${Date.now()}`,
      walletAddress,
      amount,
      status: 'processing',
      timestamp: new Date().toISOString(),
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`
    };
    
    // Add to transaction history
    const transaction = {
      id: withdrawal.id,
      type: 'WITHDRAW',
      asset: 'SEI',
      amount: amount.replace(' SEI', ''),
      status: 'EXECUTED',
      timestamp: withdrawal.timestamp,
      txHash: withdrawal.txHash,
      automatic: false
    };
    
    agentEngine.addManualTrade('crossmint', transaction);
    
    // In production, this would call actual Crossmint withdrawal API
    setTimeout(() => {
      withdrawal.status = 'completed';
    }, 3000);
    
    res.json({
      success: true,
      message: 'Withdrawal initiated successfully',
      withdrawal
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/crossmint/mint-nft', async (req, res) => {
  try {
    const { walletAddress, metadata } = req.body;
    
    // Use Crossmint service to mint NFT
    const nftData = {
      recipient: walletAddress,
      metadata: metadata || {
        name: 'NeonTradeBot Agent NFT',
        description: 'AI Trading Agent NFT for Sei Network',
        image: 'https://neontradebot.com/agent-nft.png',
        attributes: [
          { trait_type: 'Agent Type', value: 'DeFi Trader' },
          { trait_type: 'Network', value: 'Sei' },
          { trait_type: 'Created', value: new Date().toISOString() }
        ]
      },
      collectionId: process.env.CROSSMINT_COLLECTION_ID || 'neontradebot-agents'
    };
    
    try {
      const result = await crossmintService.mintNFT(nftData);
      
      // Add to transaction history
      const transaction = {
        id: `nft_${Date.now()}`,
        type: 'MINT_NFT',
        asset: 'Agent NFT',
        amount: '1',
        status: 'EXECUTED',
        timestamp: new Date().toISOString(),
        txHash: result.txHash || `0x${Math.random().toString(16).substr(2, 64)}`,
        automatic: false
      };
      
      agentEngine.addManualTrade('crossmint', transaction);
      
      res.json({
        success: true,
        message: 'NFT minted successfully',
        nft: result
      });
    } catch (crossmintError) {
      // Fallback to simulation if Crossmint is not configured
      const simulatedNFT = {
        id: `nft_${Date.now()}`,
        tokenId: Math.floor(Math.random() * 10000),
        recipient: walletAddress,
        status: 'minted',
        txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        metadata: nftData.metadata
      };
      
      // Add to transaction history
      const transaction = {
        id: simulatedNFT.id,
        type: 'MINT_NFT',
        asset: 'Agent NFT',
        amount: '1',
        status: 'EXECUTED',
        timestamp: new Date().toISOString(),
        txHash: simulatedNFT.txHash,
        automatic: false
      };
      
      agentEngine.addManualTrade('crossmint', transaction);
      
      res.json({
        success: true,
        message: 'NFT minted successfully (simulated)',
        nft: simulatedNFT
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/crossmint/process-payment', async (req, res) => {
  try {
    const { walletAddress, amount, currency, description } = req.body;
    
    const paymentData = {
      recipient: walletAddress,
      amount: amount || '10.0',
      currency: currency || 'SEI',
      description: description || 'NeonTradeBot payment processing'
    };
    
    try {
      const result = await crossmintService.processPayment(paymentData);
      
      // Add to transaction history
      const transaction = {
        id: `payment_${Date.now()}`,
        type: 'PAYMENT',
        asset: paymentData.currency,
        amount: paymentData.amount,
        status: 'EXECUTED',
        timestamp: new Date().toISOString(),
        txHash: result.txHash || `0x${Math.random().toString(16).substr(2, 64)}`,
        automatic: false
      };
      
      agentEngine.addManualTrade('crossmint', transaction);
      
      res.json({
        success: true,
        message: 'Payment processed successfully',
        payment: result
      });
    } catch (crossmintError) {
      // Fallback to simulation if Crossmint is not configured
      const simulatedPayment = {
        id: `payment_${Date.now()}`,
        recipient: walletAddress,
        amount: paymentData.amount,
        currency: paymentData.currency,
        status: 'completed',
        txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        timestamp: new Date().toISOString()
      };
      
      // Add to transaction history
      const transaction = {
        id: simulatedPayment.id,
        type: 'PAYMENT',
        asset: simulatedPayment.currency,
        amount: simulatedPayment.amount,
        status: 'EXECUTED',
        timestamp: simulatedPayment.timestamp,
        txHash: simulatedPayment.txHash,
        automatic: false
      };
      
      agentEngine.addManualTrade('crossmint', transaction);
      
      res.json({
        success: true,
        message: 'Payment processed successfully (simulated)',
        payment: simulatedPayment
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/crossmint/balance/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    
    // Simulate balance check - in production this would query actual balance
    const balance = {
      walletAddress,
      balance: (Math.random() * 10 + 1).toFixed(2),
      currency: 'SEI',
      lastUpdated: new Date().toISOString()
    };
    
    res.json(balance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get agent statistics
router.get('/agent-stats/:agentAddress', async (req, res) => {
  try {
    const { agentAddress } = req.params;
    const stats = await agentEngine.getAgentStats(agentAddress);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all agent statistics
router.get('/all-agents', async (req, res) => {
  try {
    const stats = await agentEngine.getAllAgentStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get system statistics
router.get('/system-stats', async (req, res) => {
  try {
    const stats = agentEngine.getSystemStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Deactivate agent
router.post('/deactivate/:agentAddress', async (req, res) => {
  try {
    const { agentAddress } = req.params;
    const result = await agentEngine.deactivateAgent(agentAddress);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reactivate agent
router.post('/reactivate/:agentAddress', async (req, res) => {
  try {
    const { agentAddress } = req.params;
    const result = await agentEngine.reactivateAgent(agentAddress);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start real-time monitoring
router.post('/start-monitoring', async (req, res) => {
  try {
    const io = req.app.get('io');
    seiAnalytics.startRealTimeMonitoring(io);
    agentEngine.setSocketIO(io);
    res.json({ success: true, message: 'Real-time monitoring started' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stop real-time monitoring
router.post('/stop-monitoring', async (req, res) => {
  try {
    seiAnalytics.stopRealTimeMonitoring();
    res.json({ success: true, message: 'Real-time monitoring stopped' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/monitor', async (req, res) => {
  const { wallet, threshold, token, recipient } = req.body;
  try {
    // Get real volatility data using Sei analytics
    const volatilityData = await seiAnalytics.calculateVolatility(token);
    const volatility = parseFloat(volatilityData.volatility) / 100; // Convert percentage to decimal
    
    const balance = await provider.getBalance(wallet);
    
    if (volatility > threshold) {
      const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
      const contract = new ethers.Contract(contractAddress, contractAbi, signer);
      
      // Process payment via Crossmint
      try {
        const payment = await crossmintService.processPayment({
          recipient,
          amount: '1000',
          currency: 'ETH',
          description: `NeonTradeBot automated trade: ${token}`
        });
        
        // Use the new smart contract function with payment ID
        const tx = await contract.executeTradeWithPayment(token, 1000, recipient, payment.id);
        await tx.wait();
        
        req.app.get('io').emit('log', `Trade triggered: 1000 ${token} to ${recipient} | Volatility: ${(volatility * 100).toFixed(2)}% | Payment ID: ${payment.id}`);
        res.json({ 
          action: 'Trade triggered', 
          balance: ethers.formatEther(balance),
          volatility: (volatility * 100).toFixed(2) + '%',
          paymentId: payment.id,
          crossmintStatus: payment.status,
          transactionHash: tx.hash
        });
      } catch (crossmintError) {
        // Fallback to regular trade execution
        const tx = await contract.executeTrade(token, 1000, recipient);
        await tx.wait();
        
        req.app.get('io').emit('log', `Trade triggered: 1000 ${token} to ${recipient} | Volatility: ${(volatility * 100).toFixed(2)}% | Crossmint payment failed: ${crossmintError.message}`);
        res.json({ 
          action: 'Trade triggered (payment failed)', 
          balance: ethers.formatEther(balance),
          volatility: (volatility * 100).toFixed(2) + '%',
          error: crossmintError.message,
          transactionHash: tx.hash
        });
      }
    } else {
      req.app.get('io').emit('log', `No trade triggered | Volatility: ${(volatility * 100).toFixed(2)}% (below threshold: ${(threshold * 100).toFixed(2)}%)`);
      res.json({ 
        action: 'No trade', 
        balance: ethers.formatEther(balance),
        volatility: (volatility * 100).toFixed(2) + '%',
        threshold: (threshold * 100).toFixed(2) + '%'
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crossmint checkout session endpoint
router.post('/checkout', async (req, res) => {
  try {
    const { recipient, collectionId, tokenId, price, currency } = req.body;
    
    const session = await crossmintService.createCheckoutSession({
      recipient,
      collectionId,
      tokenId,
      price,
      currency
    });

    res.json({ 
      success: true, 
      sessionId: session.id,
      checkoutUrl: session.url 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crossmint wallet creation endpoint
router.post('/wallet', async (req, res) => {
  try {
    const { email, type } = req.body;
    
    const wallet = await crossmintService.createWallet({
      email,
      type: type || 'ethereum'
    });

    res.json({ 
      success: true, 
      wallet: {
        address: wallet.address,
        type: wallet.type
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// NFT minting endpoint
router.post('/mint', async (req, res) => {
  try {
    const { recipient, metadata, collectionId } = req.body;
    
    const mintResult = await crossmintService.mintNFT({
      recipient,
      metadata,
      collectionId
    });

    req.app.get('io').emit('log', `NFT minted for ${recipient} | Transaction: ${mintResult.transactionId}`);
    res.json({ 
      success: true, 
      transactionId: mintResult.transactionId,
      tokenId: mintResult.tokenId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Transaction status endpoint
router.get('/transaction/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const status = await crossmintService.getTransactionStatus(id);
    
    res.json({ 
      success: true, 
      status: status.status,
      details: status
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crossmint payment processing
router.post('/process-payment', async (req, res) => {
  try {
    const { recipient, amount, currency, description } = req.body;
    
    const payment = await crossmintService.processPayment({
      recipient,
      amount,
      currency,
      description
    });
    
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Confirm trade execution after wallet approval
router.post('/confirm-trade', async (req, res) => {
  try {
    const { agent, txHash, status, ...tradeData } = req.body;
    
    // Update agent statistics
    const agentConfig = agentEngine.activeAgents?.get(agent);
    if (agentConfig) {
      agentConfig.totalTrades++;
      if (status === 'SUCCESS') {
        agentConfig.successfulTrades++;
        agentConfig.totalVolume += parseFloat(tradeData.amount) || 0;
      }
    }
    
    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.emit('tradeExecuted', {
        ...tradeData,
        agent,
        txHash,
        status,
        timestamp: new Date().toISOString()
      });
      
      if (agentConfig) {
        io.emit('agentStats', {
          agent,
          totalTrades: agentConfig.totalTrades,
          successfulTrades: agentConfig.successfulTrades,
          totalVolume: agentConfig.totalVolume.toFixed(4),
          successRate: ((agentConfig.successfulTrades / agentConfig.totalTrades) * 100).toFixed(1)
        });
      }
    }
    
    res.json({ success: true, message: 'Trade confirmed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Batch trading endpoint
router.post('/batch-trade', async (req, res) => {
  try {
    const { trades } = req.body; // Array of { token, amount, recipient, paymentId? }
    
    if (!trades || !Array.isArray(trades) || trades.length === 0) {
      return res.status(400).json({ error: 'Trades array is required' });
    }

    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const contract = new ethers.Contract(contractAddress, contractAbi, signer);

    const tokens = trades.map(t => t.token);
    const amounts = trades.map(t => t.amount);
    const recipients = trades.map(t => t.recipient);
    const paymentIds = trades.map(t => t.paymentId || '');

    const tx = await contract.batchExecuteTrades(tokens, amounts, recipients, paymentIds);
    await tx.wait();

    req.app.get('io').emit('log', `Batch trade executed: ${trades.length} trades | Transaction: ${tx.hash}`);
    res.json({
      success: true,
      transactionHash: tx.hash,
      tradesCount: trades.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Agent authorization endpoint
router.post('/authorize', async (req, res) => {
  try {
    const { agentAddress } = req.body;
    
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const contract = new ethers.Contract(contractAddress, contractAbi, signer);
    
    const tx = await contract.authorizeAgent(agentAddress);
    await tx.wait();

    req.app.get('io').emit('log', `Agent authorized: ${agentAddress}`);
    res.json({
      success: true,
      transactionHash: tx.hash,
      authorizedAgent: agentAddress
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;