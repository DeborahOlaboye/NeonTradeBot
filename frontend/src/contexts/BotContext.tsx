"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface BotState {
  isRunning: boolean;
  agentId: string | null;
  status: string;
  config: any;
}

interface BotContextType {
  botState: BotState;
  startBot: (config: any) => Promise<void>;
  stopBot: () => Promise<void>;
  updateStatus: (status: string) => void;
  saveConfig: (config: any) => void;
  getSavedConfig: () => any;
}

const BotContext = createContext<BotContextType | undefined>(undefined);

export function BotProvider({ children }: { children: React.ReactNode }) {
  const [botState, setBotState] = useState<BotState>({
    isRunning: false,
    agentId: null,
    status: 'Idle',
    config: null
  });
  const [savedConfig, setSavedConfig] = useState<any>(null);

  const startBot = async (config: any) => {
    try {
      setBotState(prev => ({ ...prev, status: 'Starting...' }));
      
      // Verify authorization signature exists
      if (!config.authorization) {
        throw new Error('Bot authorization required. Please sign the authorization message.');
      }
      
      // Configure agent with authorization
      const configForBackend = {
        ...config,
        volatilityThreshold: config.volatilityThreshold / 100
      };
      await apiService.configureAgent(configForBackend);
      
      // Start agent
      const result = await apiService.startAgent('default');
      
      setBotState({
        isRunning: true,
        agentId: 'default',
        status: 'Running - Authorized to execute trades automatically...',
        config: configForBackend
      });
      
      // Listen for trade signals and execute automatically
      window.addEventListener('tradeSignal', handleTradeSignal);
    } catch (error: any) {
      setBotState(prev => ({ 
        ...prev, 
        status: `Error: ${error.message}`,
        isRunning: false 
      }));
      throw error;
    }
  };

  const stopBot = async () => {
    try {
      setBotState(prev => ({ ...prev, status: 'Stopping...' }));
      
      if (botState.agentId) {
        await apiService.stopAgent(botState.agentId);
      }
      
      setBotState({
        isRunning: false,
        agentId: null,
        status: 'Stopped',
        config: null
      });
      
      // Remove trade signal listener
      window.removeEventListener('tradeSignal', handleTradeSignal);
    } catch (error: any) {
      setBotState(prev => ({ 
        ...prev, 
        status: `Error stopping: ${error.message}` 
      }));
      throw error;
    }
  };

  const updateStatus = (status: string) => {
    setBotState(prev => ({ ...prev, status }));
  };

  const saveConfig = (config: any) => {
    setSavedConfig(config);
    localStorage.setItem('neonTradeBot_config', JSON.stringify(config));
  };

  const getSavedConfig = () => {
    return savedConfig;
  };

  const handleTradeSignal = (event: any) => {
    console.log('Trade signal received:', event.detail);
    updateStatus(`Trade signal: ${event.detail.message || 'Processing trade...'}`);
  };

  // Persist bot state and config in localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('neonTradeBot_state');
    const savedConfigData = localStorage.getItem('neonTradeBot_config');
    
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setBotState(parsed);
        
        // Re-attach event listener if bot was running
        if (parsed.isRunning) {
          window.addEventListener('tradeSignal', handleTradeSignal);
        }
      } catch (error) {
        console.error('Error loading bot state:', error);
      }
    }
    
    if (savedConfigData) {
      try {
        const parsedConfig = JSON.parse(savedConfigData);
        setSavedConfig(parsedConfig);
      } catch (error) {
        console.error('Error loading saved config:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('neonTradeBot_state', JSON.stringify(botState));
  }, [botState]);

  return (
    <BotContext.Provider value={{ botState, startBot, stopBot, updateStatus, saveConfig, getSavedConfig }}>
      {children}
    </BotContext.Provider>
  );
}

export function useBotContext() {
  const context = useContext(BotContext);
  if (context === undefined) {
    throw new Error('useBotContext must be used within a BotProvider');
  }
  return context;
}
