const values = require('./valuesCommon');

const classTokens = [
  [0],
  [10],
  [0],
  [1],
  [2],
  [0],
  [1],
  [2]
];

const classProbabilities = [
  [4000, 4000, 2000, 0, 0, 0, 0, 0],
  [3000, 4000, 1000, 1000, 0, 1000, 0, 0],
  [2000, 2000, 2000, 1000, 1000, 1000, 1000, 0],
  [2000, 3500, 1000, 1000, 1000, 1000, 500, 0],
  [2000, 1000, 2000, 1000, 1000, 1000, 1000, 1000],
  [5000, 1000, 500, 3000, 500, 0, 0, 0],
  [3000, 2000, 1000, 1000, 2000, 1000, 0, 0],
];

const weaponCategories = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8]
];

const WEAPON_OPTIONS = 9;
const TOTAL_SUPPLY = 1000;

// Configure the lootbox

const setupLootBox = async (lootBox, ...factories) => {
  await lootBox.setState(
    values.NUM_LOOTBOX_OPTIONS,
    values.NUM_CLASSES,
    1337
  );
  // We have one token id per rarity class.
  for (let i = 0; i < values.NUM_CLASSES; i++) {
    await lootBox.setTokenIdsForClass(i, classTokens[i]);
    await lootBox.setFactoryForClass(i, factories[i].address);
  }

  for (let i = 0; i < values.NUM_LOOTBOX_OPTIONS; i++) {
    await lootBox.setProbabilitiesForOption(i, classProbabilities[i]);
  }
};

const setupMagicWeaponFactory = async (factory) => {
  for (let i = 0; i < 3; i++) {
    await factory.setOptionIds(i, weaponCategories[i]);
  }
}

const setupLootboxVendor = async (vendor, feeReceiver) => {
  await vendor.setUSDT(values.USDT_ADDRESS);
  await vendor.setFeeReceiver(feeReceiver);
}

const preMintWeapons = async (weapon, owner, factory) => {
  for (let i = 0; i < WEAPON_OPTIONS; i++) {
    await weapon.safeMint(owner, i, TOTAL_SUPPLY, "");
  }
  await weapon.setApprovalForAll(factory.address, true, { from: owner });
}

const preMintHouses = async (house, owner, factory) => {
  for (let i = 0; i < TOTAL_SUPPLY; i++) {
    await house.safeMint(owner);
  }
  await weapon.setApprovalForAll(factory.address, true, { from: owner });
}

// Deploy and configure everything

const setupCreatureAccessories = async (accessories, factory, lootBox, owner) => {
  await setupAccessory(accessories, owner);
  await accessories.setApprovalForAll(factory.address, true, { from: owner });
  await accessories.transferOwnership(factory.address);
  await setupAccessoryLootBox(lootBox, factory);
  await lootBox.transferOwnership(factory.address);
};


module.exports = {
  setupLootBox,
  setupLootboxVendor,
  setupMagicWeaponFactory,
  setupCreatureAccessories
};
