import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

const provider = new ethers.JsonRpcProvider('https://evm-rpc-testnet.sei-apis.com');
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contractAddress = '0x7fc58f2d50790f6cddb631b4757f54b893692dde';

// Complete ABI for DeFiAgent
const abi = [
  'function owner() view returns (address)',
  'function authorizedAgents(address) view returns (bool)',
  'function authorizeAgent(address)',
  'function revokeAgent(address)',
  'function executeTrade(address, uint256, address)',
  'function executeTradeWithPayment(address, uint256, address, string)',
  'function batchExecuteTrades(address[], uint256[], address[], string[])',
  'function emergencyWithdraw(address)',
  'event AgentAuthorized(address)',
  'event AgentRevoked(address)',
  'event TradeExecuted(address, uint256, address, string)',
  'event CrossmintPaymentProcessed(address, uint256, string)'
];

const contract = new ethers.Contract(contractAddress, abi, signer);

async function main() {
  try {
    console.log('=== NeonTradeBot Contract Interaction ===');
    console.log('Contract:', contractAddress);
    console.log('Signer:', signer.address);
    console.log('Balance:', ethers.formatEther(await provider.getBalance(signer.address)), 'SEI');
    console.log('');

    // Check current state
    const owner = await contract.owner();
    const isAuthorized = await contract.authorizedAgents(signer.address);
    
    console.log('Owner:', owner);
    console.log('Is signer authorized:', isAuthorized);
    console.log('Is signer the owner:', owner.toLowerCase() === signer.address.toLowerCase());
    console.log('');

    // If signer is owner but not authorized, authorize them
    if (owner.toLowerCase() === signer.address.toLowerCase() && !isAuthorized) {
      console.log('Authorizing signer as agent...');
      const tx = await contract.authorizeAgent(signer.address);
      console.log('Transaction hash:', tx.hash);
      
      const receipt = await tx.wait();
      console.log('Transaction confirmed! Gas used:', receipt.gasUsed.toString());
      
      // Verify authorization
      const newStatus = await contract.authorizedAgents(signer.address);
      console.log('New authorization status:', newStatus);
    }

    console.log('');
    console.log('=== Available Functions ===');
    console.log('- owner() - Get contract owner');
    console.log('- authorizedAgents(address) - Check if address is authorized');
    console.log('- authorizeAgent(address) - Authorize new agent');
    console.log('- revokeAgent(address) - Revoke agent authorization');
    console.log('- executeTrade(token, amount, target) - Execute single trade');
    console.log('- executeTradeWithPayment(token, amount, target, paymentId) - Execute trade with payment ID');
    console.log('- batchExecuteTrades(tokens[], amounts[], targets[], paymentIds[]) - Execute multiple trades');
    console.log('- emergencyWithdraw(token) - Emergency withdrawal');
    
    console.log('');
    console.log('Contract is ready for interaction!');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  // Exit cleanly
  process.exit(0);
}

main();
