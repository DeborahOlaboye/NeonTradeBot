"use client";

import React from "react";
import { Button } from "@/ui/components/Button";
import { DropdownMenu } from "@/ui/components/DropdownMenu";
import { IconWithBackground } from "@/ui/components/IconWithBackground";
import { DefaultPageLayout } from "@/ui/layouts/DefaultPageLayout";
import { FeatherWallet } from "@/subframe/core";
import * as SubframeCore from "@/subframe/core";
import { WalletConnection } from "./components/WalletConnection";
import "./styles/animations.css";

interface LandingPageProps {
  onConnect: (address: string) => void;
}

function LandingPage({ onConnect }: LandingPageProps) {
  return (
    <DefaultPageLayout>
      <div className="flex h-full w-full flex-col items-start bg-[#0a0f2aff]">
        <div className="flex w-full flex-col items-center justify-center gap-2 px-6 py-6 mobile:px-2 mobile:py-2">
          <div className="flex w-full max-w-[1280px] items-center justify-between">
            <img
              className="h-16 flex-none object-contain cursor-pointer hover:opacity-80 transition-opacity"
              src="/src/assets/neon-logo.png"
              alt="NeonTradeBot"
              onClick={() => window.location.href = '/'}
            />
            <div className="flex items-center gap-4">
              <WalletConnection onConnect={onConnect} />
            </div>
          </div>
        </div>
        <div className="hero-video-container flex w-full flex-col items-center justify-center gap-8 px-6 pt-40 pb-24">
          <video
            className="hero-video-background"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src="/videos/cyberpunk-bg.mp4" type="video/mp4" />
            {/* Fallback for browsers that don't support video */}
          </video>
          <div className="hero-video-overlay"></div>
          <div className="hero-content flex w-full flex-col items-center justify-center gap-8">
            <span className="max-w-[1024px] whitespace-pre-wrap font-['Montserrat'] text-[92px] font-[900] leading-[84px] text-[#00f0ffff] text-center -tracking-[0.04em] mobile:font-['Afacad_Flux'] mobile:text-[62px] mobile:font-[400] mobile:leading-[58px] mobile:tracking-normal animate-slide-in-left">
              {"NEONTRADE BOT"}
            </span>
            <span className="max-w-[576px] whitespace-pre-wrap font-['Montserrat'] text-[20px] font-[500] leading-[28px] text-[#8ca1ccff] text-center -tracking-[0.015em] animate-fade-in-up">
              {
                "Automate your crypto trading with advanced AI-powered algorithms and real-time market analysis"
              }
            </span>
            <div className="flex flex-wrap items-center justify-center gap-6 animate-fade-in-up animation-delay-300">
              <WalletConnection onConnect={onConnect} />
              <Button
                variant="neutral-tertiary"
                size="large"
                className="hover:scale-105 transition-transform duration-200"
                onClick={() => {
                  const featuresSection = document.getElementById('features-section');
                  if (featuresSection) {
                    featuresSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
        <div id="features-section" className="flex w-full flex-col items-center justify-center gap-12 px-6 py-24">
          <div className="flex w-full max-w-[1280px] flex-wrap items-center justify-center gap-6 animate-fade-in-up animation-delay-500">
            <div className="flex min-w-[240px] grow shrink-0 basis-0 flex-col items-start gap-4 rounded-[32px] bg-[#030c36ff] px-8 py-8 hover:bg-[#0a1540ff] transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#c82fff33]">
              <IconWithBackground size="x-large" icon={<FeatherWallet />} />
              <span className="text-heading-2 font-heading-2 text-[#00f0ffff]">
                Smart Trading
              </span>
              <span className="text-body font-body text-[#8ca1ccff]">
                Advanced algorithms analyze market trends and execute trades
                automatically
              </span>
            </div>
            <div className="flex min-w-[240px] grow shrink-0 basis-0 flex-col items-start gap-4 rounded-[32px] bg-[#030c36ff] px-8 py-8 hover:bg-[#0a1540ff] transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#c82fff33] animation-delay-200">
              <IconWithBackground size="x-large" icon={<FeatherWallet />} />
              <span className="text-heading-2 font-heading-2 text-[#00f0ffff]">
                Secure Platform
              </span>
              <span className="text-body font-body text-[#8ca1ccff]">
                Enterprise-grade security protecting your assets 24/7
              </span>
            </div>
            <div className="flex min-w-[240px] grow shrink-0 basis-0 flex-col items-start gap-4 rounded-[32px] bg-[#030c36ff] px-8 py-8 hover:bg-[#0a1540ff] transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#c82fff33] animation-delay-400">
              <IconWithBackground size="x-large" icon={<FeatherWallet />} />
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
            <WalletConnection onConnect={onConnect} />
          </div>
        </div>
      </div>
    </DefaultPageLayout>
  );
}

export default LandingPage;
