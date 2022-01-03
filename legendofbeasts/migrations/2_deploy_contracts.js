const Egg = artifacts.require("Egg");
const HatchingEgg = artifacts.require("HatchingEgg");
const Dragon = artifacts.require("Dragon");
const EggFactory = artifacts.require("EggFactory");
const fs = require("fs");

module.exports = async (deployer) => {
  await deployer.deploy(Dragon);
  await deployer.deploy(HatchingEgg, Dragon.address, 60);
  await deployer.deploy(Egg, HatchingEgg.address, 60);
  await deployer.deploy(EggFactory, Egg.address, 4);
  let egg = await Egg.deployed();
  egg.transferOwnership(EggFactory.address);

  let hegg = await HatchingEgg.deployed();
  hegg.transferOwnership(egg.address);

  let dragon = await Dragon.deployed();
  dragon.transferOwnership(hegg.address);

  const contractsDir = __dirname + "/../frontend/src";

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ Egg: Egg.address, HatchingEgg: HatchingEgg.address, EggFactory: EggFactory.address, Dragon: Dragon.address }, undefined, 2)
  );
};
