const {ethers} = require('ethers');
const HatchingEggArtifact require("contracts/HatchingEgg.json");
const {Dragon} = require('./db');
const contractAddress = require('contract-address');

const PROVIDER_URL = "https://api.avax-test.network/ext/bc/C/rpc"; // process.env.PROVIDER_URL
const provider = ethers.providers.JsonRpcProvider(PROVIDER_URL);

function main() {
  const hegg = new ethers.Contract(
    contractAddress.HatchingEgg,
    HatchingEggArtifact.abi,
    provider.getSigner(0)
  );

  hegg.on('DragonBrokeOut', (to, optionId, tokenId) => {
    let dragon = getRandomDragonForOption(optionId);
    await Dragon.create({name: dragon.name, tokenId: tokenId});
  };

}

const dragonTypes = [
  [
    {name: "灵狐" },
    {name: "幻鹿" },
    {name: "水豚" }
  ],
  [
    {name: "千秋龟" },
    {name: "孔雀" },
    {name: "幽冥虎" },
    {name: "独角兽" },
  ],
  [
    {name: "麒麟"},
    {name: "犬神"},
    {name: "巨犀"},
    {name: "兔子"},
  ]
]

// private utils
function getRandomDragonForOption(optionId) {
  let types = dragonTypes[optionId]
  return types[getRandomInt(types.length)];
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

main();
