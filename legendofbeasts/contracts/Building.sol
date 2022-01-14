// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "./interfaces/IERC721MintWithOption.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Building is
    ERC721,
    ERC721Enumerable,
    Pausable,
    Ownable,
    IERC721MintWithOption
{
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    event HouseBuilt(address indexed to, uint256 optionId, uint256 tokenId);

    constructor() ERC721("LOBHouse", "HOUSE") {}

    function _baseURI() internal pure override returns (string memory) {
        return "https://api.hbeasts.com/assets/buildings/{id}.json";
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function safeMintWithOption(address to, uint256 optionId) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        emit HouseBuilt(to, optionId, tokenId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    // The following functions are overrides required by Solidity.

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
