// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract DeFiAgent {
    address public owner;
    mapping(address => bool) public authorizedAgents;
    
    event TradeExecuted(address indexed token, uint256 amount, address recipient, string paymentId);
    event CrossmintPaymentProcessed(address indexed recipient, uint256 amount, string paymentId);
    event AgentAuthorized(address indexed agent);
    event AgentRevoked(address indexed agent);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    modifier onlyAuthorized() {
        require(msg.sender == owner || authorizedAgents[msg.sender], "Unauthorized");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function authorizeAgent(address agent) external onlyOwner {
        authorizedAgents[agent] = true;
        emit AgentAuthorized(agent);
    }

    function revokeAgent(address agent) external onlyOwner {
        authorizedAgents[agent] = false;
        emit AgentRevoked(agent);
    }

    function executeTrade(address token, uint256 amount, address recipient) external onlyAuthorized {
        // Execute token transfer if token address is provided
        if (token != address(0)) {
            IERC20(token).transfer(recipient, amount);
        }
        emit TradeExecuted(token, amount, recipient, "");
    }

    function executeTradeWithPayment(
        address token, 
        uint256 amount, 
        address recipient, 
        string calldata paymentId
    ) external onlyAuthorized {
        // Execute token transfer if token address is provided
        if (token != address(0)) {
            IERC20(token).transfer(recipient, amount);
        }
        
        emit TradeExecuted(token, amount, recipient, paymentId);
        emit CrossmintPaymentProcessed(recipient, amount, paymentId);
    }

    function batchExecuteTrades(
        address[] calldata tokens,
        uint256[] calldata amounts,
        address[] calldata recipients,
        string[] calldata paymentIds
    ) external onlyAuthorized {
        require(
            tokens.length == amounts.length && 
            amounts.length == recipients.length && 
            recipients.length == paymentIds.length,
            "Array length mismatch"
        );

        for (uint i = 0; i < tokens.length; i++) {
            if (tokens[i] != address(0)) {
                IERC20(tokens[i]).transfer(recipients[i], amounts[i]);
            }
            emit TradeExecuted(tokens[i], amounts[i], recipients[i], paymentIds[i]);
            if (bytes(paymentIds[i]).length > 0) {
                emit CrossmintPaymentProcessed(recipients[i], amounts[i], paymentIds[i]);
            }
        }
    }

    // Emergency functions
    function emergencyWithdraw(address token) external onlyOwner {
        if (token == address(0)) {
            payable(owner).transfer(address(this).balance);
        } else {
            IERC20 tokenContract = IERC20(token);
            tokenContract.transfer(owner, tokenContract.balanceOf(address(this)));
        }
    }

    receive() external payable {}
}
