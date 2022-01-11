// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "./utils/LootBoxRandomness.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";

contract LootBox is ERC1155, Ownable, Pausable, ERC1155Burnable {
    using LootBoxRandomness for LootBoxRandomness.LootBoxRandomnessState;
    LootBoxRandomness.LootBoxRandomnessState private state;
    IERC20 private lob;
    address private feeReceiver;

    constructor(address _token)
        ERC1155("https://api.hbeasts.com/assets/lootbox/{id}.json")
    {
        lob = IERC20(_token);
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function setFeedReceiver(address _feeReceiver) public onlyOwner {
        feeReceiver = _feeReceiver;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    ///////
    // MAIN FUNCTIONS
    //////

    function unpack(
        uint256 _optionId,
        address _toAddress,
        uint256 _amount
    ) external {
        require(
            lob.allowance(_msgSender(), address(this)) >= 1,
            "Allow more LOB"
        );
        lob.transferFrom(_msgSender(), feeReceiver, 1);
        // This will underflow if _msgSender() does not own enough tokens.
        _burn(_msgSender(), _optionId, _amount);
        // Mint nfts contained by LootBox
        LootBoxRandomness._mint(
            state,
            _optionId,
            _toAddress,
            _amount,
            "",
            address(this)
        );
    }

    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public onlyOwner {
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
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    function setState(
        uint256 _numOptions,
        uint256 _numClasses,
        uint256 _seed
    ) public onlyOwner {
        LootBoxRandomness.initState(state, _numOptions, _numClasses, _seed);
    }

    function setTokenIdsForClass(uint256 _classId, uint256[] memory _tokenIds)
        public
        onlyOwner
    {
        LootBoxRandomness.setTokenIdsForClass(state, _classId, _tokenIds);
    }

    function setFactoryForClass(uint256 _classId, address _factoryAddress)
        public
        onlyOwner
    {
        LootBoxRandomness.setFactoryForClass(state, _classId, _factoryAddress);
    }

    function setSeed(uint256 _seed) public onlyOwner {
        LootBoxRandomness.setSeed(state, _seed);
    }

    function setProbilitiesForOption(
        uint256 _optionId,
        uint16[] memory _probabilities
    ) public {
        LootBoxRandomness.setProbabilitiesForOption(
            state,
            _optionId,
            _probabilities
        );
    }
}
