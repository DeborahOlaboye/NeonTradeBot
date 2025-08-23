"use client";

import React, { useState } from "react";
import { Button } from "@/ui/components/Button";
import { DefaultPageLayout } from "@/ui/layouts/DefaultPageLayout";
import Sidebar from "./components/Sidebar";
import { CrossmintIntegration } from "./components/CrossmintIntegration";
import { WalletConnection } from "./components/WalletConnection";
import { 
  FeatherWallet,
  FeatherCreditCard,
  FeatherDollarSign,
  FeatherCalendar,
  FeatherFileText
} from "@/subframe/core";

interface PaymentsProps {
  walletAddress: string;
  onDisconnect: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

function Payments({ walletAddress, onDisconnect, onNavigate, currentPage }: PaymentsProps) {
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, name: "Credit Card", description: "Manage your credit cards and payment options", action: "Manage" },
    { id: 2, name: "Billing History", description: "View past invoices and payments", action: "View History" },
    { id: 3, name: "Subscription", description: "Manage your subscription plan", action: "Manage Plan" }
  ]);

  const handlePaymentAction = (id: number, action: string) => {
    console.log(`Payment action: ${action} for method ${id}`);
    // Add actual payment logic here
  };

  return (
    <DefaultPageLayout>
      <div className="container max-w-none flex h-full w-full flex-col items-start bg-[#0a0f2aff]">
        <div className="flex w-full items-center gap-4 border-b border-solid border-neutral-border px-6 py-6">
          <img
            className="h-20 flex-none object-contain cursor-pointer hover:opacity-80 transition-opacity"
            src="/neon-logo.png"
            alt="NeonTradeBot"
            onClick={() => window.location.href = '/'}
          />
          <span className="grow shrink-0 basis-0 text-heading-2 font-heading-2 text-[#00f0ffff]">
            Payments
          </span>
          <div className="flex items-center gap-4">
            <WalletConnection onDisconnect={onDisconnect} />
          </div>
        </div>
        
        <div className="flex w-full flex-col items-center justify-center gap-8 px-6 pt-8">
          <Sidebar currentPage={currentPage} onNavigate={onNavigate} />
        </div>
        
        <div className="flex w-full flex-col items-start px-6 py-6 gap-8">
          {/* Crossmint Integration - Primary Payment System */}
          <CrossmintIntegration />
          
          {/* Traditional Payment Options */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paymentMethods.map((method) => {
              const IconComponent = method.name === "Credit Card" ? FeatherCreditCard : 
                                 method.name === "Billing History" ? FeatherFileText : FeatherCalendar;
              
              return (
                <div key={method.id} className="bg-[#1a1f3aff] rounded-lg p-6 hover:bg-[#252a4aff] transition-colors cursor-pointer"
                     onClick={() => handlePaymentAction(method.id, method.action)}>
                  <IconComponent className="mb-4 text-[#00f0ffff] w-8 h-8" />
                  <h3 className="text-xl font-bold text-white mb-2">{method.name}</h3>
                  <p className="text-[#8ca1ccff] mb-4">{method.description}</p>
                  <Button 
                    variant="brand-secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePaymentAction(method.id, method.action);
                    }}
                  >
                    {method.action}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DefaultPageLayout>
  );
}

export default Payments;
