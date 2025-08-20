"use client";

import React from "react";
import { Button } from "@/ui/components/Button";
import { DropdownMenu } from "@/ui/components/DropdownMenu";
import { IconWithBackground } from "@/ui/components/IconWithBackground";
import { DefaultPageLayout } from "@/ui/layouts/DefaultPageLayout";
import { FeatherWallet } from "@/subframe/core";
import * as SubframeCore from "@/subframe/core";
import { FeatherTrendingUp } from "@/subframe/core";
import { FeatherShield } from "@/subframe/core";
import { FeatherZap } from "@/subframe/core";

interface LandingPageProps {
  onConnectWallet: () => void;
}

function LandingPage({ onConnectWallet }: LandingPageProps) {
  return (
    <DefaultPageLayout>
      <div className="flex h-full w-full flex-col items-start bg-[#0a0f2aff]">
        <div className="flex w-full flex-col items-center justify-center gap-2 px-6 py-6 mobile:px-2 mobile:py-2">
          <div className="flex w-full max-w-[1280px] items-center justify-between">
            <img
              className="h-10 flex-none object-contain"
              src="/src/assets/neon-logo.svg"
              alt="NeonTradeBot"
            />
            <div className="flex items-center gap-4">
              <SubframeCore.DropdownMenu.Root>
                <SubframeCore.DropdownMenu.Trigger asChild={true}>
                  <Button
                    icon={<FeatherWallet />}
                    onClick={onConnectWallet}
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
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-8 px-6 pt-40 pb-24">
          <span className="max-w-[1024px] whitespace-pre-wrap font-['Montserrat'] text-[92px] font-[900] leading-[84px] text-[#00f0ffff] text-center -tracking-[0.04em] mobile:font-['Afacad_Flux'] mobile:text-[62px] mobile:font-[400] mobile:leading-[58px] mobile:tracking-normal">
            {"NEONTRADE BOT"}
          </span>
          <span className="max-w-[576px] whitespace-pre-wrap font-['Montserrat'] text-[20px] font-[500] leading-[28px] text-[#8ca1ccff] text-center -tracking-[0.015em]">
            {
              "Automate your crypto trading with advanced AI-powered algorithms and real-time market analysis"
            }
          </span>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Button
              size="large"
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
            >
              Start Trading
            </Button>
            <Button
              variant="neutral-tertiary"
              size="large"
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
            >
              Learn More
            </Button>
          </div>
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-12 px-6 py-24">
          <div className="flex w-full max-w-[1280px] flex-wrap items-center justify-center gap-6">
            <div className="flex min-w-[240px] grow shrink-0 basis-0 flex-col items-start gap-4 rounded-[32px] bg-[#030c36ff] px-8 py-8">
              <IconWithBackground size="x-large" icon={<FeatherTrendingUp />} />
              <span className="text-heading-2 font-heading-2 text-[#00f0ffff]">
                Smart Trading
              </span>
              <span className="text-body font-body text-[#8ca1ccff]">
                Advanced algorithms analyze market trends and execute trades
                automatically
              </span>
            </div>
            <div className="flex min-w-[240px] grow shrink-0 basis-0 flex-col items-start gap-4 rounded-[32px] bg-[#030c36ff] px-8 py-8">
              <IconWithBackground size="x-large" icon={<FeatherShield />} />
              <span className="text-heading-2 font-heading-2 text-[#00f0ffff]">
                Secure Platform
              </span>
              <span className="text-body font-body text-[#8ca1ccff]">
                Enterprise-grade security protecting your assets 24/7
              </span>
            </div>
            <div className="flex min-w-[240px] grow shrink-0 basis-0 flex-col items-start gap-4 rounded-[32px] bg-[#030c36ff] px-8 py-8">
              <IconWithBackground size="x-large" icon={<FeatherZap />} />
              <span className="text-heading-2 font-heading-2 text-[#00f0ffff]">
                Lightning Fast
              </span>
              <span className="text-body font-body text-[#8ca1ccff]">
                Execute trades at millisecond speeds with our optimized
                infrastructure
              </span>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-12 px-6 py-24">
          <div className="flex w-full max-w-[1280px] flex-col items-center justify-center gap-8 rounded-[32px] bg-[#030c36ff] px-6 pt-24 pb-16">
            <div className="flex w-full flex-col items-center justify-center gap-2">
              <span className="w-full max-w-[768px] whitespace-pre-wrap font-['Montserrat'] text-[72px] font-[900] leading-[68px] text-[#00f0ffff] text-center -tracking-[0.04em] mobile:font-['Afacad_Flux'] mobile:text-[48px] mobile:font-[400] mobile:leading-[44px] mobile:tracking-normal">
                {"START TRADING NOW"}
              </span>
              <span className="w-full max-w-[768px] whitespace-pre-wrap font-['Montserrat'] text-[20px] font-[500] leading-[28px] text-[#8ca1ccff] text-center -tracking-[0.015em]">
                {
                  "Connect your wallet and experience the future of automated trading"
                }
              </span>
            </div>
            <Button
              size="large"
              onClick={onConnectWallet}
            >
              Connect Wallet
            </Button>
          </div>
        </div>
      </div>
    </DefaultPageLayout>
  );
}

export default LandingPage;
