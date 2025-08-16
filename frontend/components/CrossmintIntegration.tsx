import { useState } from 'react';
import axios from 'axios';

interface CrossmintIntegrationProps {
  setLogs: (log: string) => void;
}

const CrossmintIntegration = ({ setLogs }: CrossmintIntegrationProps) => {
  const [email, setEmail] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [collectionId, setCollectionId] = useState('');
  const [recipient, setRecipient] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);

  const createWallet = async () => {
    if (!email) {
      setLogs('Error: Email is required for wallet creation');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/agents/wallet', {
        email,
        type: 'ethereum'
      });

      if (response.data.success) {
        setWalletAddress(response.data.wallet.address);
        setLogs(`Crossmint wallet created: ${response.data.wallet.address}`);
      }
    } catch (error: any) {
      setLogs(`Wallet creation failed: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const createCheckout = async () => {
    if (!recipient || !collectionId || !price) {
      setLogs('Error: Recipient, Collection ID, and Price are required');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/agents/checkout', {
        recipient,
        collectionId,
        price,
        currency: 'ETH'
      });

      if (response.data.success) {
        setLogs(`Checkout session created: ${response.data.sessionId}`);
        // Open checkout URL in new window
        window.open(response.data.checkoutUrl, '_blank');
      }
    } catch (error: any) {
      setLogs(`Checkout creation failed: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const mintNFT = async () => {
    if (!recipient || !collectionId) {
      setLogs('Error: Recipient and Collection ID are required');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/agents/mint', {
        recipient,
        collectionId,
        metadata: {
          name: 'NeonTradeBot NFT',
          description: 'NFT minted by NeonTradeBot',
          image: 'https://example.com/nft-image.png'
        }
      });

      if (response.data.success) {
        setLogs(`NFT minted successfully! Transaction: ${response.data.transactionId}`);
      }
    } catch (error: any) {
      setLogs(`NFT minting failed: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 w-96 mt-8 border border-neon-purple-500 rounded-lg">
      <h2 className="text-2xl mb-4 text-neon-purple-500">Crossmint Integration</h2>
      
      {/* Wallet Creation Section */}
      <div className="mb-6">
        <h3 className="text-lg mb-2 text-neon-blue-400">Create Wallet</h3>
        <input
          className="input mb-2"
          placeholder="Email for wallet creation"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button 
          className="btn w-full mb-2" 
          onClick={createWallet}
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Crossmint Wallet'}
        </button>
        {walletAddress && (
          <p className="text-sm text-neon-green-400">
            Wallet: {walletAddress}
          </p>
        )}
      </div>

      {/* Checkout Section */}
      <div className="mb-6">
        <h3 className="text-lg mb-2 text-neon-blue-400">NFT Checkout</h3>
        <input
          className="input"
          placeholder="Recipient Address (0x...)"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <input
          className="input"
          placeholder="Collection ID"
          value={collectionId}
          onChange={(e) => setCollectionId(e.target.value)}
        />
        <input
          className="input"
          placeholder="Price (ETH)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <button 
          className="btn w-full mb-2" 
          onClick={createCheckout}
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Checkout Session'}
        </button>
      </div>

      {/* NFT Minting Section */}
      <div className="mb-4">
        <h3 className="text-lg mb-2 text-neon-blue-400">Mint NFT</h3>
        <button 
          className="btn w-full" 
          onClick={mintNFT}
          disabled={loading}
        >
          {loading ? 'Minting...' : 'Mint NFT'}
        </button>
      </div>
    </div>
  );
};

export default CrossmintIntegration;
