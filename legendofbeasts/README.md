# Setup

Setup truffle development environment, you can install [Ganache](https://trufflesuite.com/docs/ganache/) to run local Etheruem net

```
npm install -g truffle
npm install

# env vars
cp .secret.json.example .secret.json

# run tests
truffle test

truffle compile
truffle deploy --network development --reset
```

# Design

`EggFactory` is the faucet, it can mint one random egg for any address by calling the `mintTo(address)` function.

The chain of minting is `EggFactory` (`mintTo`)=> `Egg` (`hatch`)=> `HatchingEgg` (`breakUp`)=> `Dragon`

The `HatchingEgg` is time locked, it can only turn into a Dragon after a delay

Ownership is transfer on deployment, there is no other way to direct mint intermediate tokens

Check the [tests](/test) for more details
