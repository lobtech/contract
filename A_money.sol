// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// 此合约定义当前游戏的的唯一货币

// 私有合约
abstract contract Ownable {
    // 定义一个所有者地址 私有变量
    address private _owner;

    // 生命所有权转移事件
    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    // 构造
    constructor() {
        // 接收访问人信息
        _owner = msg.sender;
        // 触发
        emit OwnershipTransferred(address(0), _owner);
    }

    // 查询合约所有者
    function owner() public view returns (address) {
        return _owner;
    }

    // 定义一个修饰器 仅所有者
    modifier onlyOwner() {
        require(isOwner());
        _;
    }

    // 查询当前访问者是否是所有者
    function isOwner() public view returns (bool) {
        return msg.sender == _owner;
    }

    // 放弃所有权 仅所有者可访问
    function renounceOwnership() public onlyOwner {
        // 触发转移所有权事件（访问者，合约用户列表第一个人）
        emit OwnershipTransferred(_owner, address(0));
        // 临时修改当前实例的用户对象为新的继承者 以保证当前合约继续执行
        _owner = address(0);
    }

    // 转移所有权 仅所有者可访问（新的接班人）
    function transferOwnership(address newOwner) public onlyOwner {
        // 调用内部方法转移
        _transferOwnership(newOwner);
    }

    // 转移所有者 内部方法（新地址）
    function _transferOwnership(address newOwner) internal {
        // 新的继承人不能是合约列表第一个
        require(newOwner != address(0));
        // 触发转移事件
        emit OwnershipTransferred(_owner, newOwner);
        // 临时修改当前实例的用户对象为新的继承者 以保证当前合约继续执行
        _owner = newOwner;
    }
}

// 声明合约 ERC20 继承 ERC20 Ownable
contract Token is ERC20, Ownable {
    // 定义货币名称
    string internal token_name = "QB";

    // 定义货币符号
    string internal token_ticker = "QB";

    // 定义铸造货币所有者
    address internal token_account = msg.sender;

    // 定义货币精度
    uint256 internal token_decimals = 10**uint256(decimals());

    // 定义货币发行数量
    uint256 internal token_amount = 100 * token_decimals;

    // 调用ERC20内部构造函数 用于首次发布合约时执行
    constructor() ERC20(token_name, token_ticker) {
        _mint(token_account, token_amount); // 铸造货币
    }

    // 发行货币（数量）仅所有者可调用
    function add(uint256 _token_amount) public onlyOwner {
        _mint(owner(), _token_amount); // 铸造货币
    }

    // 销毁货币（数量）仅所有者可调用
    function remove(uint256 _token_amount) public onlyOwner {
        _burn(owner(), _token_amount); // 销毁货币
    }
}
