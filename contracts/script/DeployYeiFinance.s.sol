// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/YeiFinanceLendingPool.sol";
import "lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _mint(msg.sender, 1000000 * 10**decimals());
    }
    
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract DeployYeiFinance is Script {
    function run() external {
        string memory privateKeyStr = vm.envString("PRIVATE_KEY");
        uint256 deployerPrivateKey;
        
        // Handle private key with or without 0x prefix
        if (bytes(privateKeyStr).length > 2 && 
            bytes(privateKeyStr)[0] == '0' && 
            bytes(privateKeyStr)[1] == 'x') {
            deployerPrivateKey = vm.parseUint(privateKeyStr);
        } else {
            deployerPrivateKey = vm.parseUint(string.concat("0x", privateKeyStr));
        }
        
        vm.startBroadcast(deployerPrivateKey);

        // Deploy lending pool
        YeiFinanceLendingPool lendingPool = new YeiFinanceLendingPool();
        
        // Deploy mock tokens for testing
        MockERC20 usdc = new MockERC20("USD Coin", "USDC");
        MockERC20 usdt = new MockERC20("Tether USD", "USDT");
        
        // Add assets to lending pool
        lendingPool.addAsset(address(usdc));
        lendingPool.addAsset(address(usdt));
        lendingPool.addAsset(address(0)); // Native SEI (address(0) represents native token)

        vm.stopBroadcast();

        console.log("YeiFinanceLendingPool deployed to:", address(lendingPool));
        console.log("USDC deployed to:", address(usdc));
        console.log("USDT deployed to:", address(usdt));
    }
}
