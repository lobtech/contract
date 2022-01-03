const { expectRevert, time } = require("@openzeppelin/test-helpers");
const truffleAssert = require("truffle-assertions");
const HatchingEgg = artifacts.require("HatchingEgg");
const Egg = artifacts.require("Egg");
const EggFactory = artifacts.require("EggFactory");
const Dragon = artifacts.require("Dragon");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("HatchingEgg", function (accounts) {
  const MIN_DELAY = 3600;
  let hegg;
  let egg;
  let factory;
  let dragon;
  let userA;
  let owner;

  async function getOption(account, numOptions) {
    for (i = 0; i < numOptions; i++) {
      let b = await egg.balanceOf(account, i);
      if (b.toNumber() > 0)
        return i;
    }
    return -1;
  }

  async function mintAHatchedEgg(account) {
    await factory.mintTo(account);
    let option = await getOption(account, 4);
    await egg.hatch(option, { from: account });
    return option;
  }

  before(async () => {
    hegg = await HatchingEgg.deployed();
    egg = await Egg.deployed();
    factory = await EggFactory.deployed();
    dragon = await Dragon.deployed();
    owner = accounts[0];
    userA = accounts[1];
  })
  it("cannot be minted directly", async () => {
    await truffleAssert.fails(
      hegg.mint(0, userA, 1)
    );
  });

  it("is not ready when hatched", async () => {
    let balance = await hegg.balanceOf(userA, 0);
    assert.equal(0, balance.toNumber());

    await factory.mintTo(userA);
    let option = await getOption(userA, 4);
    await egg.hatch(option, { from: userA });
    balance = await hegg.balanceOf(userA, option);
    assert.equal(1, balance.toNumber());

    assert.isFalse(await hegg.isReady({ from: userA }));
  });

  it("is not allow to breakup when not ready", async () => {
    let userB = accounts[2];
    let option = await mintAHatchedEgg(userB);
    await expectRevert(hegg.breakUp(option, { from: userB }), "HatchingEgg: Not ready to breakup");
  });

  it("breaks out to be a Dragon when ready", async () => {
    let totalDragons = await dragon.totalSupply();
    assert.equal(0, totalDragons.toNumber());
    let userC = accounts[3];
    let option = await mintAHatchedEgg(userC);
    assert.isTrue(option > 0);
    time.increase(MIN_DELAY);
    await hegg.breakUp(option, { from: userC });
    totalDragons = await dragon.totalSupply();
    let token = await dragon.tokenByIndex(0);
    assert.equal(1, totalDragons.toNumber());
    assert.equal(userC, await dragon.ownerOf(token));
  });
});
