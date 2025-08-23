import React, { useEffect } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { ethers } from 'ethers';
import io from 'socket.io-client';

interface TradeExecutorProps {
  isAuthorized: boolean;
}

export function TradeExecutor({ isAuthorized }: TradeExecutorProps) {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  useEffect(() => {
    if (!isAuthorized || !isConnected || !address) return;

    const socket = io('http://localhost:3002');

    const handleTradeSignal = async (tradeSignal: any) => {
      console.log('🔔 Received trade signal:', tradeSignal);

      if (!walletClient) {
        console.error('❌ No wallet client available');
        return;
      }

      try {
        // Contract details
        const contractAddress = '0x7fc58f2d50790f6cddb631b4757f54b893692dde';
        const contractABI = [
          "function executeTrade(address token, uint256 amount, address recipient) external"
        ];

        // Create ethers provider from wallet client
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        console.log(`🔄 Executing ${tradeSignal.tradeType} trade for ${tradeSignal.pair.symbol}`);

        // Execute the trade
        const tx = await contract.executeTrade(
          tradeSignal.pair.contractAddress || ethers.ZeroAddress,
          ethers.parseEther(tradeSignal.amount.toString()),
          address
        );

        console.log(`📤 Transaction sent: ${tx.hash}`);

        // Wait for confirmation
        const receipt = await tx.wait();
        console.log(`✅ Trade executed successfully! Block: ${receipt.blockNumber}`);

        // Notify backend of successful execution
        socket.emit('tradeExecuted', {
          agentId: tradeSignal.agentId,
          tradeId: tradeSignal.timestamp,
          txHash: tx.hash,
          blockNumber: receipt.blockNumber,
          timestamp: Date.now()
        });

      } catch (error: any) {
        console.error('❌ Trade execution failed:', error);
        
        // Report execution back to backend
        if (socket) {
          socket.emit('tradeExecutionResult', {
            agentId: tradeSignal.agentId,
            tradeId: `auto_${tradeSignal.timestamp}`,
            success: false,
            error: error.message,
            timestamp: Date.now()
          });

          // Also emit trade executed event for live updates
          socket.emit('tradeExecuted', {
            agentId: tradeSignal.agentId,
            tradeId: `auto_${tradeSignal.timestamp}`,
            error: error.message,
            timestamp: Date.now()
          });
        }
      }
    };

    // Listen for trade signals from backend
    socket.on('executeTradeSignal', handleTradeSignal);

    return () => {
      socket.off('executeTradeSignal', handleTradeSignal);
      socket.disconnect();
    };
  }, [isAuthorized, isConnected, address, walletClient]);

  return null; // This is a background component
}
