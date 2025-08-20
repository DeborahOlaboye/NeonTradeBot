// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;
import "forge-std/Test.sol";
import "../src/Agent.sol";

contract DeFiAgentTest is Test {
    DeFiAgent agent;
    address owner;
    address agent1;
    address recipient;

    function setUp() public {
        owner = address(this);
        agent1 = address(0x1);
        recipient = address(0x456);
        agent = new DeFiAgent();
    }

    receive() external payable {}

    function testOwnerIsSetCorrectly() public view {
        assertEq(agent.owner(), owner);
    }

    function testAuthorizeAgent() public {
        assertFalse(agent.authorizedAgents(agent1));
        agent.authorizeAgent(agent1);
        assertTrue(agent.authorizedAgents(agent1));
    }

    function testRevokeAgent() public {
        agent.authorizeAgent(agent1);
        assertTrue(agent.authorizedAgents(agent1));
        agent.revokeAgent(agent1);
        assertFalse(agent.authorizedAgents(agent1));
    }

    function testUnauthorizedAgentCannotExecuteTrade() public {
        vm.expectRevert("Unauthorized");
        vm.prank(agent1);
        agent.executeTrade(address(0), 1000, recipient);
    }

    function testExecuteTradeAsOwner() public {
        // Test with zero address (no actual token transfer)
        agent.executeTrade(address(0), 1000, recipient);
    }

    function testExecuteTradeWithPayment() public {
        string memory paymentId = "crossmint-payment-123";
        agent.executeTradeWithPayment(address(0), 1000, recipient, paymentId);
    }

    function testEmergencyWithdrawETH() public {
        vm.deal(address(agent), 1 ether);
        uint256 ownerBalanceBefore = owner.balance;
        agent.emergencyWithdraw(address(0));
        uint256 ownerBalanceAfter = owner.balance;
        assertEq(ownerBalanceAfter - ownerBalanceBefore, 1 ether);
        assertEq(address(agent).balance, 0);
    }

    function testReceiveFunction() public {
        uint256 amount = 0.5 ether;
        (bool success,) = address(agent).call{value: amount}("");
        assertTrue(success);
        assertEq(address(agent).balance, amount);
    }
}