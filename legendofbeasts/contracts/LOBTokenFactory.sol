// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "./interfaces/IERC1155Factory.sol";
import "./LOBToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 *   @dev LOBTokenFactory doesn't own LOB, it simply transfers LOB from the
 *        `spender` address to the receiver
 */
contract LOBTokenFactory is Ownable, IERC1155Factory {
    LOBToken private lob;
    
    // The address to take LOB from
    address private spender;

    constructor(address _lobAddress) {
        lob = LOBToken(_lobAddress);
    }

    function setSpender(address _spender) public onlyOwner {
        spender = _spender;
    }

    function mint(
        uint256 _optionId,
        address _to,
        uint256 _amount,
        bytes memory
    ) public override onlyOwner {
        lob.transferFrom(spender, _to, _optionId * _amount);
    }
}
