import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

async function debugConnection() {
  try {
    console.log('=== Debugging Contract Interaction ===');
    
    // 1. Test environment variables
    console.log('1. Environment Variables:');
    console.log('PRIVATE_KEY exists:', !!process.env.PRIVATE_KEY);
    console.log('SEI_TESTNET_RPC:', process.env.SEI_TESTNET_RPC);
    
    // 2. Test provider connection
    console.log('\n2. Testing Provider Connection:');
    const provider = new ethers.JsonRpcProvider('https://evm-rpc-testnet.sei-apis.com');
    const network = await provider.getNetwork();
    console.log('Network:', network.name, 'Chain ID:', network.chainId.toString());
    
    // 3. Test wallet creation
    console.log('\n3. Testing Wallet:');
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    console.log('Signer address:', signer.address);
    
    const balance = await provider.getBalance(signer.address);
    console.log('Balance:', ethers.formatEther(balance), 'SEI');
    
    // 4. Test simple contract call
    console.log('\n4. Testing Contract Call:');
    const contractAddress = '0x7fc58f2d50790f6cddb631b4757f54b893692dde';
    
    // Simple ABI for owner function only
    const simpleAbi = ['function owner() view returns (address)'];
    const contract = new ethers.Contract(contractAddress, simpleAbi, provider);
    
    const owner = await contract.owner();
    console.log('Contract owner:', owner);
    
    // 5. Test with signer
    console.log('\n5. Testing with Signer:');
    const contractWithSigner = new ethers.Contract(contractAddress, simpleAbi, signer);
    const ownerWithSigner = await contractWithSigner.owner();
    console.log('Owner (with signer):', ownerWithSigner);
    
    console.log('\nAll tests passed! Connection is working.');
    
  } catch (error) {
    console.error('Error during debugging:', error.message);
    console.error('Stack:', error.stack);
  }
}

debugConnection();
