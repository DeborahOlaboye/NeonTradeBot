import { io, Socket } from 'socket.io-client';

const API_BASE_URL = 'https://neontradebot.onrender.com';
const API_KEY = 'neontradebot-2025';

// Helper function to get authenticated headers
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'X-API-Key': API_KEY
});

export interface NetworkStats {
  blockNumber: number;
  gasPrice: string;
  contractBalance: string;
  networkStatus: string;
  chainId: number;
  finality: string;
}

export interface AgentConfig {
  walletAddress: string;
  volatilityThreshold: number;
  maxTradeAmount: number;
  tradingPairs?: string[];
  isActive?: boolean;
}

export interface TradeLog {
  timestamp: string;
  type: 'BUY' | 'SELL';
  pair: string;
  amount: number;
  price: number;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
}

class ApiService {
  private socket: Socket | null = null;

  constructor() {
    this.setupWebSocket();
  }

  setupWebSocket() {
    this.socket = io(API_BASE_URL);
    
    this.socket.on('networkStats', (data) => {
      console.log('Network stats update:', data);
    });
    
    this.socket.on('tradeExecuted', (data) => {
      console.log('Trade executed:', data);
    });
    
    this.socket.on('tradeSignal', (data) => {
      console.log('Trade signal received - wallet approval needed:', data);
      // Emit custom event for components to handle wallet transactions
      window.dispatchEvent(new CustomEvent('tradeSignal', { detail: data }));
    });
    
    this.socket.on('log', (message) => {
      console.log('Agent log:', message);
    });
  }

  // Network and contract data
  async getNetworkStats(): Promise<NetworkStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/agents/network-stats`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch network stats');
      return await response.json();
    } catch (error) {
      console.error('Error fetching network stats:', error);
      throw error;
    }
  }

  // Agent configuration
  async configureAgent(config: AgentConfig): Promise<any> {
    try {
      console.log('Configuring agent with config:', config);
      const response = await fetch(`${API_BASE_URL}/api/agents/configure`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(config),
      });
      
      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Response body:', responseText);
      
      if (!response.ok) {
        throw new Error(`Failed to configure agent: ${response.status} - ${responseText}`);
      }
      
      return responseText ? JSON.parse(responseText) : {};
    } catch (error) {
      console.error('Error configuring agent:', error);
      throw error;
    }
  }

  async startAgent(agentId: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/agents/start`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ agentId }),
      });
      
      const responseText = await response.text();
      console.log('Start agent response:', responseText);
      
      if (!response.ok) throw new Error('Failed to start agent');
      return responseText ? JSON.parse(responseText) : {};
    } catch (error) {
      console.error('Error starting agent:', error);
      throw error;
    }
  }

  async stopAgent(agentId: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/agents/stop`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ agentId }),
      });
      
      const responseText = await response.text();
      console.log('Stop agent response:', responseText);
      
      if (!response.ok) throw new Error(`Failed to stop agent: ${response.status} - ${responseText}`);
      return responseText ? JSON.parse(responseText) : {};
    } catch (error) {
      console.error('Error stopping agent:', error);
      throw error;
    }
  }

  // Analytics and monitoring
  async getAnalytics(): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/agents/analytics`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return await response.json();
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  }

  // Real-time event listeners
  onNetworkUpdate(callback: (data: NetworkStats) => void) {
    if (this.socket) {
      this.socket.on('networkUpdate', callback);
    }
  }

  onTradeUpdate(callback: (data: TradeLog) => void) {
    if (this.socket) {
      this.socket.on('tradeUpdate', callback);
    }
  }

  onAgentStatusUpdate(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('agentStatusUpdate', callback);
    }
  }

  // Confirm trade execution after wallet approval
  async confirmTradeExecution(tradeData: any): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/agents/confirm-trade`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(tradeData),
      });
      if (!response.ok) throw new Error('Failed to confirm trade');
      return await response.json();
    } catch (error) {
      console.error('Error confirming trade:', error);
      throw error;
    }
  }

  // Trading pairs
  async getTradingPairs(): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/agents/trading-pairs`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch trading pairs');
      return await response.json();
    } catch (error) {
      console.error('Error fetching trading pairs:', error);
      throw error;
    }
  }

  // Cleanup
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export const apiService = new ApiService();
export default apiService;
