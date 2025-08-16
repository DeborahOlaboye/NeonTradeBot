import { useEffect, useState } from 'react';
import io from 'socket.io-client';

interface DashboardProps {
  logs: string[];
}

function Dashboard({ logs }: DashboardProps) {
  const [stats, setStats] = useState({
    totalTrades: 0,
    successRate: 0,
    totalVolume: 0,
    activeAgents: 1
  });

  // Simulate real-time stats updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        totalTrades: prev.totalTrades + Math.floor(Math.random() * 2),
        successRate: 95 + Math.floor(Math.random() * 5),
        totalVolume: prev.totalVolume + (Math.random() * 100),
        activeAgents: 1
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-cyber font-bold mb-4 neon-text">
          AGENT MONITORING
        </h2>
        <p className="font-mono text-neon-blue text-sm">
          REAL-TIME PERFORMANCE DASHBOARD
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-neon-purple to-neon-blue mx-auto mt-2"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'TOTAL TRADES', value: stats.totalTrades, suffix: '', color: 'text-neon-purple' },
          { label: 'SUCCESS RATE', value: stats.successRate, suffix: '%', color: 'text-green-400' },
          { label: 'VOLUME', value: stats.totalVolume.toFixed(2), suffix: ' SEI', color: 'text-neon-blue' },
          { label: 'ACTIVE AGENTS', value: stats.activeAgents, suffix: '', color: 'text-yellow-400' }
        ].map((stat, index) => (
          <div key={index} className="cyber-card bg-cyber-dark/50 text-center">
            <div className={`text-2xl font-cyber font-bold ${stat.color} mb-2`}>
              {stat.value}{stat.suffix}
            </div>
            <div className="text-xs font-mono text-cyber-white/60 uppercase tracking-wider">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Agent Status */}
      <div className="cyber-card">
        <h3 className="text-xl font-cyber font-bold text-neon-purple mb-6">
          AGENT STATUS
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-mono text-sm text-cyber-white/80">Network Status:</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-mono text-sm text-green-400">CONNECTED</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-mono text-sm text-cyber-white/80">Contract:</span>
              <span className="font-mono text-xs text-neon-purple">0x7fc5...2dde</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-mono text-sm text-cyber-white/80">Block Height:</span>
              <span className="font-mono text-sm text-neon-blue">192,218,036</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-mono text-sm text-cyber-white/80">Gas Price:</span>
              <span className="font-mono text-sm text-neon-blue">2.32 gwei</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-mono text-sm text-cyber-white/80">Finality:</span>
              <span className="font-mono text-sm text-green-400">&lt;400ms</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-mono text-sm text-cyber-white/80">Last Update:</span>
              <span className="font-mono text-sm text-cyber-white/60">
                {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Logs */}
      <div className="cyber-card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-cyber font-bold text-neon-blue">
            ACTIVITY LOGS
          </h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-neon-blue rounded-full animate-pulse"></div>
            <span className="font-mono text-xs text-neon-blue">LIVE</span>
          </div>
        </div>
        
        <div className="bg-cyber-dark/50 border border-neon-blue/30 rounded p-4 h-64 overflow-y-auto">
          {logs.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-neon-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="font-mono text-sm text-cyber-white/60">
                  WAITING FOR AGENT ACTIVITY...
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {logs.map((log, index) => (
                <div 
                  key={index} 
                  className="flex items-start space-x-3 font-mono text-sm animate-fade-in"
                >
                  <span className="text-neon-blue text-xs mt-0.5">▶</span>
                  <span className="text-cyber-white/90">{log}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Trading Activity Chart Placeholder */}
      <div className="cyber-card">
        <h3 className="text-xl font-cyber font-bold text-neon-purple mb-6">
          TRADING ACTIVITY
        </h3>
        <div className="bg-cyber-dark/50 border border-neon-purple/30 rounded p-8 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 border-4 border-neon-purple border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="font-mono text-sm text-cyber-white/60">
              CHART VISUALIZATION COMING SOON
            </p>
            <p className="font-mono text-xs text-cyber-white/40">
              Real-time trading data will be displayed here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;