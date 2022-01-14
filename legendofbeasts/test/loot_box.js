const LOBToken = artifacts.require("LOBToken");
const LootBox = artifacts.require("LootBox");
const LootBoxVendor = artifacts.require("LootBoxVendor");
const MagicWeapon = artifacts.require("MagicWeapon");
const Building = artifacts.require("Building");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("LootBox", function (accounts) {
  let vendor;
  let lootbox;
  let lob;
  let magicWeapon;
  let building;

  let owner;
  let userA;
  let option = 4;
  beforeEach(async () => {
    vendor = await LootBoxVendor.deployed();
    lootbox = await LootBox.deployed();
    lob = await LOBToken.deployed();
    magicWeapon = await MagicWeapon.deployed();
    building = await Building.deployed();

    owner = accounts[0];
    userA = accounts[1];

    await lob.mint(userA, 1000000000);
    await lob.approve(vendor.address, 1000000000, { from: userA });
    await vendor.buyWithToken(option, 1, { from: userA });
  });

  it("is able to unpack into an egg", async () => {
    // force egg probability 100%
    await lootbox.setProbabilitiesForOption(option, [10000, 0, 0, 0, 0, 0, 0, 0]);
    let lobBalance = await lob.balanceOf(userA);
    await lob.approve(lootbox.address, 100000000, { from: userA });
    await lootbox.unpack(option, 1, { from: userA });
    let lobBalanceNew = await lob.balanceOf(userA);
    assert.equal(lobBalance.toNumber() - lobBalanceNew.toNumber(), 1000000, "unpack should cost 1 LOB");
    let balance = await lootbox.balanceOf(userA, option);
    assert.equal(balance.toNumber(), 0, "lootbox failed to unpack");
  });

  it("is able to unpack into 10 LOB", async () => {
    await lootbox.setProbabilitiesForOption(option, [0, 10000, 0, 0, 0, 0, 0, 0]);
    let lobBalance = await lob.balanceOf(userA);
    await lob.approve(lootbox.address, 100000000, { from: userA });
    await lootbox.unpack(option, 1, { from: userA }); // cost 1 LOB to unpack
    let lobBalanceNew = await lob.balanceOf(userA);
    assert.equal(lobBalanceNew.toNumber() - lobBalance.toNumber(), 9000000, "unpack should gain 10 LOB");
    let balance = await lootbox.balanceOf(userA, option);
    assert.equal(balance.toNumber(), 0, "lootbox failed to unpack");
  });

  it("is able to unpack into a low level magic weapon", async () => {
    // force mint low level magic weapon
    await lootbox.setProbabilitiesForOption(option, [0, 0, 10000, 0, 0, 0, 0, 0]);
    await lob.approve(lootbox.address, 100000000, { from: userA });
    await lootbox.unpack(option, 1, { from: userA });
    let balance = await lootbox.balanceOf(userA, option);
    assert.equal(balance.toNumber(), 0, "lootbox failed to unpack");

    let lowLevel = [0, 1, 2];
    let batch = await magicWeapon.balanceOfBatch([userA, userA, userA], lowLevel);
    let sum = batch.reduce((x, y) => x.add(y));
    assert.equal(sum.toNumber(), 1, "no low level weapon found");
  });

  it("is able to unpack into a building", async () => {
    await lootbox.setProbabilitiesForOption(option, [0, 0, 0, 0, 0, 10000, 0, 0]);
    await lob.approve(lootbox.address, 100000000, { from: userA });
    await lootbox.unpack(option, 1, { from: userA });
    let balance = await lootbox.balanceOf(userA, option);
    assert.equal(balance.toNumber(), 0, "lootbox failed to unpack");

    let numBuilding = await building.balanceOf(userA);
    assert.equal(numBuilding.toNumber(), 1, "no building found");
  })

});
