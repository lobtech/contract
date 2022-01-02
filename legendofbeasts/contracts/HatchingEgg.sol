// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./Dragon.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

contract HatchingEgg is
    ERC1155,
    Ownable,
    Pausable,
    ReentrancyGuard,
    ERC1155Burnable,
    ERC1155Supply
{
    uint256 internal constant _DONE = 1;
    mapping(address => uint256) private _timestamps;
    uint256 private _delay;
    address private nftAddress; // Address of the Dragons

    constructor(address _nftAddress, uint256 delay)
        ERC1155("https://assets.hbeasts.com/hatchingeggs/{id}")
    {
        nftAddress = _nftAddress;
        _delay = delay;
    }

    function setDelay(uint256 delay) public onlyOwner {
        _delay = delay;
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

    function breakUp(uint256 _optionId) public nonReentrant {
        require(isReady(_optionId), "HatchingEgg: Not ready to breakup");
        _burn(msg.sender, _optionId, 1);
        _timestamps[msg.sender] = _DONE;
        Dragon dragon = Dragon(nftAddress);
        dragon.safeMint(msg.sender);
    }

    function isReady(uint256 _optionId)
        public
        view
        virtual
        returns (bool ready)
    {
        return _timestamps[msg.sender] < block.timestamp;
    }

    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public onlyOwner nonReentrant {
        _mint(account, id, amount, data);
        _timestamps[account] = block.timestamp + _delay;
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
    ) internal override(ERC1155, ERC1155Supply) whenNotPaused {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}
