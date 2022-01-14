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

## Egg Faucet

`EggFactory` is the faucet, it can mint one random egg for any address by calling the `mintTo(address)` function.

The chain of minting is `EggFactory` (`mintTo`)=> `Egg` (`hatch`)=> `HatchingEgg` (`breakUp`)=> `Dragon`

The `HatchingEgg` is time locked, it can only turn into a Dragon after a delay

Ownership is transfer on deployment, there is no other way to direct mint intermediate tokens

Check the [tests](/test) for more details


## LootBox

`LootBox` is itself a ERC1155 token, the TokenId correspond to the rareness, in ascending order

`LootBox` is minted (purchased) via `LootBoxVendor`, which acts as an vendor machine. Three currencies can be used to purchase the lootboxes,
Ether, USDT and LOB. The price are independently set buy the contract owner. In the future if we have a LOB poll,
we can bind the token price to USDT price via a price oracle.
Buy request is reverted if the price is not set or set to 0.

`LootBox` delegate the actual minting of assets to Factories, which implements a `IERC1155` style mint [API](/contracts/interfaces/IERC1155Factory.sol)
`mint(uint256 _optionId, address _to, uint256 _amount, bytes memory _data)`

The factories decides if they will mint a random `ERC1155` assets based on the `_optionId` or transfer an `ERC20` token, they can also mint `ERC721` assets.

Sometimes the "level" of `ERC721` assets is decided by from which `ERC1155` token they are minted from, this association can be obtained offline by listening to
an mint event the `ERC721` [contract](/contracts/interfaces/IERC721MintWithOption.sol) emits, this [worker](/metaapi/worker.js) illustration the mechanism.

`LootBox` uses a pseudo random number generator to decide which reward should be given, the probabilities of each "class" can be set via the
`setProbabilitiesForOption` API, fixtures are located in the [setup script](/lib/setupLootboxes.js), the "seed" number can be updated by the owner
to increase the difficulty of attacks.