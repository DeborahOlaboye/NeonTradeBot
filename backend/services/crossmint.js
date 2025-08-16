const { GoatSDK } = require('@goat-sdk/core');
const { CrossmintHeadlessCheckoutPlugin } = require('@goat-sdk/plugin-crossmint-headless-checkout');

class CrossmintService {
  constructor() {
    this.apiKey = process.env.CROSSMINT_API_KEY;
    this.projectId = process.env.CROSSMINT_PROJECT_ID;
    this.environment = process.env.CROSSMINT_ENVIRONMENT || 'staging';
    
    if (!this.apiKey || !this.projectId) {
      console.warn('Crossmint API key or project ID not configured');
      return;
    }

    this.sdk = new GoatSDK({
      plugins: [
        new CrossmintHeadlessCheckoutPlugin({
          apiKey: this.apiKey,
          projectId: this.projectId,
          environment: this.environment
        })
      ]
    });
  }

  async createCheckoutSession(params) {
    try {
      const { recipient, tokenId, collectionId, price, currency = 'ETH' } = params;
      
      const session = await this.sdk.createCheckoutSession({
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
      });

      return session;
    } catch (error) {
      console.error('Error creating Crossmint checkout session:', error);
      throw error;
    }
  }

  async mintNFT(params) {
    try {
      const { recipient, metadata, collectionId } = params;
      
      const mintResult = await this.sdk.mint({
        recipient,
        metadata,
        collectionId
      });

      return mintResult;
    } catch (error) {
      console.error('Error minting NFT via Crossmint:', error);
      throw error;
    }
  }

  async processPayment(params) {
    try {
      const { recipient, amount, currency = 'ETH', description } = params;
      
      const payment = await this.sdk.processPayment({
        recipient,
        amount,
        currency,
        description: description || 'NeonTradeBot automated payment'
      });

      return payment;
    } catch (error) {
      console.error('Error processing Crossmint payment:', error);
      throw error;
    }
  }

  async getTransactionStatus(transactionId) {
    try {
      const status = await this.sdk.getTransactionStatus(transactionId);
      return status;
    } catch (error) {
      console.error('Error getting transaction status:', error);
      throw error;
    }
  }

  async createWallet(params) {
    try {
      const { email, type = 'ethereum' } = params;
      
      const wallet = await this.sdk.createWallet({
        email,
        type
      });

      return wallet;
    } catch (error) {
      console.error('Error creating Crossmint wallet:', error);
      throw error;
    }
  }
}

module.exports = new CrossmintService();
