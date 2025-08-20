"use client";

import React, { useState, useEffect } from "react";
import { Alert } from "@/ui/components/Alert";
import { Button } from "@/ui/components/Button";
import { TextField } from "@/ui/components/TextField";
import { DefaultPageLayout } from "@/ui/layouts/DefaultPageLayout";
import { FeatherWallet } from "@/subframe/core";
import apiService, { AgentConfig as AgentConfigType } from "./services/api";
import Sidebar from "./components/Sidebar";
import { WalletConnection } from "./components/WalletConnection";

interface AgentConfigProps {
  walletAddress: string;
  onDisconnect: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

function AgentConfig({ walletAddress, onDisconnect, onNavigate, currentPage }: AgentConfigProps) {
  const [config, setConfig] = useState<AgentConfigType>({
    walletAddress: '',
    privateKey: '',
    volatilityThreshold: 5,
    maxTradeAmount: 100,
    isActive: false
  });

  return (
    <DefaultPageLayout>
      <div className="container max-w-none flex h-full w-full flex-col items-start bg-[#0a0f2aff]">
        <div className="flex w-full items-center gap-4 border-b border-solid border-neutral-border px-6 py-6">
          <img
            className="h-16 flex-none object-contain cursor-pointer hover:opacity-80 transition-opacity"
            src="/src/assets/neon-logo.png"
            alt="NeonTradeBot"
            onClick={() => window.location.href = '/'}
          />
          <span className="grow shrink-0 basis-0 text-heading-2 font-heading-2 text-[#00f0ffff]">
            Agent Configuration
          </span>
          <div className="flex items-center gap-4">
            <WalletConnection onDisconnect={onDisconnect} />
          </div>
        </div>
        
        <div className="flex w-full flex-col items-center justify-center gap-8 px-6 pt-8">
          <Sidebar currentPage={currentPage} onNavigate={onNavigate} />
          
          <div className="w-full max-w-2xl">
            <Alert
              variant="brand"
              title="Configure Your Trading Bot"
              description="Set up your trading parameters carefully. These settings will determine how your bot operates in the market."
            />
            
            <div className="mt-8 space-y-6">
              <TextField
                variant="filled"
                label="Wallet Address"
                helpText="Your trading wallet address"
              >
                <TextField.Input
                  placeholder="0x..."
                  value={config.walletAddress}
                  onChange={(e) => setConfig({...config, walletAddress: e.target.value})}
                />
              </TextField>
              
              <TextField
                variant="filled"
                label="Private Key"
                helpText="Private key for automated trading (keep secure)"
              >
                <TextField.Input
                  placeholder="Enter private key"
                  value={config.privateKey}
                  onChange={(e) => setConfig({...config, privateKey: e.target.value})}
                />
              </TextField>
              
              <TextField
                variant="filled"
                label="Volatility Threshold (%)"
                helpText="Trigger trades when price changes exceed this percentage"
              >
                <TextField.Input
                  placeholder="5"
                  value={config.volatilityThreshold.toString()}
                  onChange={(e) => setConfig({...config, volatilityThreshold: parseFloat(e.target.value) || 0})}
                />
              </TextField>
              
              <TextField
                variant="filled"
                label="Max Trade Amount"
                helpText="Maximum amount per trade in USD"
              >
                <TextField.Input
                  placeholder="100"
                  value={config.maxTradeAmount.toString()}
                  onChange={(e) => setConfig({...config, maxTradeAmount: parseFloat(e.target.value) || 0})}
                />
              </TextField>
              
              <div className="flex gap-4 pt-4">
                <Button
                  variant="brand-primary"
                  onClick={() => {
                    apiService.configureAgent(config);
                    setConfig({...config, isActive: true});
                  }}
                >
                  Start Bot
                </Button>
                
                <Button
                  variant="destructive-primary"
                  onClick={() => {
                    setConfig({...config, isActive: false});
                  }}
                >
                  Stop Bot
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultPageLayout>
  );
}

export default AgentConfig;
