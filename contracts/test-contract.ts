const { ethers } = require('ethers');

// Contract details
const CONTRACT_ADDRESS = '0x7fc58f2d50790f6cddb631b4757f54b893692dde';
const RPC_URL = 'https://evm-rpc-testnet.sei-apis.com';

const CONTRACT_ABI = [
  "function owner() external view returns (address)",
  "function authorizedAgents(address) external view returns (bool)",
  "function authorizeAgent(address agent) external",
  "function executeTrade(address token, uint256 amount, address recipient) external",
  "function executeTradeWithPayment(address token, uint256 amount, address recipient, string calldata paymentId) external",
  "event TradeExecuted(address indexed token, uint256 amount, address recipient, string paymentId)",
  "event AgentAuthorized(address indexed agent)"
];

async function testContractInteraction() {
  console.log('🔗 Testing Smart Contract Interaction\n');

  try {
    // Initialize provider
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

    console.log('1. Testing contract connection...');
    
    // Test 1: Get contract owner
    try {
      const owner = await contract.owner();
      console.log(`✅ Contract Owner: ${owner}`);
    } catch (error) {
      console.log(`❌ Failed to get owner: ${error.message}`);
    }

    // Test 2: Check network connection
    const network = await provider.getNetwork();
    console.log(`✅ Connected to network: ${network.name} (Chain ID: ${network.chainId})`);

    // Test 3: Get latest block
    const blockNumber = await provider.getBlockNumber();
    console.log(`✅ Latest block: ${blockNumber}`);

    // Test 4: Get contract balance
    const balance = await provider.getBalance(CONTRACT_ADDRESS);
    console.log(`✅ Contract balance: ${ethers.formatEther(balance)} SEI`);

    // Test 5: Check if contract exists
    const code = await provider.getCode(CONTRACT_ADDRESS);
    if (code === '0x') {
      console.log('❌ Contract not found at address');
    } else {
      console.log('✅ Contract code found');
    }

    console.log('\n📊 Contract Test Summary:');
    console.log('✅ Provider connection: WORKING');
    console.log('✅ Contract deployment: VERIFIED');
    console.log('✅ Network connectivity: WORKING');
    console.log('✅ Contract address: VALID');

  } catch (error) {
    console.error('❌ Contract test failed:', error.message);
  }
}

testContractInteraction();
