// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// 此合约用于操作货币的合约

interface IERC20 {
    // 转让资产 （受益人，资产数量）
    function transfer(address to, uint256 value) external returns (bool);

    // 授权 （访问者，可以用多少）
    function approve(address spender, uint256 value) external returns (bool);

    // 转移资产 （从所有者，到访问者，资产数量）
    function transferFrom(
        address from,
        address to,
        uint256 value
    ) external returns (bool);

    // 查询货币发行总量
    function totalSupply() external view returns (uint256);

    // 查询余额（谁）
    function balanceOf(address who) external view returns (uint256);

    // 查询可支配数量（什么货币，访问者）
    function allowance(address owner, address spender)
        external
        view
        returns (uint256);

    // 监听事件
    event Transfer(address indexed from, address indexed to, uint256 value);

    // 监听事件
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

// 私有合约 所有者可访问
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

// 声明合约 AirDrop 继承 Ownable
contract AirDrop is Ownable {
    // 声明一个map数组
    mapping(address => bool) public users;

    // 保存用户信息 私有
    function saveUsers(address user) internal {
        users[user] = true;
    }

    // 设置当前某个的领取状态 仅所有者可调用
    function setUsers(address user, bool state) public onlyOwner {
        users[user] = state;
    }

    // 查询当前用户是否已领取
    function contains(address user) public view returns (bool) {
        return users[user];
    }

    // 定义每次派发的金额
    uint256 internal acount = 10000000000000000000;

    // 用户访问 临时授权领取（货币地址）
    function distribute(IERC20 token) public {
        // 查询当前用户是否已存在
        require(!contains(msg.sender), "You may not repeat recipients.");

        // 授权 （访问者，可以用多少）
        require(
            token.approve(msg.sender, acount),
            "You can assign the assets have been exhausted."
        );

        // 转移资产 （从所有者，到访问者，资产数量）
        require(
            token.transferFrom(owner(), msg.sender, acount),
            "You can assign the assets have been exhausted."
        );

        // 把领取的这个用户存入数组
        saveUsers(msg.sender);
    }
}
