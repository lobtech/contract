// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "./LOBToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LOBTokenFactory is Ownable {
    LOBToken private lob;
    address private spender;

    constructor(address _lobAddress, address _spender) {
        lob = LOBToken(_lobAddress);
        spender = _spender;
    }

    function mint(
        uint256 _optionId,
        address _to,
        uint256 _amount,
        bytes memory
    ) public onlyOwner {
        lob.transferFrom(spender, _to, _optionId * _amount);
    }
}
