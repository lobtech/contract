// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

/**
 * @dev Extension of ERC1155 that adds tracking of balance per owner.
 *
 * Useful for scenarios where ownership of Fungible and Non-fungible tokens have to be
 * clearly identified.
 */
abstract contract ERC1155SupplyForOwner is ERC1155 {
    function _supplyForOwner(address _owner, uint256 _numOptions)
        internal
        view
        returns (uint256 total)
    {
        for (uint256 i = 0; i < _numOptions; i++) {
            total += balanceOf(_owner, i);
        }
    }
}
