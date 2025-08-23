const axios = require('axios');
const { io } = require('socket.io-client');

const BACKEND_URL = 'http://localhost:3002';
const FRONTEND_URL = 'http://localhost:5173';

class SystemIntegrationTest {
  constructor() {
    this.socket = null;
    this.testResults = {
      backend: false,
      frontend: false,
      contract: false,
      realtime: false,
      sei: false,
      trading: false,
      crossmint: false
    };
  }

  async runAllTests() {
    console.log('Starting NeonTradeBot System Integration Tests\n');
    
    try {
      await this.testBackendHealth();
      await this.testFrontendHealth();
      await this.testContractInteraction();
      await this.testRealtimeCommunication();
      await this.testSeiIntegration();
      await this.testTradingEngine();
      await this.testCrossmintIntegration();
      
      this.printTestSummary();
    } catch (error) {
      console.error('Integration test failed:', error.message);
    } finally {
      if (this.socket) {
        this.socket.disconnect();
      }
    }
  }

  async testBackendHealth() {
    console.log('1. Testing Backend Health...');
    try {
      const response = await axios.get(`${BACKEND_URL}/api/agents/network-stats`);
      if (response.status === 200 && response.data.networkStatus === 'CONNECTED') {
        console.log('Backend: HEALTHY');
        console.log(`   - Chain ID: ${response.data.chainId}`);
        console.log(`   - Block: ${response.data.blockNumber}`);
        this.testResults.backend = true;
      }
    } catch (error) {
      console.log('Backend: FAILED');
    }
  }

  async testFrontendHealth() {
    console.log('\n2. Testing Frontend Health...');
    try {
      const response = await axios.get(FRONTEND_URL, { timeout: 5000 });
      if (response.status === 200) {
        console.log('Frontend: ACCESSIBLE');
        console.log('   - Running on port 5173');
        this.testResults.frontend = true;
      }
    } catch (error) {
      console.log('Frontend: FAILED');
    }
  }

  async testContractInteraction() {
    console.log('\n3. Testing Smart Contract Interaction...');
    try {
      const response = await axios.get(`${BACKEND_URL}/api/agents/network-stats`);
      if (response.data.contractBalance !== undefined) {
        console.log('Contract: CONNECTED');
        console.log(`   - Address: 0x7fc58f2d50790f6cddb631b4757f54b893692dde`);
        console.log(`   - Balance: ${response.data.contractBalance} SEI`);
        this.testResults.contract = true;
      }
    } catch (error) {
      console.log('Contract: FAILED');
    }
  }

  async testRealtimeCommunication() {
    console.log('\n4. Testing Real-time Communication...');
    return new Promise((resolve) => {
      try {
        this.socket = io(BACKEND_URL);
        
        this.socket.on('connect', () => {
          console.log('Socket.IO: CONNECTED');
          this.testResults.realtime = true;
          resolve();
        });

        this.socket.on('connect_error', () => {
          console.log('Socket.IO: FAILED');
          resolve();
        });

        setTimeout(() => {
          if (!this.testResults.realtime) {
            console.log('Socket.IO: TIMEOUT');
          }
          resolve();
        }, 3000);
      } catch (error) {
        console.log('Socket.IO: FAILED');
        resolve();
      }
    });
  }

  async testSeiIntegration() {
    console.log('\n5. Testing Sei Network Integration...');
    try {
      const response = await axios.get(`${BACKEND_URL}/api/agents/network-stats`);
      if (response.data.chainId === 1328 && response.data.finality) {
        console.log('Sei Network: CONNECTED');
        console.log(`   - Finality: ${response.data.finality}`);
        console.log(`   - Gas Price: ${response.data.gasPrice} gwei`);
        this.testResults.sei = true;
      }
    } catch (error) {
      console.log('Sei Network: FAILED');
    }
  }

  async testTradingEngine() {
    console.log('\n6. Testing Trading Engine...');
    try {
      const configData = {
        walletAddress: '0x1234567890123456789012345678901234567890',
        privateKey: 'test_key',
        volatilityThreshold: 5.0,
        tradingPairs: ['SEI/USDT']
      };
      
      const response = await axios.post(`${BACKEND_URL}/api/agents/configure`, configData);
      if (response.status === 200 || response.status === 201) {
        console.log('Trading Engine: CONFIGURED');
        console.log('   - Agent configuration accepted');
        this.testResults.trading = true;
      }
    } catch (error) {
      console.log('Trading Engine: FAILED');
    }
  }

  async testCrossmintIntegration() {
    console.log('\n7. Testing Crossmint Integration...');
    try {
      const response = await axios.get(`${BACKEND_URL}/api/agents/crossmint/status`);
      console.log('Crossmint: ACCESSIBLE');
      console.log('   - API endpoints available');
      this.testResults.crossmint = true;
    } catch (error) {
      console.log('Crossmint: FAILED');
    }
  }

  printTestSummary() {
    console.log('\nSYSTEM INTEGRATION TEST SUMMARY');
    console.log('=====================================');
    
    const results = [
      { name: 'Backend Server', status: this.testResults.backend },
      { name: 'Frontend UI', status: this.testResults.frontend },
      { name: 'Smart Contract', status: this.testResults.contract },
      { name: 'Real-time Comm', status: this.testResults.realtime },
      { name: 'Sei Network', status: this.testResults.sei },
      { name: 'Trading Engine', status: this.testResults.trading },
      { name: 'Crossmint API', status: this.testResults.crossmint }
    ];

    results.forEach(result => {
      const icon = result.status ? '✅' : '❌';
      const status = result.status ? 'PASS' : 'FAIL';
      console.log(`${icon} ${result.name.padEnd(15)} ${status}`);
    });

    const passCount = Object.values(this.testResults).filter(Boolean).length;
    const totalCount = Object.keys(this.testResults).length;
    
    console.log('\nOVERALL SYSTEM STATUS');
    console.log(`Tests Passed: ${passCount}/${totalCount}`);
    
    if (passCount === totalCount) {
      console.log('ALL SYSTEMS OPERATIONAL - READY FOR HACKATHON!');
    } else if (passCount >= 5) {
      console.log('MOSTLY OPERATIONAL - Minor issues detected');
    } else {
      console.log('SYSTEM ISSUES - Requires attention');
    }
  }
}

// Run the integration tests
const tester = new SystemIntegrationTest();
tester.runAllTests();
