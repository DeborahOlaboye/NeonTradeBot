import { useState } from 'react';
import Head from 'next/head';
import AgentForm from '../components/AgentForm';
import Dashboard from '../components/Dashboard';
import CrossmintIntegration from '../components/CrossmintIntegration';

export default function Home() {
  const [activeTab, setActiveTab] = useState('agent');
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (log: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${log}`]);
  };

  return (
    <>
      <Head>
        <title>NeonTradeBot - AI DeFi Agent</title>
        <meta name="description" content="Cyberpunk-styled AI agent for automated DeFi trading on Sei Network" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-neon-purple opacity-5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-blue opacity-5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8">
          {/* Header */}
          <header className="text-center mb-12">
            <h1 
              className="text-6xl md:text-8xl font-cyber font-black mb-4 glitch neon-text animate-neon-pulse"
              data-text="NEONTRADEBOT"
            >
              NEONTRADEBOT
            </h1>
            <p className="text-xl md:text-2xl font-mono text-neon-blue mb-2">
              AI-DRIVEN DEFI AGENT
            </p>
            <p className="text-sm md:text-base font-mono text-cyber-white opacity-80">
              AUTOMATED PORTFOLIO MANAGEMENT ON SEI NETWORK
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-neon-purple to-neon-blue mx-auto mt-4"></div>
          </header>

          {/* Navigation */}
          <nav className="flex justify-center mb-12">
            <div className="flex flex-wrap gap-4 p-2 bg-cyber-gray/50 rounded-lg backdrop-blur-sm neon-border">
              {[
                { id: 'agent', label: 'AGENT CONFIG', icon: '⚙️' },
                { id: 'dashboard', label: 'MONITOR', icon: '📊' },
                { id: 'crossmint', label: 'PAYMENTS', icon: '💳' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    px-6 py-3 font-cyber font-bold text-sm tracking-wider transition-all duration-300
                    ${activeTab === tab.id 
                      ? 'bg-neon-purple text-cyber-navy shadow-lg shadow-neon-purple/50' 
                      : 'text-neon-purple hover:bg-neon-purple/10'
                    }
                  `}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </nav>

          {/* Main Content */}
          <main className="max-w-6xl mx-auto">
            <div className="cyber-card">
              {activeTab === 'agent' && <AgentForm setLogs={addLog} />}
              {activeTab === 'dashboard' && <Dashboard logs={logs} />}
              {activeTab === 'crossmint' && <CrossmintIntegration setLogs={addLog} />}
            </div>
          </main>

          {/* Footer */}
          <footer className="text-center mt-16 py-8 border-t border-neon-blue/30">
            <p className="font-mono text-sm text-cyber-white/60">
              POWERED BY SEI NETWORK • SUB-400MS FINALITY
            </p>
            <div className="flex justify-center space-x-4 mt-4">
              <div className="w-2 h-2 bg-neon-purple rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-neon-blue rounded-full animate-pulse delay-300"></div>
              <div className="w-2 h-2 bg-neon-purple rounded-full animate-pulse delay-700"></div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}