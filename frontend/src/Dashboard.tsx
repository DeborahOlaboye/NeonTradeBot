"use client";

import React, { useState, useEffect } from "react";
import { Alert } from "@/ui/components/Alert";
import { Button } from "@/ui/components/Button";
import { DefaultPageLayout } from "@/ui/layouts/DefaultPageLayout";
import { TextField } from "@/ui/components/TextField";
import { IconButton } from "@/ui/components/IconButton";
import { Table } from "@/ui/components/Table";
import { Badge } from "@/ui/components/Badge";
import { Avatar } from "@/ui/components/Avatar";
import { ToggleGroup } from "@/ui/components/ToggleGroup";
import { 
  FeatherSearch,
  FeatherRefreshCw,
  FeatherTrendingUp,
  FeatherDollarSign,
  FeatherActivity,
  FeatherClock,
  FeatherCheck,
  FeatherX,
  FeatherAlertCircle,
  FeatherWallet,
  FeatherPlus,
  FeatherChevronDown
} from "@/subframe/core";
import Sidebar from "./components/Sidebar";
import { WalletConnection } from "./components/WalletConnection";

interface DashboardProps {
  walletAddress: string;
  onDisconnect: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

function Dashboard({ walletAddress, onDisconnect, onNavigate, currentPage }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [trades, setTrades] = useState<any[]>([]);
  const [settlements, setSettlements] = useState<any[]>([]);

  // Fetch real transaction history on component mount
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("http://localhost:3002/api/agents/transaction-history");
        const result = await response.json();
        setTrades(result);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };
    fetchTransactions();
  }, []);

  return (
    <DefaultPageLayout>
      <div className="container max-w-none flex h-full w-full flex-col items-start bg-[#0a0f2aff]">
        <div className="flex w-full items-center gap-4 border-b border-solid border-neutral-border px-6 py-6">
          <span className="grow shrink-0 basis-0 text-heading-2 font-heading-2 text-[#00f0ffff]">
            Dashboard
          </span>
          <div className="flex items-start gap-2">
            <TextField
              variant="filled"
              label=""
              helpText=""
              icon={<FeatherSearch />}
            >
              <TextField.Input
                placeholder="Search transactions"
                value={searchQuery}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(event.target.value)}
              />
            </TextField>
            <Button
              icon={<FeatherWallet />}
              onClick={() => navigator.clipboard.writeText(walletAddress)}
            >
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </Button>
          </div>
        </div>
        <div className="flex w-full items-center gap-4 border-b border-solid border-neutral-border px-6 py-4">
          <Sidebar currentPage={currentPage} onNavigate={onNavigate} />
        </div>
        <div className="flex w-full grow shrink-0 basis-0 flex-wrap items-start">
          <div className="flex grow shrink-0 basis-0 flex-col items-start self-stretch overflow-auto">
            <div className="flex w-full flex-col items-start gap-6 border-b border-solid border-neutral-border px-6 py-6">
              <div className="flex w-full items-center gap-2">
                <span className="grow shrink-0 basis-0 text-heading-3 font-heading-3 text-[#8ca1ccff]">
                  Recent Trades
                </span>
                <Button
                  variant="neutral-primary"
                  iconRight={<FeatherChevronDown />}
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
                >
                  All Trades
                </Button>
              </div>
              <Table
                header={
                  <Table.HeaderRow>
                    <Table.HeaderCell>Type</Table.HeaderCell>
                    <Table.HeaderCell>Asset</Table.HeaderCell>
                    <Table.HeaderCell>Amount</Table.HeaderCell>
                    <Table.HeaderCell>Price</Table.HeaderCell>
                    <Table.HeaderCell>Status</Table.HeaderCell>
                    <Table.HeaderCell>Time</Table.HeaderCell>
                  </Table.HeaderRow>
                }
              >
                {trades.filter(trade => 
                  trade.asset.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  trade.type.toLowerCase().includes(searchQuery.toLowerCase())
                ).map(trade => (
                  <Table.Row key={trade.id}>
                    <Table.Cell>
                      <span className={`text-body font-body ${trade.type === 'Buy' ? 'text-[#00f0ffff]' : 'text-[#ca4e98ff]'}`}>
                        {trade.type}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center gap-2">
                        <Avatar
                          size="small"
                          image={trade.asset.includes('ETH') ? "https://images.unsplash.com/photo-1622630998477-20aa696ecb05" : "https://images.unsplash.com/photo-1621416894569-0f39ed31d247"}
                        >
                          {trade.asset.charAt(0)}
                        </Avatar>
                        <span className="text-body font-body text-[#8ca1ccff]">
                          {trade.asset}
                        </span>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table>
            </div>
            <div className="flex w-full flex-col items-start gap-6 px-6 py-6">
              <div className="flex w-full items-center gap-2">
                <span className="grow shrink-0 basis-0 text-heading-3 font-heading-3 text-[#8ca1ccff]">
                  Settlement History
                </span>
                <Button
                  variant="neutral-primary"
                  iconRight={<FeatherChevronDown />}
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
                >
                  Last 24h
                </Button>
              </div>
              <Table
                header={
                  <Table.HeaderRow>
                    <Table.HeaderCell>Transaction ID</Table.HeaderCell>
                    <Table.HeaderCell>Amount</Table.HeaderCell>
                    <Table.HeaderCell>Method</Table.HeaderCell>
                    <Table.HeaderCell>Status</Table.HeaderCell>
                    <Table.HeaderCell>Time</Table.HeaderCell>
                  </Table.HeaderRow>
                }
              >
                {settlements.map(settlement => (
                  <Table.Row key={settlement.id}>
                    <Table.Cell>
                      <span className="text-body font-body text-[#8ca1ccff]">
                        {settlement.id}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="text-body font-body text-[#8ca1ccff]">
                        {settlement.amount}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="text-body font-body text-[#8ca1ccff]">
                        {settlement.method}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge>{settlement.status}</Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="text-body font-body text-[#8ca1ccff]">
                        {settlement.time}
                      </span>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table>
            </div>
          </div>
          <div className="flex w-96 flex-none flex-col items-start self-stretch border-l border-solid border-neutral-border">
            <div className="flex w-full flex-col items-start gap-6 border-b border-solid border-neutral-border px-6 py-6">
              <span className="text-heading-3 font-heading-3 text-[#00f0ffff]">
                Quick Actions
              </span>
              <div className="flex w-full flex-col items-start gap-4">
                <Button
                  className="h-8 w-full flex-none"
                  icon={<FeatherPlus />}
                  onClick={() => onNavigate('trades')}
                >
                  New Trade
                </Button>
                <Button
                  className="h-8 w-full flex-none"
                  variant="brand-secondary"
                  icon={<FeatherRefreshCw />}
                  onClick={() => onNavigate('agent-config')}
                >
                  Update Config
                </Button>
                <Button
                  className="h-8 w-full flex-none"
                  variant="brand-secondary"
                  icon={<FeatherActivity />}
                  onClick={() => window.open('/analytics', '_blank')}
                >
                  View Analytics
                </Button>
              </div>
            </div>
            <div className="flex w-full flex-col items-start gap-6 px-6 py-6">
              <Alert
                variant="brand"
                title="Trading Status"
                description="Bot is currently active and monitoring market conditions."
                actions={
                  <IconButton
                    size="medium"
                    icon={<FeatherX />}
                    onClick={() => console.log('Alert dismissed')}
                  />
                }
              />
            </div>
          </div>
        </div>
      </div>
    </DefaultPageLayout>
  );
}

export default Dashboard;
