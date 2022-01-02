const Egg = artifacts.require("Egg");
const HatchingEgg = artifacts.require("HatchingEgg");
const Dragon = artifacts.require("Dragon");
const EggFactory = artifacts.require("EggFactory");

module.exports = async (deployer) => {
  await deployer.deploy(Dragon);
  await deployer.deploy(HatchingEgg, Dragon.address, 1);
  await deployer.deploy(Egg, HatchingEgg.address, 1);
  await deployer.deploy(EggFactory, Egg.address, 4);
  let egg = await Egg.deployed();
  egg.transferOwnership(EggFactory.address);

  let hegg = await HatchingEgg.deployed();
  hegg.transferOwnership(egg.address);

  let dragon = await Dragon.deployed();
  dragon.transferOwnership(hegg.address);
};
