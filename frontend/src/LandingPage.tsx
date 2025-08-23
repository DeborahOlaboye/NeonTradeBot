"use client";

import React from "react";
import { Button } from "@/ui/components/Button";
import { DropdownMenu } from "@/ui/components/DropdownMenu";
import { IconWithBackground } from "@/ui/components/IconWithBackground";
import { DefaultPageLayout } from "@/ui/layouts/DefaultPageLayout";
import { WalletConnection } from "./components/WalletConnection";
// Using simple div icons instead of @subframe/core
const FeatherShield = () => <div className="w-6 h-6 text-[#00F0FF]">🛡️</div>;
const FeatherTrendingUp = () => <div className="w-6 h-6 text-[#00F0FF]">📈</div>;
const FeatherZap = () => <div className="w-6 h-6 text-[#00F0FF]">⚡</div>;
const FeatherWallet = () => <div className="w-6 h-6 text-[#00F0FF]">💰</div>;

interface LandingPageProps {
  onConnect: (address: string) => void;
}

function LandingPage({ onConnect }: LandingPageProps) {
  return (
    <DefaultPageLayout>
      <div className="flex h-full w-full flex-col items-start overflow-hidden bg-gradient-to-br from-[#0a0f2a] via-[#2a0f4a] to-[#4a0f6a] relative">
        <div className="flex items-start @keyframes pulse absolute inset-0 bg-gradient-to-r from-[#c82fff]/10 via-[#00f0ff]/10 to-[#ca4e98]/10 animate-pulse" />
        <div className="flex w-full grow shrink-0 basis-0 items-start absolute top-0 left-0">
          <div className="flex h-96 w-96 flex-none items-start rounded-full bg-[#c82fffff] @keyframes bounce absolute top-1/4 left-1/3 blur-3xl animate-bounce" />
          <div className="flex h-80 w-80 flex-none items-start rounded-full bg-[#00f0ffff] @keyframes pulse absolute bottom-1/3 right-1/4 blur-3xl animate-pulse" />
          <div className="flex h-64 w-64 flex-none items-start rounded-full @keyframes ping absolute top-1/2 left-1/4 blur-2xl animate-ping" />
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-2 px-6 py-6 relative z-10 mobile:px-2 mobile:py-2">
          <div className="flex w-full max-w-[1280px] items-center justify-between">
            <img
              className="h-20 flex-none object-contain cursor-pointer hover:opacity-80 transition-opacity"
              src="/neon-logo.png"
              alt="NeonTradeBot"
              onClick={() => window.location.href = '/'}
            />
            <div className="flex items-center gap-4">
              <WalletConnection onConnect={onConnect} />
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-8 overflow-hidden px-6 pt-40 pb-24 relative z-10">
          <span className="max-w-[1024px] whitespace-pre-wrap font-['Montserrat'] text-[92px] font-[900] leading-[84px] text-white text-center @keyframes pulse -tracking-[0.04em] drop-shadow-[0_0_40px_rgba(0,240,255,1)] animate-pulse mobile:font-['Afacad_Flux'] mobile:text-[62px] mobile:font-[400] mobile:leading-[58px] mobile:tracking-normal">
            {"NEONTRADE BOT"}
          </span>
          <span className="max-w-[576px] whitespace-pre-wrap font-['Montserrat'] text-[20px] font-[500] leading-[28px] text-white text-center -tracking-[0.015em]">
            {
              "Automate your crypto trading with advanced AI-powered algorithms and real-time market analysis"
            }
          </span>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Button
              className="hover:scale-105 hover:shadow-[0_0_35px_rgba(0,240,255,0.7)] border-2 border-[#c82fff] bg-gradient-to-r from-[#c82fff]/20 to-[#00f0ff]/20 shadow-[0_0_25px_rgba(200,47,255,0.6)] text-white transition-all duration-300"
              variant="neutral-tertiary"
              size="large"
              onClick={() => {window.location.href = 'https://github.com/DeborahOlaboye/NeonTradeBot/blob/main/README.md'}}
            >
              📚 Documentation
            </Button>
            <Button
              className="hover:scale-105 hover:shadow-[0_0_35px_rgba(200,47,255,0.7)] border-2 border-[#00f0ff] bg-gradient-to-r from-[#00f0ff]/20 to-[#c82fff]/20 shadow-[0_0_25px_rgba(0,240,255,0.6)] text-white transition-all duration-300"
              variant="neutral-tertiary"
              size="large"
              onClick={() => {
                const configSection = document.getElementById('config-section');
                if (configSection) {
                  configSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              🚀 Try Demo
            </Button>
          </div>
        </div>
        <div id="features-section" className="flex w-full flex-col items-center justify-center gap-12 px-6 py-24 relative z-10">
          <div className="flex w-full max-w-[1280px] flex-col items-center gap-8 mb-12">
            <span className="text-[48px] font-[900] text-white text-center drop-shadow-[0_0_30px_rgba(200,47,255,0.8)]">
              Sei Network Exclusive
            </span>
            <span className="max-w-[768px] text-[18px] font-[500] text-[#8ca1cc] text-center">
              Built exclusively for Sei's sub-400ms finality, leveraging Sei MCP for analytics and Crossmint GOAT SDK for seamless agent-to-agent payments
            </span>
          </div>
          <div className="flex w-full max-w-[1280px] flex-wrap items-center justify-center gap-6">
            <div className="flex min-w-[280px] grow shrink-0 basis-0 flex-col items-start gap-4 rounded-[32px] px-8 py-8 hover:scale-105 hover:shadow-[0_0_40px_rgba(0,240,255,0.6)] bg-gradient-to-br from-[#1a0f3a] via-[#2a1f4a] to-[#3a2f5a] border-2 border-[#c82fff]/50 transition-all duration-300">
              <IconWithBackground
                className="shadow-[0_0_25px_rgba(0,240,255,0.8)] border-2 border-[#00f0ff]/30"
                size="x-large"
                icon={<FeatherTrendingUp />}
              />
              <span className="text-heading-2 font-heading-2 text-white drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]">
                AI-Driven Automation
              </span>
              <span className="text-body font-body text-[#8ca1cc]">
                Monitor wallet activity for meme coin inflows and execute trades based on volatility thresholds with sub-second execution
              </span>
            </div>
            <div className="flex min-w-[280px] grow shrink-0 basis-0 flex-col items-start gap-4 rounded-[32px] px-8 py-8 hover:scale-105 hover:shadow-[0_0_40px_rgba(200,47,255,0.6)] bg-gradient-to-br from-[#2a1f4a] via-[#3a2f5a] to-[#1a0f3a] border-2 border-[#00f0ff]/50 transition-all duration-300">
              <IconWithBackground
                className="shadow-[0_0_25px_rgba(200,47,255,0.8)] border-2 border-[#c82fff]/30"
                variant="success"
                size="x-large"
                icon={<FeatherShield />}
              />
              <span className="text-heading-2 font-heading-2 text-white drop-shadow-[0_0_10px_rgba(200,47,255,0.8)]">
                Sei MCP Analytics
              </span>
              <span className="text-body font-body text-[#8ca1cc]">
                Real-time on-chain analytics using Sei MCP for wallet monitoring, volatility calculation, and trade triggering
              </span>
            </div>
            <div className="flex min-w-[280px] grow shrink-0 basis-0 flex-col items-start gap-4 rounded-[32px] px-8 py-8 hover:scale-105 hover:shadow-[0_0_40px_rgba(202,78,152,0.6)] bg-gradient-to-br from-[#3a2f5a] via-[#1a0f3a] to-[#2a1f4a] border-2 border-[#ca4e98]/50 transition-all duration-300">
              <IconWithBackground
                className="shadow-[0_0_25px_rgba(202,78,152,0.8)] border-2 border-[#ca4e98]/30"
                variant="warning"
                size="x-large"
                icon={<FeatherWallet />}
              />
              <span className="text-heading-2 font-heading-2 text-white drop-shadow-[0_0_10px_rgba(202,78,152,0.8)]">
                Crossmint Payments
              </span>
              <span className="text-body font-body text-[#8ca1cc]">
                Seamless agent-to-agent payments using Crossmint GOAT SDK for automated settlement and fee processing
              </span>
            </div>
          </div>
        </div>
        
        {/* Agent Configuration Preview Section */}
        <div id="config-section" className="flex w-full flex-col items-center justify-center gap-12 px-6 py-24 relative z-10">
          <div className="flex w-full max-w-[1280px] flex-col items-center gap-8">
            <span className="text-[48px] font-[900] text-white text-center drop-shadow-[0_0_30px_rgba(0,240,255,0.8)]">
              Configure Your AI Agent
            </span>
            <span className="max-w-[768px] text-[18px] font-[500] text-[#8ca1cc] text-center">
              Set up automated trading with intuitive controls and real-time monitoring
            </span>
          </div>
          
          <div className="flex w-full max-w-[1280px] flex-wrap items-start justify-center gap-8">
            {/* Configuration Panel */}
            <div className="flex min-w-[400px] flex-1 flex-col gap-6 rounded-[24px] p-8 bg-gradient-to-br from-[#1a0f3a] via-[#2a1f4a] to-[#3a2f5a] border-2 border-[#c82fff]/50 shadow-[0_0_40px_rgba(200,47,255,0.3)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-[#00f0ff] animate-pulse shadow-[0_0_10px_rgba(0,240,255,0.8)]"></div>
                <span className="text-[24px] font-[700] text-white drop-shadow-[0_0_10px_rgba(0,240,255,0.6)]">
                  Agent Setup
                </span>
              </div>
              
              <div className="space-y-4">
                <div className="group">
                  <label className="block text-[#00f0ff] text-sm font-medium mb-2">Wallet Address</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="0x..." 
                      className="w-full px-4 py-3 bg-[#0a0f2a] border-2 border-[#4269aa]/50 rounded-lg text-white placeholder-[#8ca1cc] focus:border-[#00f0ff] focus:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all duration-300"
                      readOnly
                      value="0x7fc5...2dde"
                    />
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#c82fff]/10 to-[#00f0ff]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>
                
                <div className="group">
                  <label className="block text-[#c82fff] text-sm font-medium mb-2">Volatility Threshold (%)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      placeholder="5.0" 
                      className="w-full px-4 py-3 bg-[#0a0f2a] border-2 border-[#4269aa]/50 rounded-lg text-white placeholder-[#8ca1cc] focus:border-[#c82fff] focus:shadow-[0_0_20px_rgba(200,47,255,0.4)] transition-all duration-300"
                      readOnly
                      value="8.5"
                    />
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#c82fff]/10 to-[#00f0ff]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>
                
                <div className="group">
                  <label className="block text-[#ca4e98] text-sm font-medium mb-2">Max Trade Amount (USD)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      placeholder="1000" 
                      className="w-full px-4 py-3 bg-[#0a0f2a] border-2 border-[#4269aa]/50 rounded-lg text-white placeholder-[#8ca1cc] focus:border-[#ca4e98] focus:shadow-[0_0_20px_rgba(202,78,152,0.4)] transition-all duration-300"
                      readOnly
                      value="500"
                    />
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#c82fff]/10 to-[#00f0ff]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>
                
                <button className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-[#c82fff] to-[#00f0ff] text-white font-[600] rounded-lg hover:scale-105 hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] transition-all duration-300 cursor-pointer">
                  🚀 Deploy Agent
                </button>
              </div>
            </div>
            
            {/* Live Monitoring Panel */}
            <div className="flex min-w-[400px] flex-1 flex-col gap-6 rounded-[24px] p-8 bg-gradient-to-br from-[#0a0f2a] via-[#1a1f3a] to-[#2a2f4a] border-2 border-[#00f0ff]/50 shadow-[0_0_40px_rgba(0,240,255,0.3)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-[#c82fff] animate-pulse shadow-[0_0_10px_rgba(200,47,255,0.8)]"></div>
                <span className="text-[24px] font-[700] text-white drop-shadow-[0_0_10px_rgba(200,47,255,0.6)]">
                  Live Monitoring
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-[#1a0f3a]/50 rounded-lg border border-[#00f0ff]/20">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  <span className="text-green-400 text-sm font-mono">✅ Agent ACTIVE - Monitoring 4 pairs</span>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-[#2a1f4a]/50 rounded-lg border border-[#c82fff]/20">
                  <div className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse"></div>
                  <span className="text-[#00f0ff] text-sm font-mono">📊 SEI/USDT volatility: 12.3% (above threshold)</span>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-[#3a2f5a]/50 rounded-lg border border-[#ca4e98]/20">
                  <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
                  <span className="text-yellow-400 text-sm font-mono">⚡ Trade triggered: 1000 SEI → USDT</span>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-[#1a0f3a]/50 rounded-lg border border-green-500/20">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  <span className="text-green-400 text-sm font-mono">💰 Trade executed: TX 0xabc123...def456</span>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-[#2a1f4a]/50 rounded-lg border border-[#00f0ff]/20">
                  <div className="w-2 h-2 rounded-full bg-[#c82fff] animate-pulse"></div>
                  <span className="text-[#c82fff] text-sm font-mono">🔄 Crossmint payment settled: $450.23</span>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-gradient-to-r from-[#1a0f3a] to-[#2a1f4a] rounded-lg border border-[#4269aa]/30">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[#8ca1cc] text-sm">Network Status</span>
                  <span className="text-green-400 text-sm font-medium">Sei Testnet ✅</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#8ca1cc] text-sm">Finality</span>
                  <span className="text-[#00f0ff] text-sm font-medium">&lt;400ms ⚡</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex w-full flex-col items-center justify-center gap-12 px-6 py-24 relative z-10">
          <div className="flex w-full max-w-[1280px] flex-col items-center justify-center gap-8 overflow-hidden rounded-[32px] px-6 pt-24 pb-16 shadow-[0px_0px_60px_0px_#c82fff80] bg-gradient-to-br from-[#1a0f3a] via-[#3a2f5a] to-[#4a3f6a] border-4 border-[#c82fff]/60 relative">
            <div className="flex items-start @keyframes pulse absolute inset-0 bg-gradient-to-r animate-pulse" />
            <div className="flex w-full flex-col items-center justify-center gap-2 relative z-10">
              <span className="w-full max-w-[768px] whitespace-pre-wrap font-['Montserrat'] text-[72px] font-[900] leading-[68px] text-white text-center @keyframes pulse -tracking-[0.04em] drop-shadow-[0_0_50px_rgba(0,240,255,1)] animate-pulse mobile:font-['Afacad_Flux'] mobile:text-[48px] mobile:font-[400] mobile:leading-[44px] mobile:tracking-normal">
                {"START TRADING NOW"}
              </span>
              <span className="w-full max-w-[768px] whitespace-pre-wrap font-['Montserrat'] text-[20px] font-[500] leading-[28px] text-white text-center -tracking-[0.015em]">
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