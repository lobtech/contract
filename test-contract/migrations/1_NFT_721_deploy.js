var NFT721 = artifacts.require("NFT721");

module.exports = function(deployer) {
  deployer.then(function() {
    var admin = "0x6dC0c0be4c8B2dFE750156dc7d59FaABFb5B923D";
    return deployer
      .deploy(NFT721, "FingerNFT", "FingerNFT", admin, "ipfs:/", "ipfs:/")
      .then(function(token) {
        console.log(`NFT721 is deployed at ${token.address}`);
      });
  });
};
