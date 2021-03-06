// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./interfaces/IERC721MintWithOption.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Dragon is ERC721, ERC721Enumerable, IERC721MintWithOption, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    event DragonBrokeOut(address indexed to, uint256 optionId, uint256 tokenId);

    constructor() ERC721("Dragon", "DRA") {}

    function _baseURI() internal pure override returns (string memory) {
        return "https://assets.hbeasts.com/dragons/{id}";
    }

    function safeMintWithOption(address to, uint256 optionId)
        public
        override
        onlyOwner
    {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        emit DragonBrokeOut(to, optionId, tokenId);
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
