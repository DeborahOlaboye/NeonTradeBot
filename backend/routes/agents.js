const express = require('express');
const router = express.Router();
const ethers = require('ethers');
const crossmintService = require('../services/crossmint');
const SeiAnalyticsService = require('../services/seiAnalytics');

const provider = new ethers.JsonRpcProvider('https://evm-rpc-testnet.sei-apis.com'); // Sei testnet RPC
const contractAddress = process.env.CONTRACT_ADDRESS || '0x7fc58f2d50790f6cddb631b4757f54b893692dde'; // Deployed contract address
const seiAnalytics = new SeiAnalyticsService();
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

// Start real-time monitoring
router.post('/start-monitoring', async (req, res) => {
  try {
    const io = req.app.get('io');
    seiAnalytics.startRealTimeMonitoring(io);
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