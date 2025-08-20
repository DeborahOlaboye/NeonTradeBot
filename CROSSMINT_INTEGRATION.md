# Crossmint Integration Guide

## Overview
NeonTradeBot now includes comprehensive Crossmint integration using the GOAT SDK, enabling seamless payments, NFT minting, wallet creation, and headless checkout functionality.

## Features Added

### 🔧 Backend Integration
- **Crossmint Service Module** (`backend/services/crossmint.js`)
- **Payment Processing** via GOAT SDK
- **NFT Minting** capabilities
- **Wallet Creation** for users
- **Headless Checkout** sessions
- **Transaction Status** tracking

### 📱 Frontend Integration
- **CrossmintIntegration Component** with UI for:
  - Wallet creation
  - NFT checkout sessions
  - Direct NFT minting
- **Real-time logging** of Crossmint operations

### 🔗 Smart Contract Updates
- **Enhanced DeFiAgent Contract** with:
  - Payment ID tracking
  - Batch trade execution
  - Agent authorization system
  - Crossmint payment events

## Setup Instructions

### 1. Environment Configuration
Copy the example environment file and configure your Crossmint credentials:

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your Crossmint credentials:
```env
CROSSMINT_API_KEY=your_crossmint_api_key_here
CROSSMINT_PROJECT_ID=your_crossmint_project_id_here
CROSSMINT_ENVIRONMENT=staging
PRIVATE_KEY=your_wallet_private_key_here
CONTRACT_ADDRESS=your_deployed_contract_address_here
```

### 2. Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend  
cd ../frontend
npm install
```

### 3. Deploy Smart Contract
```bash
cd contracts
forge install
forge build
forge create src/Agent.sol:DeFiAgent --rpc-url https://rpc.sei-testnet.io --private-key $PRIVATE_KEY
```

Update `CONTRACT_ADDRESS` in your `.env` file with the deployed address.

### 4. Start Services
```bash
# Terminal 1 - Backend
cd backend
node server.js

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## API Endpoints

### Crossmint-Specific Endpoints

#### Create Checkout Session
```http
POST /api/agents/checkout
Content-Type: application/json

{
  "recipient": "0x...",
  "collectionId": "your-collection-id",
  "tokenId": "optional-token-id",
  "price": "0.1",
  "currency": "ETH"
}
```

#### Create Wallet
```http
POST /api/agents/wallet
Content-Type: application/json

{
  "email": "user@example.com",
  "type": "ethereum"
}
```

#### Mint NFT
```http
POST /api/agents/mint
Content-Type: application/json

{
  "recipient": "0x...",
  "collectionId": "your-collection-id",
  "metadata": {
    "name": "NFT Name",
    "description": "NFT Description",
    "image": "https://example.com/image.png"
  }
}
```

#### Batch Trading
```http
POST /api/agents/batch-trade
Content-Type: application/json

{
  "trades": [
    {
      "token": "0x...",
      "amount": 1000,
      "recipient": "0x...",
      "paymentId": "crossmint-payment-id"
    }
  ]
}
```

#### Transaction Status
```http
GET /api/agents/transaction/:transactionId
```

### Enhanced Trading Endpoint
The existing `/api/agents/monitor` endpoint now includes:
- Automatic Crossmint payment processing
- Payment ID tracking in smart contract
- Fallback to regular trades if payment fails

## Smart Contract Functions

### New Functions Added
- `executeTradeWithPayment()` - Execute trade with Crossmint payment ID
- `batchExecuteTrades()` - Execute multiple trades in one transaction
- `authorizeAgent()` - Authorize additional trading agents
- `revokeAgent()` - Revoke agent permissions

### Events Emitted
- `CrossmintPaymentProcessed` - When payment is linked to trade
- `AgentAuthorized` - When new agent is authorized
- `AgentRevoked` - When agent is revoked

## Frontend Usage

The Crossmint integration appears as a separate panel in the UI with three main sections:

1. **Wallet Creation** - Create Crossmint wallets for users
2. **NFT Checkout** - Generate checkout sessions for NFT purchases
3. **NFT Minting** - Direct NFT minting functionality

All operations provide real-time feedback through the logging system.

## Security Considerations

- API keys are stored in environment variables
- Private keys are secured and not exposed in frontend
- Smart contract includes authorization controls
- All transactions are logged for audit trails

## Troubleshooting

### Common Issues
1. **API Key Errors** - Ensure Crossmint credentials are correctly set in `.env`
2. **Contract Deployment** - Verify contract address is updated after deployment
3. **Network Issues** - Confirm Sei testnet RPC is accessible
4. **Frontend Errors** - Install dependencies and ensure backend is running

### Getting Crossmint Credentials
1. Visit [Crossmint Developer Console](https://www.crossmint.com/console)
2. Create a new project
3. Get your API key and Project ID
4. Configure your collection settings

## Next Steps

- Configure your Crossmint collections
- Test payment flows in staging environment
- Deploy to production when ready
- Monitor transaction logs and user feedback

## Support

For Crossmint-specific issues, refer to:
- [Crossmint Documentation](https://docs.crossmint.com/)
- [GOAT SDK Documentation](https://github.com/goat-sdk)
