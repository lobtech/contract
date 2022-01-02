const Egg = artifacts.require("Egg");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("Egg", function (/* accounts */) {
  it("should assert true", async function () {
    await Egg.deployed();
    return assert.isTrue(true);
  });
});
