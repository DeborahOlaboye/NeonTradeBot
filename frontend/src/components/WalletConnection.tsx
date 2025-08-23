"use client";

import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi';
import { Button } from "@/ui/components/Button";
import { FeatherWallet, FeatherLogOut } from "@/subframe/core";

interface WalletConnectionProps {
  onConnect?: (address: string) => void;
  onDisconnect?: () => void;
}

export function WalletConnection({ onConnect, onDisconnect }: WalletConnectionProps) {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  React.useEffect(() => {
    if (isConnected && address && onConnect) {
      onConnect(address);
    } else if (!isConnected && onDisconnect) {
      onDisconnect();
    }
  }, [isConnected, address, onConnect, onDisconnect]);

  const handleDisconnect = () => {
    disconnect();
    if (onDisconnect) {
      onDisconnect();
    }
  };

  if (isConnected && address) {
    return (
      <Button
        icon={<FeatherWallet />}
        onClick={handleDisconnect}
        variant="brand-secondary"
      >
        {`${address.slice(0, 6)}...${address.slice(-4)}`}
      </Button>
    );
  }

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    onClick={openConnectModal}
                    variant="brand-primary"
                    size="large"
                    icon={<FeatherWallet />}
                  >
                    Connect Wallet
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button
                    onClick={openChainModal}
                    variant="destructive-primary"
                  >
                    Wrong network
                  </Button>
                );
              }

              return (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={openAccountModal}
                    variant="brand-secondary"
                    icon={<FeatherWallet />}
                  >
                    {account.displayName}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ''}
                  </Button>
                  
                  <Button
                    onClick={handleDisconnect}
                    variant="destructive-secondary"
                    icon={<FeatherLogOut />}
                  >
                    Disconnect
                  </Button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
