var NftExchange = artifacts.require("NftExchange");
var TransferProxy = artifacts.require("TransferProxy");
var TransferProxyForDeprecated = artifacts.require("TransferProxyForDeprecated");
var ERC20TransferProxy = artifacts.require("ERC20TransferProxy");
var ExchangeState = artifacts.require("ExchangeState");
var ExchangeOrdersHolder = artifacts.require("ExchangeOrdersHolder");

module.exports = function(deployer) {
  deployer.then(async () => {
    const beneficiary = "0x9a4244c1d438810F09F468DfC2Ea4cf40Ad93c10";
    const buyerFeeSigner = "0xfE01E99B6ee45d74b7d6057D9D3AA4473064FDd7";

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
