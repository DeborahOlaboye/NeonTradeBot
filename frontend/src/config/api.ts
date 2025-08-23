// API Configuration for NeonTradeBot
// Production backend URL on Render
export const API_BASE_URL = 'https://neontradebot.onrender.com';

// API endpoints
export const API_ENDPOINTS = {
  health: '/health',
  agents: {
    create: '/api/agents/create',
    start: '/api/agents/start',
    stop: '/api/agents/stop',
    status: '/api/agents/status',
    tradingPairs: '/api/agents/trading-pairs',
    transactionHistory: '/api/agents/transaction-history',
    executeTrade: '/api/agents/execute-trade',
    crossmintWallet: '/api/agents/crossmint/wallet',
    crossmintCheckout: '/api/agents/crossmint/checkout',
    crossmintMint: '/api/agents/crossmint/mint'
  }
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};
