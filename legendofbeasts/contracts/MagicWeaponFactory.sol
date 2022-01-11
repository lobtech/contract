// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "./MagicWeapon.sol";
import "./utils/RNG.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MagicWeaponFactory is Ownable, RNG {
    MagicWeapon private weapon;
    mapping(uint256 => uint256[]) optionTokenIds;

    constructor(address _nftAddress) {
        weapon = MagicWeapon(_nftAddress);
    }

    function setOptionIds(uint256 _optionId, uint256[] memory _tokenIds)
        public
        onlyOwner
    {
        optionTokenIds[_optionId] = _tokenIds;
    }

    function mint(
        uint256 _optionId,
        address _to,
        uint256 _amount,
        bytes memory data
    ) public onlyOwner {
        uint256[] memory tokenIds = optionTokenIds[_optionId];
        for (uint256 i = 0; i < _amount; i++) {
            uint256 tokenId = tokenIds[_random() % tokenIds.length];
            weapon.mint(_to, tokenId, 1, data);
        }
    }
}
