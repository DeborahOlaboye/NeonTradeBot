// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "lib/openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";
import "lib/openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";
import "lib/openzeppelin-contracts/contracts/access/Ownable.sol";

/**
 * @title YeiFinanceLendingPool
 * @dev Simplified lending pool for hackathon demonstration
 */
contract YeiFinanceLendingPool is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    struct ReserveData {
        uint256 totalSupply;
        uint256 totalBorrow;
        uint256 supplyRate;
        uint256 borrowRate;
        uint256 utilizationRate;
        bool isActive;
    }

    struct UserData {
        uint256 supplied;
        uint256 borrowed;
        uint256 lastUpdateTimestamp;
    }

    mapping(address => ReserveData) public reserves;
    mapping(address => mapping(address => UserData)) public userData; // user => asset => data
    
    address[] public supportedAssets;
    uint256 public constant UTILIZATION_OPTIMAL = 80e16; // 80%
    uint256 public constant RATE_BASE = 2e16; // 2%
    uint256 public constant RATE_SLOPE1 = 4e16; // 4%
    uint256 public constant RATE_SLOPE2 = 60e16; // 60%
    uint256 public constant LTV_RATIO = 75e16; // 75%

    event Supply(address indexed user, address indexed asset, uint256 amount);
    event Withdraw(address indexed user, address indexed asset, uint256 amount);
    event Borrow(address indexed user, address indexed asset, uint256 amount);
    event Repay(address indexed user, address indexed asset, uint256 amount);

    constructor() Ownable(msg.sender) {}

    function addAsset(address asset) external onlyOwner {
        require(!reserves[asset].isActive, "Asset already added");
        reserves[asset] = ReserveData({
            totalSupply: 0,
            totalBorrow: 0,
            supplyRate: RATE_BASE,
            borrowRate: RATE_BASE + RATE_SLOPE1,
            utilizationRate: 0,
            isActive: true
        });
        supportedAssets.push(asset);
    }

    function supply(address asset, uint256 amount) external nonReentrant {
        require(reserves[asset].isActive, "Asset not supported");
        require(amount > 0, "Amount must be greater than 0");

        IERC20(asset).safeTransferFrom(msg.sender, address(this), amount);
        
        userData[msg.sender][asset].supplied += amount;
        userData[msg.sender][asset].lastUpdateTimestamp = block.timestamp;
        reserves[asset].totalSupply += amount;

        _updateRates(asset);
        emit Supply(msg.sender, asset, amount);
    }

    function withdraw(address asset, uint256 amount) external nonReentrant {
        require(reserves[asset].isActive, "Asset not supported");
        require(userData[msg.sender][asset].supplied >= amount, "Insufficient balance");
        
        // Check if withdrawal maintains healthy collateral ratio
        require(_isWithdrawalAllowed(msg.sender, asset, amount), "Withdrawal would breach collateral ratio");

        userData[msg.sender][asset].supplied -= amount;
        userData[msg.sender][asset].lastUpdateTimestamp = block.timestamp;
        reserves[asset].totalSupply -= amount;

        IERC20(asset).safeTransfer(msg.sender, amount);
        
        _updateRates(asset);
        emit Withdraw(msg.sender, asset, amount);
    }

    function borrow(address asset, uint256 amount) external nonReentrant {
        require(reserves[asset].isActive, "Asset not supported");
        require(amount > 0, "Amount must be greater than 0");
        require(IERC20(asset).balanceOf(address(this)) >= amount, "Insufficient liquidity");
        
        // Check collateral requirements
        require(_isBorrowAllowed(msg.sender, asset, amount), "Insufficient collateral");

        userData[msg.sender][asset].borrowed += amount;
        userData[msg.sender][asset].lastUpdateTimestamp = block.timestamp;
        reserves[asset].totalBorrow += amount;

        IERC20(asset).safeTransfer(msg.sender, amount);
        
        _updateRates(asset);
        emit Borrow(msg.sender, asset, amount);
    }

    function repay(address asset, uint256 amount) external nonReentrant {
        require(reserves[asset].isActive, "Asset not supported");
        require(userData[msg.sender][asset].borrowed >= amount, "Repay amount exceeds debt");

        IERC20(asset).safeTransferFrom(msg.sender, address(this), amount);
        
        userData[msg.sender][asset].borrowed -= amount;
        userData[msg.sender][asset].lastUpdateTimestamp = block.timestamp;
        reserves[asset].totalBorrow -= amount;

        _updateRates(asset);
        emit Repay(msg.sender, asset, amount);
    }

    function getUserAccountData(address user) external view returns (
        uint256 totalCollateral,
        uint256 totalDebt,
        uint256 availableBorrows,
        uint256 currentLiquidationThreshold,
        uint256 ltv,
        uint256 healthFactor
    ) {
        totalCollateral = _getUserTotalCollateral(user);
        totalDebt = _getUserTotalDebt(user);
        availableBorrows = (totalCollateral * LTV_RATIO / 1e18) - totalDebt;
        currentLiquidationThreshold = 80e16; // 80%
        ltv = LTV_RATIO;
        healthFactor = totalDebt > 0 ? (totalCollateral * currentLiquidationThreshold / 1e18) * 1e18 / totalDebt : type(uint256).max;
    }

    function getReserveData(address asset) external view returns (ReserveData memory) {
        return reserves[asset];
    }

    function _updateRates(address asset) internal {
        ReserveData storage reserve = reserves[asset];
        
        if (reserve.totalSupply == 0) {
            reserve.utilizationRate = 0;
            reserve.supplyRate = RATE_BASE;
            reserve.borrowRate = RATE_BASE + RATE_SLOPE1;
            return;
        }

        reserve.utilizationRate = reserve.totalBorrow * 1e18 / reserve.totalSupply;
        
        if (reserve.utilizationRate <= UTILIZATION_OPTIMAL) {
            reserve.borrowRate = RATE_BASE + (reserve.utilizationRate * RATE_SLOPE1 / UTILIZATION_OPTIMAL);
        } else {
            uint256 excessUtilization = reserve.utilizationRate - UTILIZATION_OPTIMAL;
            reserve.borrowRate = RATE_BASE + RATE_SLOPE1 + (excessUtilization * RATE_SLOPE2 / (1e18 - UTILIZATION_OPTIMAL));
        }
        
        reserve.supplyRate = reserve.borrowRate * reserve.utilizationRate / 1e18;
    }

    function _getUserTotalCollateral(address user) internal view returns (uint256 total) {
        for (uint256 i = 0; i < supportedAssets.length; i++) {
            address asset = supportedAssets[i];
            total += userData[user][asset].supplied; // Simplified: assuming 1:1 USD value
        }
    }

    function _getUserTotalDebt(address user) internal view returns (uint256 total) {
        for (uint256 i = 0; i < supportedAssets.length; i++) {
            address asset = supportedAssets[i];
            total += userData[user][asset].borrowed; // Simplified: assuming 1:1 USD value
        }
    }

    function _isBorrowAllowed(address user, address asset, uint256 amount) internal view returns (bool) {
        uint256 totalCollateral = _getUserTotalCollateral(user);
        uint256 totalDebt = _getUserTotalDebt(user) + amount;
        return totalDebt <= (totalCollateral * LTV_RATIO / 1e18);
    }

    function _isWithdrawalAllowed(address user, address asset, uint256 amount) internal view returns (bool) {
        uint256 totalCollateral = _getUserTotalCollateral(user) - amount;
        uint256 totalDebt = _getUserTotalDebt(user);
        if (totalDebt == 0) return true;
        return totalDebt <= (totalCollateral * LTV_RATIO / 1e18);
    }
}
