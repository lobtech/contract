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

module.exports = async (deployer, network, accounts) => {
  await deployer.deploy(Dragon);
  await deployer.deploy(HatchingEgg, Dragon.address, values.EGG_HATCHING_DELAY);
  await deployer.deploy(Egg, HatchingEgg.address, values.EGG_HATCHING_DELAY);
  await deployer.deploy(EggFactory, Egg.address, values.NUM_EGGS);

  let spender = accounts[3]; // values.FEE_RECEIVER;
  await deployer.deploy(LOBToken);
  let lob = await LOBToken.deployed();
  // mint 1k LOB for the LOB distributor
  lob.mint(spender, 1000000000);
  lob.mint(values.FEE_RECEIVER, 1000000000);
  // Factory to distribute LOB from the spender when lootbox is opened
  await deployer.deploy(LOBTokenFactory, LOBToken.address);

  let lobFactory = await LOBTokenFactory.deployed();
  lobFactory.setSpender(values.FEE_RECEIVER);
  lob.approve(lobFactory.address, 1000000000, { from: spender });

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

  await setupLootBox(lootbox, [EggFactory, LOBTokenFactory, MagicWeaponFactory, MagicWeaponFactory, MagicWeaponFactory, BuildingFactory, BuildingFactory, BuildingFactory]);
  await setupLootboxVendor(vendor, values.FEE_RECEIVER);
  await setupMagicWeaponFactory(magicWeaponFactory);

  await lootbox.grantRole(await lootbox.MINTER_ROLE(), vendor.address);
  buildingFactory.transferOwnership(lootbox.address);
  magicWeaponFactory.transferOwnership(lootbox.address);
  lobFactory.transferOwnership(lootbox.address);
  building.transferOwnership(buildingFactory.address);
  magicWeapon.transferOwnership(magicWeaponFactory.address);

  let egg = await Egg.deployed();
  egg.transferOwnership(EggFactory.address);
  let eggFactory = await EggFactory.deployed();
  eggFactory.transferOwnership(lootbox.address);

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
