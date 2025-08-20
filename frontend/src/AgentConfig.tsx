"use client";

import React from "react";
import { Alert } from "@/ui/components/Alert";
import { Button } from "@/ui/components/Button";
import { DropdownMenu } from "@/ui/components/DropdownMenu";
import { IconButton } from "@/ui/components/IconButton";
import { IconWithBackground } from "@/ui/components/IconWithBackground";
import { Tabs } from "@/ui/components/Tabs";
import { TextField } from "@/ui/components/TextField";
import { DefaultPageLayout } from "@/ui/layouts/DefaultPageLayout";
import { FeatherSearch } from "@/subframe/core";
import { FeatherWallet } from "@/subframe/core";
import { FeatherX } from "@/subframe/core";
import { FeatherTrendingUp } from "@/subframe/core";
import { FeatherCheck } from "@/subframe/core";
import * as SubframeCore from "@/subframe/core";
import { FeatherChevronDown } from "@/subframe/core";
import { FeatherPlay } from "@/subframe/core";
import { FeatherPause } from "@/subframe/core";

function CryptoDashboard() {
  return (
    <DefaultPageLayout>
      <div className="container max-w-none flex h-full w-full flex-col items-start bg-[#0a0f2aff]">
        <div className="flex w-full items-center gap-4 border-b border-solid border-neutral-border px-6 py-6">
          <span className="grow shrink-0 basis-0 text-heading-2 font-heading-2 text-[#00f0ffff]">
            Agent Configuration
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
            <Button
              icon={<FeatherWallet />}
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
            >
              0x1234...5678
            </Button>
          </div>
        </div>
        <div className="flex w-full items-center gap-4 border-b border-solid border-neutral-border px-6 py-4">
          <Tabs>
            <Tabs.Item>Overview</Tabs.Item>
            <Tabs.Item active={true}>Agent Config</Tabs.Item>
            <Tabs.Item>Trades</Tabs.Item>
            <Tabs.Item>Payments</Tabs.Item>
            <Tabs.Item>Social</Tabs.Item>
            <Tabs.Item>Settings</Tabs.Item>
          </Tabs>
        </div>
        <div className="flex w-full grow shrink-0 basis-0 flex-wrap items-start">
          <div className="flex grow shrink-0 basis-0 flex-col items-start self-stretch overflow-auto">
            <div className="flex w-full flex-col items-start gap-6 px-6 py-6">
              <Alert
                variant="brand"
                title="Configure Your Trading Bot"
                description="Set up your trading parameters carefully. These settings will determine how your bot operates in the market."
                actions={
                  <IconButton
                    size="medium"
                    icon={<FeatherX />}
                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
                  />
                }
              />
              <div className="flex w-full flex-col items-start gap-6 rounded-md border border-solid border-[#4269aaff] bg-[#030c36ff] px-6 py-6">
                <div className="flex w-full flex-col items-start gap-4">
                  <TextField
                    label="Wallet Address"
                    helpText="Enter the wallet address for trading"
                    icon={<FeatherWallet />}
                  >
                    <TextField.Input
                      placeholder="0x..."
                      value=""
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {}}
                    />
                  </TextField>
                  <TextField
                    label="Volatility Threshold"
                    helpText="Set your preferred volatility threshold (1-100)"
                    icon={<FeatherTrendingUp />}
                  >
                    <TextField.Input
                      placeholder="Enter threshold value"
                      value=""
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {}}
                    />
                  </TextField>
                  <div className="flex w-full flex-col items-start gap-2">
                    <span className="text-body-bold font-body-bold text-[#8ca1ccff]">
                      Select Token
                    </span>
                    <Button
                      variant="neutral-primary"
                      iconRight={<FeatherChevronDown />}
                      onClick={(
                        event: React.MouseEvent<HTMLButtonElement>
                      ) => {}}
                    >
                      ETH
                    </Button>
                  </div>
                </div>
                <Button
                  className="h-10 w-full flex-none"
                  size="large"
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
                >
                  Save Configuration
                </Button>
              </div>
            </div>
          </div>
          <div className="flex w-96 flex-none flex-col items-start self-stretch border-l border-solid border-neutral-border">
            <div className="flex w-full flex-col items-start gap-6 border-b border-solid border-neutral-border px-6 py-6">
              <span className="text-heading-3 font-heading-3 text-[#8ca1ccff]">
                Quick Actions
              </span>
              <div className="flex w-full flex-col items-start gap-4">
                <div className="flex w-full items-center gap-4">
                  <IconWithBackground icon={<FeatherPlay />} />
                  <span className="grow shrink-0 basis-0 text-body-bold font-body-bold text-[#00f0ffff]">
                    Start Bot
                  </span>
                </div>
                <div className="flex w-full items-center gap-4">
                  <IconWithBackground
                    variant="success"
                    icon={<FeatherPlay />}
                  />
                  <span className="grow shrink-0 basis-0 text-body-bold font-body-bold text-[#8ca1ccff]">
                    Pause Bot
                  </span>
                </div>
                <div className="flex w-full items-center gap-4">
                  <IconWithBackground variant="error" />
                  <span className="grow shrink-0 basis-0 text-body-bold font-body-bold text-[#8ca1ccff]">
                    Stop Bot
                  </span>
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
