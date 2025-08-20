import { io, Socket } from 'socket.io-client';

const BACKEND_URL = 'http://localhost:3002';

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
  privateKey: string;
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
    this.initializeSocket();
  }

  private initializeSocket() {
    this.socket = io(BACKEND_URL);
    
    this.socket.on('connect', () => {
      console.log('Connected to backend');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from backend');
    });
  }

  // Network and contract data
  async getNetworkStats(): Promise<NetworkStats> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/agents/network-stats`);
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
      const response = await fetch(`${BACKEND_URL}/api/agents/configure`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });
      if (!response.ok) throw new Error('Failed to configure agent');
      return await response.json();
    } catch (error) {
      console.error('Error configuring agent:', error);
      throw error;
    }
  }

  async startAgent(agentId: string): Promise<any> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/agents/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ agentId }),
      });
      if (!response.ok) throw new Error('Failed to start agent');
      return await response.json();
    } catch (error) {
      console.error('Error starting agent:', error);
      throw error;
    }
  }

  async stopAgent(agentId: string): Promise<any> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/agents/stop`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ agentId }),
      });
      if (!response.ok) throw new Error('Failed to stop agent');
      return await response.json();
    } catch (error) {
      console.error('Error stopping agent:', error);
      throw error;
    }
  }

  // Analytics and monitoring
  async getAnalytics(): Promise<any> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/agents/analytics`);
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

  // Cleanup
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export const apiService = new ApiService();
export default apiService;
