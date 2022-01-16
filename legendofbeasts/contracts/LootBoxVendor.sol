// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "./LootBox.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @dev vendor machine for Loot Boxes
 * Three currency (token) are supported for purchasing: ETH, USDT, LOB
 * price per each token are set manually
 */
contract LootBoxVendor is Ownable {
    IERC20 public usdt;
    IERC20 public token;
    LootBox public lootbox;
    
    // Receiver for the ERC20 tokens (USDT, LOB)
    address payable private feeReceiver;
    
    // Price per currency
    mapping(uint256 => uint256) feeEther;
    mapping(uint256 => uint256) feeUSDT;
    mapping(uint256 => uint256) feeToken;
    
    uint256 private numOptions;

    constructor(
        address _token,
        address _lootbox,
        uint256 _numOptions
    ) {
        token = IERC20(_token);
        lootbox = LootBox(_lootbox);
        numOptions = _numOptions;
    }

    /// Set Eth price
    function setFeeEther(uint256 _optionId, uint256 _fee) public onlyOwner {
        require(_optionId < numOptions, "Option not available");
        feeEther[_optionId] = _fee;
    }

    /// Get Eth price
    function getFeeEther(uint256 _optionId) public view returns (uint256) {
        return feeEther[_optionId];
    }

    /// Set USDT price
    function setFeeUSDT(uint256 _optionId, uint256 _fee) public onlyOwner {
        require(_optionId < numOptions, "Option not available");
        feeUSDT[_optionId] = _fee;
    }

    /// Get USDT price
    function getFeeUSDT(uint256 _optionId) public view returns (uint256) {
        return feeUSDT[_optionId];
    }

    /// Set LOB price
    function setFeeToken(uint256 _optionId, uint256 _fee) public onlyOwner {
        require(_optionId < numOptions, "Option not available");
        feeToken[_optionId] = _fee;
    }

    /// Get LOB price
    function getFeeToken(uint256 _optionId) public view returns (uint256) {
        return feeToken[_optionId];
    }

    /// Set money receiver, make sure it's a external owned account
    function setFeeReceiver(address payable _receiver) public onlyOwner {
        feeReceiver = _receiver;
    }

    /// Set USDT contract address
    function setUSDT(address _usdt) public onlyOwner {
        usdt = IERC20(_usdt);
    }

    /// withdraw ether to the feeReceiver
    function withdraw() public onlyOwner {
        feeReceiver.transfer(address(this).balance);
    }

    /// @notice Buy lootbox with Eth, fail if price is 0
    function buy(uint256 _optionId, uint256 _amount) public payable {
        require(_optionId < numOptions, "Option not available");
        uint256 price = feeToken[_optionId];
        require(price > 0, "Option not available for Ether");

        uint256 amountSent = msg.value;
        uint256 amountNeeded = feeEther[_optionId] * _amount;
        require(amountSent >= amountNeeded, "You need to send some ether");
        lootbox.mint(_msgSender(), _optionId, _amount, "0x0");
    }

    /// @notice Buy lootbox with USDT, fail if price is 0
    function buyWithUSDT(uint256 _optionId, uint256 _amount) public {
        require(_optionId < numOptions, "Option not available");
        uint256 price = feeUSDT[_optionId];
        require(price > 0, "Option not available for USDT");
        uint256 totalPrice = price * _amount;
        _buyWith(usdt, totalPrice, _optionId, _amount);
    }

    /// @notice Buy lootbox with LOB, fail if price is 0
    function buyWithToken(uint256 _optionId, uint256 _amount) public {
        require(_optionId < numOptions, "Option not available");
        uint256 price = feeToken[_optionId];
        require(price > 0, "Option not available for LOB");
        uint256 totalPrice = price * _amount;
        _buyWith(token, totalPrice, _optionId, _amount);
    }

    function _buyWith(
        IERC20 _token,
        uint256 _totalPrice,
        uint256 _optionId,
        uint256 _amount
    ) private {
        // allowance check in transferFrom
        _token.transferFrom(_msgSender(), feeReceiver, _totalPrice);
        lootbox.mint(_msgSender(), _optionId, _amount, "0x0");
    }
}
