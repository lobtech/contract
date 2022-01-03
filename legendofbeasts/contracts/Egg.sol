// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.9.0;

import "./HatchingEgg.sol";
import "./ERC1155SupplyForOwner.sol";

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";

contract Egg is
    ERC1155,
    Ownable,
    Pausable,
    ERC1155Burnable,
    ERC1155SupplyForOwner
{
    address public nftAddress; // Hatching egg address

    enum Colors {
        RED,
        GREEN,
        YELLOW,
        BLUE
    }

    event EggHatched(
        address indexed to,
        uint256 optionId,
        uint256 readyTimestamp
    );

    uint256 public constant NUM_OPTIONS = 4;
    uint256 private delay;

    constructor(address _nftAddress, uint256 _delay)
        ERC1155("https://assets.hbeasts.com/eggs/{id}")
    {
        nftAddress = _nftAddress;
        delay = _delay;
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function supplyForOwner(address _owner) public view returns (uint256) {
        return _supplyForOwner(_owner, NUM_OPTIONS);
    }

    function hatch(uint256 _optionId) public {
        _burn(msg.sender, _optionId, 1);
        HatchingEgg hatching = HatchingEgg(nftAddress);
        hatching.mint(msg.sender, _optionId, 1, "0x00");
        emit EggHatched(msg.sender, _optionId, block.timestamp + delay);
    }

    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public onlyOwner {
        require(id < NUM_OPTIONS, "Unavailable Option");
        _mint(account, id, amount, data);
    }

    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public onlyOwner {
        _mintBatch(to, ids, amounts, data);
    }

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override(ERC1155) whenNotPaused {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}
