// Simplified Crossmint integration without GOAT SDK for now
const axios = require('axios');

class CrossmintService {
  constructor() {
    this.apiKey = process.env.CROSSMINT_API_KEY;
    this.projectId = process.env.CROSSMINT_PROJECT_ID;
    this.environment = process.env.CROSSMINT_ENVIRONMENT || 'production';
    
    if (!this.apiKey || !this.projectId) {
      console.warn('Crossmint API key or project ID not configured');
      return;
    }

    this.baseURL = this.environment === 'production' 
      ? 'https://api.crossmint.com' 
      : 'https://staging.crossmint.com';
    
    this.headers = {
      'X-API-KEY': this.apiKey,
      'Content-Type': 'application/json'
    };
  }

  async createCheckoutSession(params) {
    try {
      const { recipient, tokenId, collectionId, price, currency = 'ETH' } = params;
      
      const response = await axios.post(`${this.baseURL}/api/2022-06-09/checkout/sessions`, {
        recipient,
        lineItems: [{
          collectionLocator: `crossmint:${collectionId}`,
          callData: {
            tokenId: tokenId || undefined,
            totalPrice: price,
            currency
          }
        }],
        successCallbackURL: `${process.env.FRONTEND_URL}/success`,
        failureCallbackURL: `${process.env.FRONTEND_URL}/failure`
      }, { headers: this.headers });
      
      const session = response.data;

      return session;
    } catch (error) {
      console.error('Error creating Crossmint checkout session:', error);
      throw error;
    }
  }

  async mintNFT(params) {
    try {
      const { recipient, metadata, collectionId } = params;
      
      const response = await axios.post(`${this.baseURL}/api/2022-06-09/collections/${collectionId}/nfts`, {
        recipient,
        metadata
      }, { headers: this.headers });
      
      const result = response.data;

      return result;
    } catch (error) {
      console.error('Error minting NFT via Crossmint:', error);
      throw error;
    }
  }

  async processPayment(params) {
    try {
      const { recipient, amount, currency = 'ETH', description } = params;
      
      const response = await axios.post(`${this.baseURL}/api/2022-06-09/payments`, {
        recipient,
        amount,
        currency,
        description: description || 'NeonTradeBot automated payment'
      }, { headers: this.headers });
      
      const payment = response.data;

      return payment;
    } catch (error) {
      console.error('Error processing Crossmint payment:', error);
      throw error;
    }
  }

  async getTransactionStatus(transactionId) {
    try {
      const response = await axios.get(`${this.baseURL}/api/2022-06-09/transactions/${transactionId}`, {
        headers: this.headers
      });
      
      const status = response.data;
      return status;
    } catch (error) {
      console.error('Error getting transaction status:', error);
      throw error;
    }
  }

  async createWallet(params) {
    try {
      const { email, type = 'ethereum' } = params;
      
      const response = await axios.post(`${this.baseURL}/api/2022-06-09/wallets`, {
        email,
        type
      }, { headers: this.headers });
      
      const wallet = response.data;

      return wallet;
    } catch (error) {
      console.error('Error creating Crossmint wallet:', error);
      throw error;
    }
  }
}

module.exports = new CrossmintService();
