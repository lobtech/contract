var Web3 = require("web3");
var abi_orc= require('../build/contracts/OwnableOperatorRole.json');

const contract_address = "0xEaC99718f8caf68adc2c901128841a4f293829f8" // exchange state
//const contract_address = "0xcdA8181cfdf82C71913b478eECF985b47616D994" // transfer proxy
//const contract_address = "0xFd3D214Ec1007c352a3db7D107fB9Bc40d44Fa7E" // transfer proxy deprecated
//const contract_address = "0xF2C399CdB0Ac1F2C10155F923d0C60B78642C7b1" // erc20 transfer proxy
const HDWalletProvider = require('@truffle/hdwallet-provider');
const private_key = "部署合约的账号私钥"
const address = "部署合约的账号"

const api_url = "https://api.avax-test.network/ext/bc/C/rpc"
//const api_url = "https://api.avax.network/ext/bc/C/rpc"


const provider = new HDWalletProvider({
  privateKeys: [ private_key ],
  providerOrUrl: api_url,
  chainId: 43113,
  // chainId: 43114,
});


const web3 = new Web3(provider);
const contract = require('truffle-contract');
let custom_token = contract(abi_orc);
custom_token.setProvider(web3.currentProvider);
custom_token.at(contract_address).then(function(instance) {
  let operator = "0x8F1702145C7C50EF39FEd3C1D2Abd4c4dB126d3B";    // nft
  instance.addOperator(operator, {"from": address}).then(function(result){
    console.log(result);
    process.exit();
  }).catch(function(e){
    console.log("eeeeeeeeeeeeeeeee", e);
    process.exit();
  });
});