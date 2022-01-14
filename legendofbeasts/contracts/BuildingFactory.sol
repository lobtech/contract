// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "./interfaces/IERC1155Factory.sol";
import "./Building.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BuildingFactory is Ownable, IERC1155Factory {
    // using Counters for Counters.Counter;

    // address private spender;
    // Counters.Counter private _tokenIdCounter;

    Building private building;

    // event HouseBuilt(address indexed to, uint256 optionId, uint256 tokenId);

    constructor(address _nftAddress) {
        building = Building(_nftAddress);
    }

    function mint(
        uint256 _optionId,
        address _to,
        uint256 _amount,
        bytes memory
    ) public override onlyOwner {
        require(_amount == 1, "cannot mint more than 1");
        building.safeMintWithOption(_to, _optionId);
        // _tokenIdCounter.increment();
        // building.safeTransferFrom(spender, _to, _tokenIdCounter);
        // emit HouseBuilt(_to, _optionId, _tokenIdCounter);
    }
}
