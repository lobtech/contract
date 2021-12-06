var NftExchange = artifacts.require("NftExchange");
var TransferProxy = artifacts.require("TransferProxy");
var TransferProxyForDeprecated = artifacts.require("TransferProxyForDeprecated");
var ERC20TransferProxy = artifacts.require("ERC20TransferProxy");
var ExchangeState = artifacts.require("ExchangeState");
var ExchangeOrdersHolder = artifacts.require("ExchangeOrdersHolder");

module.exports = function(deployer) {
  deployer.then(async () => {
    const beneficiary = "0x6dc0c0be4c8b2dfe750156dc7d59faabfb5b923d";
    const buyerFeeSigner = "0x6dc0c0be4c8b2dfe750156dc7d59faabfb5b923d";

    const tranferProxy = await TransferProxy.deployed();
    const transferProxyForDeprecated = await TransferProxyForDeprecated.deployed();
    const erc20TransferProxy = await ERC20TransferProxy.deployed();
    const exchangeState= await ExchangeState.deployed();
    const exchangeOrderHolder = await ExchangeOrdersHolder.deployed();



    return deployer
      .deploy(
        NftExchange,
        tranferProxy.address,
        transferProxyForDeprecated.address,
        erc20TransferProxy.address,
        exchangeState.address,
        exchangeOrderHolder.address,
        beneficiary,
        buyerFeeSigner
      )
      .then((exchange) => {
        console.log(`NftExchange is deployed at ${exchange.address}`);
      });
  });
};
