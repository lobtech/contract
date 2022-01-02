// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./IERC1155Factory.sol";
import "./Egg.sol";

contract EggFactory is IERC1155Factory {
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
        override
        returns (bool)
    {
        return _optionId < numOptions && mintedAddresses[_account] == 0;
    }

    function balanceOf(address _owner) public view override returns (uint256) {
        return mintedAddresses[_owner];
    }

    function mintTo(address _to) public override {
        uint256 _optionId = _random() % numOptions;
        require(canMint(_optionId, _to), "Already minted or non-exist option");
        mintedAddresses[msg.sender] = 1;
        Egg egg = Egg(nftAddress);
        egg.mint(_to, _optionId, 1, "0x0");
    }

    function _random() internal returns (uint256 randomNumber) {
        randomNumber = uint256(
            keccak256(
                abi.encodePacked(blockhash(block.number - 1), msg.sender, seed)
            )
        );
        seed = randomNumber;
    }
}
