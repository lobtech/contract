const Egg = artifacts.require("Egg");
const HatchingEgg = artifacts.require("HatchingEgg");
const Dragon = artifacts.require("Dragon");
const EggFactory = artifacts.require("EggFactory");


const LOBToken = artifacts.require("LOBToken");
const LOBTokenFactory = artifacts.require("LOBTokenFactory");
const LootBox = artifacts.require("LootBox");
const LootBoxRandomness = artifacts.require("LootBoxRandomness");
const LootBoxVendor = artifacts.require("LootBoxVendor");
const Building = artifacts.require("Building");
const BuildingFactory = artifacts.require("BuildingFactory");
const MagicWeapon = artifacts.require("MagicWeapon");
const MagicWeaponFactory = artifacts.require("MagicWeaponFactory");

const fs = require("fs");
const values = require("../lib/valuesCommon");
const { setupLootboxVendor, setupLootBox, setupMagicWeaponFactory } = require("../lib/setupLootboxes");

module.exports = async (deployer, network) => {
  await deployer.deploy(Dragon);
  await deployer.deploy(HatchingEgg, Dragon.address, values.EGG_HATCHING_DELAY);
  await deployer.deploy(Egg, HatchingEgg.address, values.EGG_HATCHING_DELAY);
  await deployer.deploy(EggFactory, Egg.address, values.NUM_EGGS);

  await deployer.deploy(LOBToken);
  let lob = await LOBToken.deployed();
  // mint 1b LOB for the LOB distributor
  lob.mint(values.FEE_RECEIVER, 1000000000);
  // Factory to distribute LOB from the spender when lootbox is opened
  await deployer.deploy(LOBTokenFactory, LOBToken.address, values.FEE_RECEIVER);
  let lobFactory = await LOBTokenFactory.deployed();

  await deployer.deploy(Building);
  let building = await Building.deployed();
  await deployer.deploy(BuildingFactory, Building.address);
  let buildingFactory = await BuildingFactory.deployed();
  await deployer.deploy(MagicWeapon);
  let magicWeapon = await MagicWeapon.deployed();
  await deployer.deploy(MagicWeaponFactory, MagicWeapon.address);
  let magicWeaponFactory = await MagicWeaponFactory.deployed();
  await deployer.deploy(LootBoxRandomness);
  await deployer.link(LootBoxRandomness, LootBox);
  await deployer.deploy(LootBox, LOBToken.address);
  let lootbox = await LootBox.deployed();
  await deployer.deploy(LootBoxVendor, LOBToken.address, LootBox.address, values.NUM_LOOTBOX_OPTIONS);
  let vendor = await LootBoxVendor.deployed();
  setupLootBox(lootbox, EggFactory, LOBTokenFactory, MagicWeaponFactory, MagicWeaponFactory, MagicWeaponFactory, BuildingFactory, BuildingFactory, BuildingFactory);
  setupLootboxVendor(vendor, values.FEE_RECEIVER);
  setupMagicWeaponFactory(magicWeaponFactory);
  buildingFactory.transferOwnership(lootbox.address);
  magicWeaponFactory.transferOwnership(lootbox.address);
  lobFactory.transferOwnership(lootbox.address);
  building.transferOwnership(buildingFactory.address);
  magicWeapon.transferOwnership(magicWeaponFactory.address);

  let egg = await Egg.deployed();
  egg.transferOwnership(EggFactory.address);

  let hegg = await HatchingEgg.deployed();
  hegg.transferOwnership(egg.address);

  let dragon = await Dragon.deployed();
  dragon.transferOwnership(hegg.address);

  const contractsDir = __dirname + "/../frontend/src";

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({
      network,
      Egg: Egg.address,
      HatchingEgg: HatchingEgg.address,
      EggFactory: EggFactory.address,
      Dragon: Dragon.address,
      Building: Building.address,
      BuildingFactory: BuildingFactory.address,
      LOBToken: LOBToken.address,
      LOBTokenFactory: LOBTokenFactory.address,
      MagicWeapon: MagicWeapon.address,
      MagicWeaponFactory: MagicWeaponFactory.address,
      LootBox: LootBox.address,
      LootBoxVendor: LootBoxVendor.address,
    }, undefined, 2)
  );
};
