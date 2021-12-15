// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract GameItems is ERC1155 {
    // 管理员地址 私有变量
    address private _admin;

    // 定义一个修饰器 仅所有者
    modifier onlyOwner() {
        require(msg.sender == _admin);
        _;
    }

    // 初始装备
    uint256 public constant EGG = 0;
    uint256 public constant House = 1;

    // 构造
    constructor() ERC1155("https://pryun.vip/{id}.json") {
        _admin = msg.sender; // 记录管理员
        _mint(msg.sender, EGG, 100, ""); // 初始化100个蛋
        _mint(msg.sender, House, 10, ""); // 初始化10个房子
    }

    // 铸造装备 管理员发行装备(装备id，数量)
    function add(uint256 id, uint256 num) public onlyOwner returns (bool) {
        _mint(_admin, id, num, "");
        return true;
    }

    // 销毁装备 管理员销毁装备(装备id，数量)
    function remove(uint256 id, uint256 num) public onlyOwner returns (bool) {
        _burn(_admin, id, num);
        return true;
    }
}
