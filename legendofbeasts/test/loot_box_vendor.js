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
  beforeEach(async () => {
    lob = await LOBToken.deployed();
    vendor = await LootBoxVendor.deployed();
    lootbox = await LootBox.deployed();
    owner = accounts[0];
    userA = accounts[1];
    await lob.mint(userA, 1000000000);
  });

  it("buys with LOB token", async function () {
    let option = 0;
    await lob.approve(vendor.address, 1000000, { from: userA });
    await vendor.buyWithToken(option, 1, { from: userA });
    let b = await lootbox.balanceOf(userA, option);
    assert.equal(1, b.toNumber(), "balance is wrong");
  });
});
