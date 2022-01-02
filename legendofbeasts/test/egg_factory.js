const truffleAssertions = require("truffle-assertions");

const EggFactory = artifacts.require("EggFactory");
const Egg = artifacts.require("Egg");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("EggFactory", function (accounts) {
  const numOptions = 4;
  let factory;
  let egg;
  let owner;
  let userA;
  let userB;
  let userC;

  async function getOption(account) {
    for (i = 0; i < numOptions; i++) {
      let b = await egg.balanceOf(account, i);
      if (b.toNumber() > 0)
        return i;
    }
  }
  beforeEach(async () => {
    factory = await EggFactory.deployed();
    egg = await Egg.deployed();
    owner = accounts[0];
    userA = accounts[1];
    userB = accounts[2];
    userC = accounts[3];
  });

  it("can be minted by anyone once", async function () {
    let balance = await factory.balanceOf(userA);
    assert.equal(0, balance.toNumber());
    await factory.mintTo(userA, { from: userA });
    balance = await factory.balanceOf(userA);
    assert.equal(1, balance.toNumber());
    await truffleAssertions.fails(
      factory.mintTo(userA),
      truffleAssertions.ErrorType.REVERT,
      "Already minted or non-exist option"
    );
    // assert not fail
    await factory.mintTo(accounts[4]);
  });

  it("mints a random egg", async () => {
    await factory.mintTo(userB);
    await factory.mintTo(userC);
    let optionB = await getOption(userB);
    let optionC = await getOption(userC);
    assert.notEqual(optionB, optionC);
  })
});
