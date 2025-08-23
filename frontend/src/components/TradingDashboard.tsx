"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/ui/components/Button";
import { TextField } from "@/ui/components/TextField";
import { Alert } from "@/ui/components/Alert";
import { Badge } from "@/ui/components/Badge";
import { Table } from "@/ui/components/Table";
import { Avatar } from "@/ui/components/Avatar";
import { IconButton } from "@/ui/components/IconButton";
import { 
  FeatherTrendingUp, 
  FeatherDollarSign,
  FeatherActivity,
  FeatherRefreshCw,
  FeatherPlus,
  FeatherX,
  FeatherChevronDown
} from "@/subframe/core";
import { CrossmintIntegration } from "./CrossmintIntegration";

interface Trade {
  id: string;
  type: 'BUY' | 'SELL';
  asset: string;
  amount: string;
  price: string;
  status: 'EXECUTED' | 'PENDING' | 'FAILED';
  timestamp: string;
  paymentMethod?: string;
  crossmintId?: string;
}

interface TradingDashboardProps {
  walletAddress?: string;
  onDisconnect?: () => void;
  onNavigate?: (page: string) => void;
  currentPage?: string;
  onLog?: (message: string) => void;
}

export function TradingDashboard({ walletAddress, onDisconnect, onNavigate, currentPage, onLog }: TradingDashboardProps) {
  const [trades, setTrades] = useState<Trade[]>([]);

  // Fetch transaction history on component mount
  useEffect(() => {
    const fetchTransactionHistory = async () => {
      try {
        const response = await fetch("http://localhost:3002/api/agents/transaction-history");
        const result = await response.json();
        
        if (response.ok && result.success) {
          const formattedTrades = result.transactions.map((tx: any) => ({
            id: tx.id,
            type: tx.type,
            asset: tx.asset,
            amount: `${tx.amount} ${tx.asset.split('/')[0]}`,
            price: tx.price,
            status: tx.status,
            timestamp: new Date(tx.timestamp).toLocaleString(),
            paymentMethod: 'Bot Execution',
            crossmintId: tx.txHash
          }));
          setTrades(formattedTrades);
        }
      } catch (error) {
        logMessage(`❌ Failed to fetch transaction history: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    };

    fetchTransactionHistory();
  }, []);

  const [newTradeAmount, setNewTradeAmount] = useState("");
  const [newTradeAsset, setNewTradeAsset] = useState("SEI");
  const [loading, setLoading] = useState(false);

  const logMessage = (message: string) => {
    console.log(message);
    if (onLog) onLog(message);
  };

  const executeTrade = async (type: 'BUY' | 'SELL') => {
    if (!newTradeAmount || !newTradeAsset) {
      logMessage("Please enter trade amount and asset");
      return;
    }

    setLoading(true);
    try {
      // Execute trade via bot API
      const tradeResponse = await fetch("http://localhost:3002/api/agents/execute-trade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: walletAddress || "0x7fc58f2d50790f6cddb631b4757f54b893692dde",
          privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000001",
          tokenAddress: `0x${newTradeAsset.toLowerCase()}123456789`,
          amount: newTradeAmount,
          tradeType: type,
          recipient: walletAddress || "0x7fc58f2d50790f6cddb631b4757f54b893692dde"
        }),
      });

      const tradeResult = await tradeResponse.json();

      if (tradeResponse.ok && tradeResult.success) {
        const newTrade: Trade = {
          id: tradeResult.transaction.id,
          type,
          asset: `${newTradeAsset}/USDT`,
          amount: `${newTradeAmount} ${newTradeAsset}`,
          price: `${(parseFloat(newTradeAmount) * 0.45).toFixed(2)}`,
          status: 'EXECUTED',
          timestamp: 'Just now',
          paymentMethod: 'Bot Execution',
          crossmintId: tradeResult.txHash
        };

        setTrades(prev => [newTrade, ...prev]);
        logMessage(`✅ ${type} trade executed: ${newTradeAmount} ${newTradeAsset}`);
        logMessage(`📋 Transaction: ${tradeResult.txHash}`);
        setNewTradeAmount("");
      } else {
        logMessage(`❌ Trade execution failed: ${tradeResult.error}`);
      }
    } catch (error) {
      logMessage(`❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'EXECUTED':
        return <Badge variant="success">Executed</Badge>;
      case 'PENDING':
        return <Badge variant="warning">Pending</Badge>;
      case 'FAILED':
        return <Badge variant="error">Failed</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'BUY' ? 
      <div style={{ color: '#10b981' }}><FeatherTrendingUp /></div> : 
      <div style={{ color: '#ef4444' }}><FeatherChevronDown /></div>;
  };

  return (
    <div className="flex w-full flex-col items-start gap-6">
      {/* Trading Controls */}
      <div className="flex w-full flex-col items-start gap-6 rounded-md border border-solid border-[#4269aaff] bg-[#030c36ff] px-6 py-6">
        <div className="flex w-full items-center gap-3">
          <FeatherActivity className="text-[#c82fff]" size={24} />
          <span className="text-heading-3 font-heading-3 text-[#00f0ffff]">
            Quick Trade Execution
          </span>
          <Badge variant="brand">Crossmint Powered</Badge>
        </div>

        <div className="flex w-full gap-3">
          <TextField
            variant="filled"
            label=""
            helpText=""
            className="flex-1"
          >
            <TextField.Input
              placeholder="Amount (e.g., 1000)"
              value={newTradeAmount}
              onChange={(e) => setNewTradeAmount(e.target.value)}
            />
          </TextField>
          <TextField
            variant="filled"
            label=""
            helpText=""
            className="w-32"
          >
            <TextField.Input
              placeholder="Asset"
              value={newTradeAsset}
              onChange={(e) => setNewTradeAsset(e.target.value)}
            />
          </TextField>
          <Button
            variant="brand-primary"
            icon={<FeatherTrendingUp />}
            onClick={() => executeTrade('BUY')}
            disabled={loading}
          >
            Buy
          </Button>
          <Button
            variant="brand-secondary"
            icon={<FeatherChevronDown />}
            onClick={() => executeTrade('SELL')}
            disabled={loading}
          >
            Sell
          </Button>
        </div>
      </div>

      {/* Recent Trades Table */}
      <div className="flex w-full flex-col items-start gap-4 rounded-md border border-solid border-[#4269aaff] bg-[#030c36ff] px-6 py-6">
        <div className="flex w-full items-center justify-between">
          <span className="text-heading-3 font-heading-3 text-[#00f0ffff]">
            Recent Trades
          </span>
          <IconButton
            size="medium"
            icon={<FeatherRefreshCw />}
            onClick={() => window.location.reload()}
          />
        </div>

        <Table
          header={
            <Table.HeaderRow>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell>Asset</Table.HeaderCell>
              <Table.HeaderCell>Amount</Table.HeaderCell>
              <Table.HeaderCell>Price</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Payment</Table.HeaderCell>
              <Table.HeaderCell>Time</Table.HeaderCell>
              <Table.HeaderCell>TX Hash</Table.HeaderCell>
            </Table.HeaderRow>
          }
        >
          {trades.map((trade) => (
            <Table.Row key={trade.id}>
              <Table.Cell>
                <div className="flex items-center gap-2">
                  {getTypeIcon(trade.type)}
                  <span className={`text-body font-body ${
                    trade.type === 'BUY' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {trade.type}
                  </span>
                </div>
              </Table.Cell>
              <Table.Cell>
                <div className="flex items-center gap-2">
                  <Avatar size="small" image="">
                    {trade.asset.charAt(0)}
                  </Avatar>
                  <span className="text-body font-body text-[#8ca1ccff]">
                    {trade.asset}
                  </span>
                </div>
              </Table.Cell>
              <Table.Cell>
                <span className="text-body font-body text-[#8ca1ccff]">
                  {trade.amount}
                </span>
              </Table.Cell>
              <Table.Cell>
                <span className="text-body font-body text-[#8ca1ccff]">
                  {trade.price}
                </span>
              </Table.Cell>
              <Table.Cell>
                {getStatusBadge(trade.status)}
              </Table.Cell>
              <Table.Cell>
                <span className="text-body font-body text-[#00f0ff]">
                  {trade.paymentMethod || 'Direct'}
                </span>
              </Table.Cell>
              <Table.Cell>
                <span className="text-body font-body text-[#8ca1ccff]">
                  {trade.timestamp}
                </span>
              </Table.Cell>
              <Table.Cell>
                <span className="text-body font-body text-[#8ca1ccff] font-mono text-xs">
                  {trade.crossmintId || 'N/A'}
                </span>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table>
      </div>

      {/* Crossmint Integration Panel */}
      <CrossmintIntegration onLog={onLog} />
    </div>
  );
}
