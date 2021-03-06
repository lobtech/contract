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
    function numOptions() public pure virtual returns (uint256);

    function supplyForOwner(address _owner)
        internal
        view
        returns (uint256 total)
    {
        uint256 options = numOptions();
        for (uint256 i = 0; i < options; i++) {
            total += balanceOf(_owner, i);
        }
    }
}
