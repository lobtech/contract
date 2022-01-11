// SPDX-License-Identifier: MIT

pragma solidity >0.4.9 <0.9.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

abstract contract RNG {
    using SafeMath for uint256;
    uint256 private _seed;

    function _setSeed(uint256 seed) internal {
        _seed = seed;
    }

    function _random() internal returns (uint256) {
        uint256 randomNumber = uint256(
            keccak256(
                abi.encodePacked(blockhash(block.number - 1), msg.sender, _seed)
            )
        );
        _seed = randomNumber;
        return randomNumber;
    }
}
