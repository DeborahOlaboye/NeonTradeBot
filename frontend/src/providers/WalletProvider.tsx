"use client";

import React from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains';
import '@rainbow-me/rainbowkit/styles.css';

// Custom Sei Network configuration
const seiTestnet = {
  id: 1328,
  name: 'Sei Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'SEI',
    symbol: 'SEI',
  },
  rpcUrls: {
    default: {
      http: ['https://evm-rpc-testnet.sei-apis.com'],
    },
    public: {
      http: ['https://evm-rpc-testnet.sei-apis.com'],
    },
  },
  blockExplorers: {
    default: { name: 'Sei Explorer', url: 'https://seitrace.com' },
  },
  testnet: true,
} as const;

const config = getDefaultConfig({
  appName: 'NeonTradeBot',
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || 'local-dev-only',
  chains: [seiTestnet],
  transports: {
    [seiTestnet.id]: http('https://evm-rpc-testnet.sei-apis.com'),
  },
});

const queryClient = new QueryClient();

interface WalletProviderProps {
  children: React.ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={{
            lightMode: {
              colors: {
                accentColor: '#C82FFF',
                accentColorForeground: '#FFFFFF',
                actionButtonBorder: '#4269aa',
                actionButtonBorderMobile: '#4269aa',
                actionButtonSecondaryBackground: '#030c36',
                closeButton: '#8ca1cc',
                closeButtonBackground: '#1a1f3a',
                connectButtonBackground: '#C82FFF',
                connectButtonBackgroundError: '#ef4444',
                connectButtonInnerBackground: '#030c36',
                connectButtonText: '#FFFFFF',
                connectButtonTextError: '#FFFFFF',
                connectionIndicator: '#00f0ff',
                downloadBottomCardBackground: '#0a0f2a',
                downloadTopCardBackground: '#1a1f3a',
                error: '#ef4444',
                generalBorder: '#4269aa',
                generalBorderDim: '#2a3f6a',
                menuItemBackground: '#1a1f3a',
                modalBackdrop: 'rgba(10, 15, 42, 0.8)',
                modalBackground: '#0a0f2a',
                modalBorder: '#4269aa',
                modalText: '#00f0ff',
                modalTextDim: '#8ca1cc',
                modalTextSecondary: '#8ca1cc',
                profileAction: '#1a1f3a',
                profileActionHover: '#2a3f6a',
                profileForeground: '#0a0f2a',
                selectedOptionBorder: '#C82FFF',
                standby: '#8ca1cc',
              },
            },
            darkMode: {
              colors: {
                accentColor: '#C82FFF',
                accentColorForeground: '#FFFFFF',
                actionButtonBorder: '#4269aa',
                actionButtonBorderMobile: '#4269aa',
                actionButtonSecondaryBackground: '#030c36',
                closeButton: '#8ca1cc',
                closeButtonBackground: '#1a1f3a',
                connectButtonBackground: '#C82FFF',
                connectButtonBackgroundError: '#ef4444',
                connectButtonInnerBackground: '#030c36',
                connectButtonText: '#FFFFFF',
                connectButtonTextError: '#FFFFFF',
                connectionIndicator: '#00f0ff',
                downloadBottomCardBackground: '#0a0f2a',
                downloadTopCardBackground: '#1a1f3a',
                error: '#ef4444',
                generalBorder: '#4269aa',
                generalBorderDim: '#2a3f6a',
                menuItemBackground: '#1a1f3a',
                modalBackdrop: 'rgba(10, 15, 42, 0.8)',
                modalBackground: '#0a0f2a',
                modalBorder: '#4269aa',
                modalText: '#00f0ff',
                modalTextDim: '#8ca1cc',
                modalTextSecondary: '#8ca1cc',
                profileAction: '#1a1f3a',
                profileActionHover: '#2a3f6a',
                profileForeground: '#0a0f2a',
                selectedOptionBorder: '#C82FFF',
                standby: '#8ca1cc',
              },
            },
          }}
          modalSize="compact"
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
