modify the chain

build folder 

cmd:
node -v
npm -v
Now using node v11.15.0 (npm v6.7.0)


truffle  migrate --network avax
npm install -g truffle

truffle  migrate --network avax

Truffle v5.4.23 (core: 5.4.23)


### deploy on avax

两个账户：
mint：0x9a4244c1d438810F09F468DfC2Ea4cf40Ad93c10
私钥：67e70ccdba2a7948f154b8ef5dfaa0614fd58227619d7629d973ae19bac6c01a

signer：0xfE01E99B6ee45d74b7d6057D9D3AA4473064FDd7
私钥：7fe483baca334af35a924b54f177228e75b684b379148b4942a4898759ef0378

### start deploy

first deploy 2 contracts
ERC721:0x4736F8B1FD5D2C414d67F54e717fD11116b0CB5A
ERC1155:0x4e1DcA3F8020a3825D0Ce2d2571eD25cd6ef6732

then deploy transfer proxy
transfer proxy: 0xcdA8181cfdf82C71913b478eECF985b47616D994
transfer proxy for de:0xFd3D214Ec1007c352a3db7D107fB9Bc40d44Fa7E

erc20_transfer: 0xF2C399CdB0Ac1F2C10155F923d0C60B78642C7b1
exchange state: 0xEaC99718f8caf68adc2c901128841a4f293829f8

order holder：0x358067Bd85e0Ca201D40D47f059a9B4CE4CE730f
exchange：0x8F1702145C7C50EF39FEd3C1D2Abd4c4dB126d3B



现在通过remix进行创建NFT合约部署，部署的问题是，会报错 account already has role