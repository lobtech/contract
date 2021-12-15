// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract Buy {
    // 管理员地址 私有变量
    address private _admin;

    // 定义一个修饰器 仅所有者
    modifier onlyOwner() {
        require(msg.sender == _admin);
        _;
    }

    // 构造
    constructor() {
        _admin = msg.sender; // 记录管理员
    }

    // 获取某个账户的余额
    function getbalance(address account) public view returns (uint256) {
        return account.balance;
    }

    // 购买装备(装备合约地址,)
    function buy(
        ERC1155 token,
        uint256 id,
        uint256 num
    ) public payable returns (bytes memory) {
        // 一手交钱（多少钱由msg.value决定）
        (bool sent, bytes memory data) = _admin.call{value: msg.value}("");
        // 接收错误
        require(sent, "Failed to send Ether");
        // 一手交货
        // 设置信任权限
        token.setApprovalForAll(msg.sender, true);
        token.safeTransferFrom(_admin, msg.sender, id, num, "");
        // 移除信任权限
        token.setApprovalForAll(msg.sender, false);
        return data;
    }
}
