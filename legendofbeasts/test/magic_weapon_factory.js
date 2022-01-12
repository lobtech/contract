const MagicWeapon = artifacts.require("MagicWeapon");
const MagicWeaponFactory = artifacts.require("MagicWeaponFactory");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("MagicWeaponFactory", function (accounts) {
  let owner;
  let userA;

  beforeEach(async () => {
    owner = accounts[0];
    userA = accounts[1];
  })
  it("mints MagicWeapon assets", async () => {
    let numOptions = 3;
    let weapon = await MagicWeapon.new(numOptions);
    let factory = await MagicWeaponFactory.new(weapon.address);
    await factory.setOptionIds(0, [0]);
    await factory.setOptionIds(1, [1]);
    await factory.setOptionIds(2, [2]);
    await weapon.transferOwnership(factory.address);

    for (let i = 0; i < 3; i++) {
      await factory.mint(i, userA, 1, "0x0");
      let balance = await weapon.balanceOf(userA, i);
      assert.equal(balance.toNumber(), 1, "should get a weapon 0");
    }
  });
});
