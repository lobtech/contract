const { expectRevert } = require("@openzeppelin/test-helpers");

const LOBToken = artifacts.require("LOBToken");
const LootBox = artifacts.require("LootBox");
const LootBoxVendor = artifacts.require("LootBoxVendor");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("LootBox", function (accounts) {
  let vendor;
  let lob;
  let lootbox;
  let owner;
  let userA;
  let option = 0;
  beforeEach(async () => {
    lob = await LOBToken.deployed();
    vendor = await LootBoxVendor.deployed();
    lootbox = await LootBox.deployed();
    owner = accounts[0];
    userA = accounts[1];
    await lob.mint(userA, 1000000000);
  });

  it("sells in LOB token", async () => {
    let balancePre = await lob.balanceOf(userA);
    let price = await vendor.getFeeToken(option);
    await lob.approve(vendor.address, 1000000000, { from: userA });
    await vendor.buyWithToken(option, 1, { from: userA });
    let b = await lootbox.balanceOf(userA, option);
    assert.equal(1, b.toNumber(), "balance is wrong");

    // assert LOB is deducted
    let balancePost = await lob.balanceOf(userA);
    assert.equal(price.toNumber(), balancePre.sub(balancePost).toNumber(), "LOB is not deducted");
  });

  it("sells in Ether", async () => {
    let user = accounts[2];
    let price = await vendor.getFeeEther(option);
    await vendor.buy(option, 1, { from: user, value: price });

    let b = await lootbox.balanceOf(user, option);
    assert.equal(1, b.toNumber(), "balance is wrong");
  });

  it("cannot be bought if price not set", async () => {
    await vendor.setFeeToken(option, 0);
    await lob.approve(vendor.address, 1000000, { from: userA });
    await expectRevert(vendor.buyWithToken(option, 1, { from: userA }), "Option not available for LOB");
  });
});
