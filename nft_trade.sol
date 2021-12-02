// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract nftTrader{
    // 指定合约 => 指定编号的Token => 不同卖家及其报价
    mapping(address => mapping(uint256 => Listing)) public listings;

    // 给定地址 => 余额
    mapping(address => uint256) public balances;

    // 存储卖家地址及卖家报价
    struct Listing{
        uint256 price;
        address seller;
    }

    // 将指定合约contractAddr中编号为TokenId的NFT以price的价格加入列表中
    function addListing(uint256 price, address contractAddr, uint256 TokenId) public {
        ERC1155 Token = ERC1155(contractAddr);
        require(Token.balanceOf(msg.sender, TokenId)>0, "caller must own given token!");
        require(Token.isApprovedForAll(msg.sender, address(this)), "contract must be approved!");
        //转移
        listings[contractAddr][TokenId] = Listing(price, msg.sender);
    }

    // 买入数量为amount的指定合约contractAddr中编号为TokenId的NFT
    function purchase(address contractAddr, uint256 TokenId, uint256 amount) public payable{
        Listing memory item = listings[contractAddr][TokenId];
        require(msg.value > item.price * amount, "insufficient funds send");
        balances[item.seller] += msg.value;
        // 创建给定contractAddr合约的实例
        ERC1155 Token = ERC1155(contractAddr);
        // 调用safeTransferFrom将amount数量的nft从seller转到msg.sender
        Token.safeTransferFrom(item.seller, msg.sender,TokenId, amount,"");
    }

    // 从msg.value中转amount数量的ether到destAddr
    function withdraw(uint256 amount, address payable destAddr) public {
        require(amount <= balances[msg.sender], "insufficient funds");

        destAddr.transfer(amount);
        balances[msg.sender] -= amount;
    }
}