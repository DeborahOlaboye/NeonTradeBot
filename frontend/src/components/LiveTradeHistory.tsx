import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

interface Trade {
  id: string;
  type: string;
  asset: string;
  amount: string;
  price: string;
  status: string;
  timestamp: string;
  volatility?: number;
  automatic: boolean;
  txHash?: string;
}

interface LiveTradeHistoryProps {
  agentId: string;
  isVisible?: boolean;
}

export function LiveTradeHistory({ agentId, isVisible = true }: LiveTradeHistoryProps) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [lastTradeMessage, setLastTradeMessage] = useState<string>('');

  useEffect(() => {
    // Connect to backend socket
    const newSocket = io('http://localhost:3002');
    setSocket(newSocket);

    // Listen for trade updates
    newSocket.on('tradeUpdate', (data: any) => {
      if (data.agentId === agentId) {
        setLastTradeMessage(data.message);
        // Add trade to history if not already present
        setTrades(prev => {
          const exists = prev.find(t => t.id === data.trade.id);
          if (!exists) {
            return [data.trade, ...prev].slice(0, 20); // Keep last 20 trades
          }
          return prev;
        });
      }
    });

    // Listen for trade history updates
    newSocket.on('tradeHistoryUpdate', (data: any) => {
      if (data.agentId === agentId) {
        setTrades(data.trades.reverse()); // Show newest first
      }
    });

    // Listen for trade execution confirmations
    newSocket.on('tradeExecuted', (data: any) => {
      if (data.agentId === agentId) {
        setTrades(prev => prev.map(trade => 
          trade.id === data.tradeId 
            ? { ...trade, status: 'EXECUTED', txHash: data.txHash }
            : trade
        ));
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [agentId]);

  if (!isVisible) return null;

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'EXECUTED': return 'text-green-400';
      case 'PENDING_EXECUTION': return 'text-yellow-400';
      case 'FAILED': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getTradeTypeColor = (type: string) => {
    return type === 'BUY' ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className="bg-[#1a1f3a] rounded-lg p-4 border border-[#2a2f4a]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          Live Bot Trades
        </h3>
        <div className="text-sm text-gray-400">
          {trades.length} trades executed
        </div>
      </div>

      {lastTradeMessage && (
        <div className="mb-4 p-3 bg-[#0a0f2a] rounded-lg border border-[#C82FFF]/20">
          <div className="text-[#C82FFF] text-sm font-medium">
            {lastTradeMessage}
          </div>
          <div className="text-gray-400 text-xs mt-1">
            {new Date().toLocaleTimeString()}
          </div>
        </div>
      )}

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {trades.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-2">🤖</div>
            <div>Waiting for bot to execute trades...</div>
            <div className="text-sm mt-1">Monitoring every 2.5 seconds</div>
          </div>
        ) : (
          trades.map((trade) => (
            <div key={trade.id} className="bg-[#0a0f2a] rounded-lg p-3 border border-[#2a2f4a] hover:border-[#C82FFF]/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`font-bold ${getTradeTypeColor(trade.type)}`}>
                    {trade.type}
                  </div>
                  <div className="text-white font-medium">
                    {trade.amount} {trade.asset}
                  </div>
                  <div className="text-gray-400">
                    @ ${trade.price}
                  </div>
                  {trade.automatic && (
                    <div className="bg-[#C82FFF]/20 text-[#C82FFF] px-2 py-1 rounded text-xs">
                      AUTO
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${getStatusColor(trade.status)}`}>
                    {trade.status.replace('_', ' ')}
                  </div>
                  <div className="text-xs text-gray-400">
                    {formatTime(trade.timestamp)}
                  </div>
                </div>
              </div>
              
              {trade.volatility && (
                <div className="mt-2 text-xs text-gray-400">
                  Volatility: {trade.volatility.toFixed(2)}%
                </div>
              )}
              
              {trade.txHash && (
                <div className="mt-2 text-xs">
                  <a 
                    href={`https://seitrace.com/tx/${trade.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00F0FF] hover:underline"
                  >
                    View Transaction →
                  </a>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
