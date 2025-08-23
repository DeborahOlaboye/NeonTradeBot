"use client";

import React from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { injectedWallet, metaMaskWallet, walletConnectWallet } from '@rainbow-me/rainbowkit/wallets';
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

// Configure connectors without Coinbase Wallet to avoid analytics
const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [
        injectedWallet,
        metaMaskWallet,
        walletConnectWallet,
      ],
    },
  ],
  {
    appName: 'NeonTradeBot',
    projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || '2f05a7cec426b851bb134bb803a25654',
  }
);

const config = createConfig({
  connectors,
  chains: [seiTestnet],
  transports: {
    [seiTestnet.id]: http('https://evm-rpc-testnet.sei-apis.com'),
  },
  ssr: false,
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
          })}
          modalSize="compact"
          showRecentTransactions={true}
          coolMode={false}
          appInfo={{
            appName: 'NeonTradeBot',
            disclaimer: undefined,
            learnMoreUrl: undefined,
          }}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
