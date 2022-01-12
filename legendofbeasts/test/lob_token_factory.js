const LOBToken = artifacts.require("LOBToken");
const LOBTokenFactory = artifacts.require("LOBTokenFactory");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("LOBTokenFactory", function (accounts) {
  let lob;
  let factory;
  let owner;
  let userA;
  let userB;
  beforeEach(async () => {
    lob = await LOBToken.new();
    factory = await LOBTokenFactory.new(lob.address);
    owner = accounts[0];
    userA = accounts[1];
    userB = accounts[2];

    await factory.setSpender(userA);
    await lob.approve(factory.address, 1000000000, { from: userA });
    lob.mint(userA, 1000000000);
  });

  it("transfers LOB when mint", async function () {
    await factory.mint(10 * 1000000, userB, 1, "0x0");
    let balance = await lob.balanceOf(userB);
    assert.equal(balance.toNumber(), 10 * 1000000, "didn't receive the LOB tokens");
  });
});
