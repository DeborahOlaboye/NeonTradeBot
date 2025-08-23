"use client";

import React, { useState } from "react";
import { Button } from "@/ui/components/Button";
import { TextField } from "@/ui/components/TextField";
import { Alert } from "@/ui/components/Alert";
import { Badge } from "@/ui/components/Badge";
import { FeatherCreditCard, FeatherWallet, FeatherDollarSign } from "@/subframe/core";

interface CrossmintIntegrationProps {
  onLog?: (message: string) => void;
}

export function CrossmintIntegration({ onLog }: CrossmintIntegrationProps) {
  const [walletEmail, setWalletEmail] = useState("");
  const [nftRecipient, setNftRecipient] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>("");

  const logMessage = (message: string) => {
    console.log(message);
    if (onLog) onLog(message);
    setStatus(message);
  };

  const createWallet = async () => {
    if (!walletEmail) {
      logMessage("Please enter an email address");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://neontradebot.onrender.com/api/agents/crossmint/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: walletEmail, type: "ethereum" }),
      });

      const result = await response.json();
      if (response.ok) {
        logMessage(`✅ Wallet created: ${result.address || "Success"}`);
      } else {
        logMessage(`❌ Wallet creation failed: ${result.error}`);
      }
    } catch (error) {
      logMessage(`❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const createCheckout = async () => {
    if (!nftRecipient || !paymentAmount) {
      logMessage("Please fill in recipient and amount");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://neontradebot.onrender.com/api/agents/crossmint/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: nftRecipient,
          collectionId: "neon-trade-rewards",
          price: paymentAmount,
          currency: "ETH",
        }),
      });

      const result = await response.json();
      if (response.ok) {
        logMessage(`✅ Checkout session created: ${result.id || "Success"}`);
        if (result.checkoutURL) {
          window.open(result.checkoutURL, "_blank");
        }
      } else {
        logMessage(`❌ Checkout failed: ${result.error}`);
      }
    } catch (error) {
      logMessage(`❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const mintNFT = async () => {
    if (!nftRecipient) {
      logMessage("Please enter recipient address");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://neontradebot.onrender.com/api/agents/crossmint/mint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: nftRecipient,
          collectionId: "neon-trade-rewards",
          metadata: {
            name: "NeonTradeBot Achievement",
            description: "Trading milestone achievement NFT",
            image: "https://example.com/nft-image.png",
          },
        }),
      });

      const result = await response.json();
      if (response.ok) {
        logMessage(`✅ NFT minted: ${result.tokenId || "Success"}`);
      } else {
        logMessage(`❌ NFT minting failed: ${result.error}`);
      }
    } catch (error) {
      logMessage(`❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col items-start gap-6 rounded-md border border-solid border-[#4269aaff] bg-[#030c36ff] px-6 py-6">
      <div className="flex w-full items-center gap-3">
        <FeatherCreditCard className="text-[#c82fff]" size={24} />
        <span className="text-heading-3 font-heading-3 text-[#00f0ffff]">
          Crossmint Integration
        </span>
        <Badge variant="brand">Production</Badge>
      </div>

      {status && (
        <Alert
          variant={status.includes("✅") ? "success" : "error"}
          title="Status"
          description={status}
        />
      )}

      {/* Wallet Creation */}
      <div className="flex w-full flex-col gap-3">
        <span className="text-body-bold font-body-bold text-[#8ca1ccff]">
          Create Custodial Wallet
        </span>
        <div className="flex w-full gap-3">
          <TextField
            variant="filled"
            label=""
            helpText=""
            className="flex-1"
          >
            <TextField.Input
              placeholder="user@example.com"
              value={walletEmail}
              onChange={(e) => setWalletEmail(e.target.value)}
            />
          </TextField>
          <Button
            variant="brand-primary"
            icon={<FeatherWallet />}
            onClick={createWallet}
            disabled={loading}
          >
            Create Wallet
          </Button>
        </div>
      </div>

      {/* Payment Processing */}
      <div className="flex w-full flex-col gap-3">
        <span className="text-body-bold font-body-bold text-[#8ca1ccff]">
          Payment & NFT Operations
        </span>
        <div className="flex w-full gap-3">
          <TextField
            variant="filled"
            label=""
            helpText=""
            className="flex-1"
          >
            <TextField.Input
              placeholder="0x7E3b...8F9d (recipient address)"
              value={nftRecipient}
              onChange={(e) => setNftRecipient(e.target.value)}
            />
          </TextField>
          <TextField
            variant="filled"
            label=""
            helpText=""
            className="w-32"
          >
            <TextField.Input
              placeholder="0.01"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
            />
          </TextField>
        </div>
        <div className="flex gap-3">
          <Button
            variant="brand-secondary"
            icon={<FeatherDollarSign />}
            onClick={createCheckout}
            disabled={loading}
          >
            Create Checkout
          </Button>
          <Button
            variant="brand-secondary"
            onClick={mintNFT}
            disabled={loading}
          >
            Mint NFT
          </Button>
        </div>
      </div>

      <div className="flex w-full items-center justify-between rounded-md bg-[#0a0f2a] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-[#00f0ff]"></div>
          <span className="text-caption font-caption text-[#8ca1ccff]">
            Connected to Crossmint Production API
          </span>
        </div>
        <span className="text-caption font-caption text-[#00f0ff]">
          {loading ? "Processing..." : "Ready"}
        </span>
      </div>
    </div>
  );
}
