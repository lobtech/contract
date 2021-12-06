var NFT1155 = artifacts.require("NFT1155");

module.exports = function(deployer) {
  deployer.then(function() {
    const admin = "0x6dc0c0be4c8b2dfe750156dc7d59faabfb5b923d";
    return deployer
      .deploy(NFT1155, "FingerNFT", "FingerNFT", admin, "ipfs:/", "ipfs:/")
      .then(function(token) {
        console.log(`NFT1155 is deployed at ${token.address}`);
      });
  });
};
