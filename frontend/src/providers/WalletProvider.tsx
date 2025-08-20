"use client";

import React from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
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
          theme={darkTheme({
            accentColor: '#C82FFF',
            accentColorForeground: '#FFFFFF',
            borderRadius: 'medium',
            fontStack: 'system',
            overlayBlur: 'small',
          })}
          modalSize="compact"
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
