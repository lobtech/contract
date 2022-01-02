pragma solidity >0.4.9 <0.9.0;

interface IERC1155Factory {
    function canMint(uint256 _optionId, address _to)
        external
        view
        returns (bool);

    // Mint a random option to the address;
    function mintTo(address _to) external;

    function balanceOf(address _owner) external view returns (uint256);
}
