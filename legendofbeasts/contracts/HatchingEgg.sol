// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./Dragon.sol";
import "./ERC1155SupplyForOwner.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";

contract HatchingEgg is
    ERC1155,
    Ownable,
    Pausable,
    ReentrancyGuard,
    ERC1155Burnable,
    ERC1155SupplyForOwner
{
    uint256 constant NUM_OPTIONS = 4;

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

    function numOptions() public pure override returns (uint256) {
        return NUM_OPTIONS;
    }

    function breakUp(uint256 _optionId) public nonReentrant {
        require(isReady(_msgSender()), "HatchingEgg: Not ready to breakup");
        _burn(msg.sender, _optionId, 1);
        _timestamps[msg.sender] = _DONE;
        Dragon dragon = Dragon(nftAddress);
        dragon.safeMintWithOption(msg.sender, _optionId);
    }

    // Request when the egg is ready to break up
    function dueTime(address _owner) public view returns (uint256) {
        return _timestamps[_owner];
    }

    function isReady(address _owner) public view returns (bool) {
        return _timestamps[_owner] < block.timestamp;
    }

    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public onlyOwner nonReentrant {
        require(
            isReady(_msgSender()),
            "HatchingEgg: Not ready to hatch a new one"
        );
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
    ) internal override(ERC1155) whenNotPaused {
        require(_timestamps[operator] < block.timestamp, "Egg is not ready");
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}
