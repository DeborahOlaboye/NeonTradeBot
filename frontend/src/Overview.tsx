"use client";

import React from "react";
import { Alert } from "@/ui/components/Alert";
import { Badge } from "@/ui/components/Badge";
import { Button } from "@/ui/components/Button";
import { DropdownMenu } from "@/ui/components/DropdownMenu";
import { IconWithBackground } from "@/ui/components/IconWithBackground";
import { Progress } from "@/ui/components/Progress";
import { TextField } from "@/ui/components/TextField";
import { ToggleGroup } from "@/ui/components/ToggleGroup";
import { DefaultPageLayout } from "@/ui/layouts/DefaultPageLayout";
import { FeatherSearch } from "@/subframe/core";
import { FeatherWallet } from "@/subframe/core";
import * as SubframeCore from "@/subframe/core";
import { FeatherLayoutDashboard } from "@/subframe/core";
import { FeatherSettings } from "@/subframe/core";
import { FeatherTrendingUp } from "@/subframe/core";
import { FeatherDollarSign } from "@/subframe/core";
import { FeatherShare2 } from "@/subframe/core";
import { FeatherArrowUpRight } from "@/subframe/core";
import { FeatherTag } from "@/subframe/core";

function Overview() {
  return (
    <DefaultPageLayout>
      <div className="container max-w-none flex h-full w-full flex-col items-start bg-[#030c36ff]">
        <div className="flex w-full items-center gap-4 border-b border-solid border-neutral-border px-6 py-6">
          <span className="grow shrink-0 basis-0 text-heading-2 font-heading-2 text-[#00f0ffff]">
            NeonTradeBot
          </span>
          <div className="flex items-start gap-2">
            <TextField
              variant="filled"
              label=""
              helpText=""
              icon={<FeatherSearch />}
            >
              <TextField.Input
                placeholder="Search"
                value=""
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {}}
              />
            </TextField>
            <SubframeCore.DropdownMenu.Root>
              <SubframeCore.DropdownMenu.Trigger asChild={true}>
                <Button
                  icon={<FeatherWallet />}
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
                >
                  Connect Wallet
                </Button>
              </SubframeCore.DropdownMenu.Trigger>
              <SubframeCore.DropdownMenu.Portal>
                <SubframeCore.DropdownMenu.Content
                  side="bottom"
                  align="end"
                  sideOffset={4}
                  asChild={true}
                >
                  <DropdownMenu>
                    <DropdownMenu.DropdownItem icon={<FeatherWallet />}>
                      MetaMask
                    </DropdownMenu.DropdownItem>
                    <DropdownMenu.DropdownItem icon={<FeatherWallet />}>
                      Keplr
                    </DropdownMenu.DropdownItem>
                    <DropdownMenu.DropdownItem icon={<FeatherWallet />}>
                      Leap
                    </DropdownMenu.DropdownItem>
                    <DropdownMenu.DropdownItem icon={<FeatherWallet />}>
                      WalletConnect
                    </DropdownMenu.DropdownItem>
                  </DropdownMenu>
                </SubframeCore.DropdownMenu.Content>
              </SubframeCore.DropdownMenu.Portal>
            </SubframeCore.DropdownMenu.Root>
          </div>
        </div>
        <div className="flex w-full grow shrink-0 basis-0 flex-wrap items-start">
          <div className="flex w-64 flex-none flex-col items-start self-stretch border-r border-solid border-neutral-border px-4 py-4">
            <div className="flex w-full flex-col items-start gap-2">
              <div className="flex w-full items-center gap-4 rounded-md bg-[#28012fff] px-3 py-3">
                <IconWithBackground icon={<FeatherLayoutDashboard />} />
                <span className="grow shrink-0 basis-0 text-body-bold font-body-bold text-[#8ca1ccff]">
                  Overview
                </span>
              </div>
              <div className="flex w-full items-center gap-4 rounded-md px-3 py-3">
                <IconWithBackground icon={<FeatherSettings />} />
                <span className="grow shrink-0 basis-0 text-body font-body text-[#8ca1ccff]">
                  Agent Config
                </span>
              </div>
              <div className="flex w-full items-center gap-4 rounded-md px-3 py-3">
                <IconWithBackground icon={<FeatherTrendingUp />} />
                <span className="grow shrink-0 basis-0 text-body font-body text-[#8ca1ccff]">
                  Trades
                </span>
              </div>
              <div className="flex w-full items-center gap-4 rounded-md px-3 py-3">
                <IconWithBackground icon={<FeatherDollarSign />} />
                <span className="grow shrink-0 basis-0 text-body font-body text-[#8ca1ccff]">
                  Payments
                </span>
              </div>
              <div className="flex w-full items-center gap-4 rounded-md px-3 py-3">
                <IconWithBackground icon={<FeatherShare2 />} />
                <span className="grow shrink-0 basis-0 text-body font-body text-[#8ca1ccff]">
                  Social
                </span>
              </div>
              <div className="flex w-full items-center gap-4 rounded-md px-3 py-3">
                <IconWithBackground icon={<FeatherSettings />} />
                <span className="grow shrink-0 basis-0 text-body font-body text-[#8ca1ccff]">
                  Settings
                </span>
              </div>
            </div>
          </div>
          <div className="flex grow shrink-0 basis-0 flex-col items-start self-stretch overflow-auto">
            <Alert
              variant="brand"
              title="Connect Your Wallet"
              description="Connect your wallet to start trading with NeonTradeBot"
              actions={
                <Button
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
                >
                  Connect Now
                </Button>
              }
            />
            <div className="flex w-full flex-col items-start gap-6 px-6 py-6">
              <span className="text-heading-3 font-heading-3 text-[#00f0ffff]">
                Live Monitoring
              </span>
              <div className="flex w-full flex-wrap items-start gap-4">
                <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2 rounded-md bg-[#28012fff] px-6 py-6">
                  <span className="text-caption font-caption text-[#8ca1ccff]">
                    Active Bots
                  </span>
                  <span className="text-heading-2 font-heading-2 text-[#00f0ffff]">
                    5
                  </span>
                  <Progress value={75} />
                </div>
                <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2 rounded-md bg-[#28012fff] px-6 py-6">
                  <span className="text-caption font-caption text-[#8ca1ccff]">
                    Total Profit
                  </span>
                  <span className="text-heading-2 font-heading-2 text-[#00f0ffff]">
                    +2.45 ETH
                  </span>
                  <div className="flex items-center gap-1">
                    <FeatherArrowUpRight className="text-body font-body text-success-600" />
                    <span className="text-body font-body text-success-600">
                      12.4%
                    </span>
                  </div>
                </div>
                <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2 rounded-md bg-[#28012fff] px-6 py-6">
                  <span className="text-caption font-caption text-[#8ca1ccff]">
                    Success Rate
                  </span>
                  <span className="text-heading-2 font-heading-2 text-[#00f0ffff]">
                    98.5%
                  </span>
                  <Progress value={98} />
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col items-start gap-6 px-6 py-6">
              <span className="text-heading-3 font-heading-3 text-[#00f0ffff]">
                Recent Trades
              </span>
              <div className="flex w-full flex-col items-start gap-4">
                <div className="flex w-full items-center gap-4 rounded-md bg-[#28012fff] px-6 py-4">
                  <IconWithBackground variant="success" />
                  <div className="flex grow shrink-0 basis-0 flex-col items-start">
                    <span className="text-body-bold font-body-bold text-[#00f0ffff]">
                      ETH/USDT
                    </span>
                    <span className="text-body font-body text-[#8ca1ccff]">
                      Buy @ 2,456.78
                    </span>
                  </div>
                  <Badge variant="success">+0.45 ETH</Badge>
                </div>
                <div className="flex w-full items-center gap-4 rounded-md bg-[#28012fff] px-6 py-4">
                  <IconWithBackground variant="success" />
                  <div className="flex grow shrink-0 basis-0 flex-col items-start">
                    <span className="text-body-bold font-body-bold text-[#00f0ffff]">
                      BTC/USDT
                    </span>
                    <span className="text-body font-body text-[#8ca1ccff]">
                      Sell @ 45,678.90
                    </span>
                  </div>
                  <Badge variant="success">+0.12 BTC</Badge>
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-96 flex-none flex-col items-start self-stretch border-l border-solid border-neutral-border">
            <div className="flex w-full flex-col items-start gap-6 border-b border-solid border-neutral-border px-6 py-6">
              <ToggleGroup value="" onValueChange={(value: string) => {}}>
                <ToggleGroup.Item icon={null} value="54e97b43">
                  Buy
                </ToggleGroup.Item>
                <ToggleGroup.Item icon={null} value="e5bec36b">
                  Sell
                </ToggleGroup.Item>
              </ToggleGroup>
              <div className="flex w-full flex-col items-start gap-4">
                <TextField
                  label="Amount"
                  helpText="Enter amount to trade"
                  icon={<FeatherDollarSign />}
                >
                  <TextField.Input
                    placeholder="0.00"
                    value=""
                    onChange={(
                      event: React.ChangeEvent<HTMLInputElement>
                    ) => {}}
                  />
                </TextField>
                <TextField
                  label="Price"
                  helpText="Set your target price"
                  icon={<FeatherTag />}
                >
                  <TextField.Input
                    placeholder="0.00"
                    value=""
                    onChange={(
                      event: React.ChangeEvent<HTMLInputElement>
                    ) => {}}
                  />
                </TextField>
                <Button
                  className="h-8 w-full flex-none"
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
                >
                  Place Order
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultPageLayout>
  );
}

export default Overview;
