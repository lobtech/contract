// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";


contract Token is ERC20 {
  	// 这里把 Your name 改成你想要的代币名称，如Bitcoin, Litecoin, Dogecoin
    // 如 string public token_name = "Bitcoin";
    string public token_name = "Legend of Beasts";
    // 这里把 Your ticker 改成你想要的代笔简写，如BTC，LTC, DOGE
    // 如 string public token_ticker = "BTC";
    string public token_ticker = "LOB";

    constructor () ERC20(token_name, token_ticker) {
        _mint(msg.sender, 30000000 * (10 ** uint256(decimals())));
    }
}