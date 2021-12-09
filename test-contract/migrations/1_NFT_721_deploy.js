var NFT721 = artifacts.require("NFT721");

module.exports = function(deployer) {
  deployer.then(function() {
    var admin = "0x9a4244c1d438810F09F468DfC2Ea4cf40Ad93c10";
    return deployer
      .deploy(NFT721, "FingerNFT", "FingerNFT", admin, "ipfs:/", "ipfs:/")
      .then(function(token) {
        console.log(`NFT721 is deployed at ${token.address}`);
      });
  });
};
