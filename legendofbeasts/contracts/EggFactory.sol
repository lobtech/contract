// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./interfaces/IERC1155Factory.sol";
import "./utils/RNG.sol";
import "./Egg.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

contract EggFactory is IERC1155Factory, RNG, Ownable {
    address private nftAddress;
    uint256 private numOptions;
    uint256 private seed;
    mapping(address => uint256) mintedAddresses;

    constructor(address _nftAddress, uint256 _numOptions) {
        nftAddress = _nftAddress;
        numOptions = _numOptions;
        seed = _numOptions;
    }

    function name() external pure returns (string memory) {
        return "LOB Egg faucet";
    }

    function symbol() external pure returns (string memory) {
        return "LOBE";
    }

    function canMint(uint256 _optionId, address _account)
        public
        view
        returns (bool)
    {
        return _optionId < numOptions && mintedAddresses[_account] == 0;
    }

    function balanceOf(address _owner) public view returns (uint256) {
        return mintedAddresses[_owner];
    }

    // API for lootbox
    function mint(
        uint256, // ignore option Id, generated on spot randomly
        address _to,
        uint256 _amount,
        bytes memory data
    ) public override onlyOwner {
        uint256 _optionId = _random() % numOptions;
        Egg egg = Egg(nftAddress);
        egg.mint(_to, _optionId, _amount, data);
    }

    function mintTo(address _to) public {
        uint256 _optionId = _random() % numOptions;
        require(canMint(_optionId, _to), "Already minted or non-exist option");
        mintedAddresses[msg.sender] = 1;
        Egg egg = Egg(nftAddress);
        egg.mint(_to, _optionId, 1, "0x0");
    }
}
