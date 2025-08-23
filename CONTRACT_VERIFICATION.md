# Contract Verification - NeonTradeBot DeFiAgent

## Deployment Details
- **Contract Address**: `0xc5E45f7888a4FdAA75291aeF8A86DC83475243e5`
- **Network**: Sei Testnet (Chain ID: 1328)
- **Owner**: `0x1Ff9eA9F062C31cfF19Ade558E34894f07Cf7817`
- **Deployment Hash**: `0x1ee3b63ae059a7e77af086298618cb422ea7560105d0419a6917c5394beb6233`
- **Block**: 192304853
- **Gas Used**: 1,370,816
- **Gas Price**: 2.32 gwei

## Source Code
The contract source code is available at: `contracts/src/Agent.sol`

## Compilation Details
- **Solidity Version**: 0.8.28
- **Compiler**: Forge/Foundry
- **Optimization**: Enabled

## Contract Features
- **Owner-based access control**
- **Agent authorization system**
- **Trade execution with Crossmint payment IDs**
- **Batch trading capabilities**
- **Emergency withdrawal functions**
- **Event logging for all operations**

## Testing
All contract functions have been tested with Foundry:
```bash
forge test
# Result: 8 tests passed, 0 failed
```

## Verification Status
- **Automated verification**: Not supported on Sei testnet
- **Manual verification**: Available through Seitrace explorer
- **Source code**: Publicly available in GitHub repository

## Explorer Links
- **Seitrace**: https://seitrace.com/address/0xc5E45f7888a4FdAA75291aeF8A86DC83475243e5?chainId=1328
- **Transaction**: https://seitrace.com/tx/0x1ee3b63ae059a7e77af086298618cb422ea7560105d0419a6917c5394beb6233?chainId=1328

This contract is specifically built for the **DeFi and Payments Track** of the ai/accelathon, featuring:
- Native Sei Network deployment
- Crossmint payment integration
- AI agent automation capabilities
- Sub-400ms transaction finality


YeiFinanceLendingPool deployed to: 0x317884d7a0cAE2Fa64D1475d091E45574E5DaF85
  USDC deployed to: 0xEe4053bf95DfDc1C88609182E6d1b57f24E5feFE
  USDT deployed to: 0xd23329263c344a1d1AFC3140E2F5d1F0AA5d60D9