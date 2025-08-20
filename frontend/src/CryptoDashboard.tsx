"use client";

import React from "react";
import Sidebar from "./components/Sidebar";
import { TradingDashboard } from "./components/TradingDashboard";
import { WalletConnection } from "./components/WalletConnection";
import { Button } from "@/ui/components/Button";
import { IconButton } from "@/ui/components/IconButton";
import { IconWithBackground } from "@/ui/components/IconWithBackground";
import { Switch } from "@/ui/components/Switch";
import { Tabs } from "@/ui/components/Tabs";
import { Alert } from "@/ui/components/Alert";
import { Badge } from "@/ui/components/Badge";
import { TextField } from "@/ui/components/TextField";
import { DefaultPageLayout } from "@/ui/layouts/DefaultPageLayout";
import { FeatherSearch } from "@/subframe/core";
import { FeatherWallet } from "@/subframe/core";
import { FeatherX } from "@/subframe/core";
import { FeatherDollarSign } from "@/subframe/core";
import { FeatherArrowUpRight } from "@/subframe/core";
import { FeatherClock } from "@/subframe/core";
import { FeatherAlertCircle } from "@/subframe/core";
import { FeatherCreditCard } from "@/subframe/core";

interface CryptoDashboardProps {
  walletAddress: string;
  onDisconnect: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

function CryptoDashboard({ walletAddress, onDisconnect, onNavigate, currentPage }: CryptoDashboardProps) {
  return (
    <DefaultPageLayout>
      <div className="container max-w-none flex h-full w-full flex-col items-start bg-[#0a0f2aff]">
        <div className="flex w-full items-center gap-4 border-b border-solid border-neutral-border px-6 py-6">
          <img
            className="h-10 flex-none object-contain cursor-pointer hover:opacity-80 transition-opacity"
            src="/src/assets/neon-logo.svg"
            alt="NeonTradeBot"
            onClick={() => window.location.href = '/'}
          />
          <span className="grow shrink-0 basis-0 text-heading-2 font-heading-2 text-[#00f0ffff]">
            Trading Dashboard
          </span>
          <div className="flex items-center gap-4">
            <WalletConnection onDisconnect={onDisconnect} />
          </div>
        </div>
        
        <div className="flex w-full flex-col items-center justify-center gap-8 px-6 pt-8">
          <Sidebar currentPage={currentPage} onNavigate={onNavigate} />
          <div className="w-full max-w-6xl">
            <TextField
              variant="filled"
              label=""
              helpText=""
              icon={<FeatherSearch />}
            >
              <TextField.Input
                placeholder="Search transactions"
                value=""
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {}}
              />
            </TextField>
            <Button
              icon={<FeatherWallet />}
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
            >
              0x7E3b...8F9d
            </Button>
          </div>
        </div>
        <div className="flex w-full grow shrink-0 basis-0 flex-wrap items-start">
          <div className="flex grow shrink-0 basis-0 flex-col items-start self-stretch overflow-auto">
            <div className="flex w-full flex-col items-start gap-6 px-6 py-6">
              <Alert
                variant="brand"
                icon={<FeatherDollarSign />}
                title="Crossmint Settlement"
                description="Track your payment history and manage settlements"
                actions={
                  <IconButton
                    size="medium"
                    icon={<FeatherX />}
                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
                  />
                }
              />
              <div className="flex w-full flex-col items-start gap-6 rounded-md border border-solid border-[#4269aaff] bg-[#030c36ff] px-6 py-6">
                <div className="flex w-full items-center justify-between">
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-body-bold font-body-bold text-[#8ca1ccff]">
                      Available Balance
                    </span>
                    <span className="text-heading-1 font-heading-1 text-[#00f0ffff]">
                      2.45 ETH
                    </span>
                  </div>
                  <Button
                    icon={<FeatherArrowUpRight />}
                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
                  >
                    Withdraw
                  </Button>
                </div>
                <div className="flex w-full flex-col items-start gap-4">
                  <div className="flex w-full items-center justify-between border-b border-solid border-[#4269aaff] px-4 py-4">
                    <div className="flex items-center gap-2">
                      <IconWithBackground variant="success" />
                      <span className="text-body-bold font-body-bold text-[#00f0ffff]">
                        0x71C...9E3F
                      </span>
                    </div>
                    <Badge variant="success">Completed</Badge>
                    <span className="text-body font-body text-[#8ca1ccff]">
                      2.5 ETH
                    </span>
                  </div>
                  <div className="flex w-full items-center justify-between border-b border-solid border-[#4269aaff] px-4 py-4">
                    <div className="flex items-center gap-2">
                      <IconWithBackground icon={<FeatherClock />} />
                      <span className="text-body-bold font-body-bold text-[#c82fffff]">
                        0x82D...7A1B
                      </span>
                    </div>
                    <Badge>Pending</Badge>
                    <span className="text-body font-body text-[#8ca1ccff]">
                      1.8 ETH
                    </span>
                  </div>
                  <div className="flex w-full items-center justify-between border-b border-solid border-[#4269aaff] px-4 py-4">
                    <div className="flex items-center gap-2">
                      <IconWithBackground
                        variant="error"
                        icon={<FeatherAlertCircle />}
                      />
                      <span className="text-body-bold font-body-bold text-[#ca4e98ff]">
                        0x93F...2D4C
                      </span>
                    </div>
                    <Badge variant="error">Failed</Badge>
                    <span className="text-body font-body text-[#8ca1ccff]">
                      0.5 ETH
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-96 flex-none flex-col items-start self-stretch border-l border-solid border-neutral-border">
            <div className="flex w-full flex-col items-start gap-6 px-6 py-6">
              <span className="text-heading-3 font-heading-3 text-[#8ca1ccff]">
                Payment Methods
              </span>
              <div className="flex w-full flex-col items-start gap-4">
                <div className="flex w-full items-center gap-4 rounded-md bg-[#030c36ff] px-4 py-4">
                  <IconWithBackground icon={<FeatherWallet />} />
                  <div className="flex grow shrink-0 basis-0 flex-col items-start">
                    <span className="text-body-bold font-body-bold text-[#00f0ffff]">
                      MetaMask
                    </span>
                    <span className="text-caption font-caption text-[#8ca1ccff]">
                      Connected
                    </span>
                  </div>
                  <Switch
                    checked={false}
                    onCheckedChange={(checked: boolean) => {}}
                  />
                </div>
                <div className="flex w-full items-center gap-4 rounded-md bg-[#030c36ff] px-4 py-4">
                  <IconWithBackground icon={<FeatherCreditCard />} />
                  <div className="flex grow shrink-0 basis-0 flex-col items-start">
                    <span className="text-body-bold font-body-bold text-[#00f0ffff]">
                      Crossmint
                    </span>
                    <span className="text-caption font-caption text-[#8ca1ccff]">
                      Enabled
                    </span>
                  </div>
                  <Switch
                    checked={false}
                    onCheckedChange={(checked: boolean) => {}}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultPageLayout>
  );
}

export default CryptoDashboard;
