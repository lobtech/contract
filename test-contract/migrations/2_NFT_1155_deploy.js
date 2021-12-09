var NFT1155 = artifacts.require("NFT1155");

module.exports = function(deployer) {
  deployer.then(function() {
    const admin = "0x9a4244c1d438810F09F468DfC2Ea4cf40Ad93c10";
    return deployer
      .deploy(NFT1155, "FingerNFT", "FingerNFT", admin, "ipfs:/", "ipfs:/")
      .then(function(token) {
        console.log(`NFT1155 is deployed at ${token.address}`);
      });
  });
};
