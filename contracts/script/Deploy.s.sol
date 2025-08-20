// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

import "forge-std/Script.sol";
import "../src/Agent.sol";

contract DeployScript is Script {
    function run() external {
        string memory privateKeyStr = vm.envString("PRIVATE_KEY");
        // Add 0x prefix if not present
        string memory fullPrivateKey = string(abi.encodePacked("0x", privateKeyStr));
        uint256 deployerPrivateKey = vm.parseUint(fullPrivateKey);
        vm.startBroadcast(deployerPrivateKey);

        DeFiAgent agent = new DeFiAgent();
        
        console.log("DeFiAgent deployed to:", address(agent));
        console.log("Owner:", agent.owner());

        vm.stopBroadcast();
    }
}
