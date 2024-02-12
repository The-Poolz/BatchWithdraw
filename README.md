# BatchWithdraw

[![Build and Test](https://github.com/The-Poolz/BatchWithdraw/actions/workflows/node.js.yml/badge.svg)](https://github.com/The-Poolz/BatchWithdraw/actions/workflows/node.js.yml)
[![codecov](https://codecov.io/gh/The-Poolz/BatchWithdraw/graph/badge.svg)](https://codecov.io/gh/The-Poolz/BatchWithdraw)
[![CodeFactor](https://www.codefactor.io/repository/github/the-poolz/BatchWithdraw/badge)](https://www.codefactor.io/repository/github/the-poolz/BatchWithdraw)

`BatchWithdraw` simplifies the bulk **withdrawal** and **refund** processes for [LockDealNFT](https://github.com/The-Poolz/LockDealNFT) holders.

### Navigation

-   [Installation](#installation)
-   [Functionality](#functionality)
-   [UML](#uml)
-   [License](#license)

## Installation

**Install the packages:**

```console
npm i
```

**Compile contracts:**

```console
npx hardhat compile
```

**Run tests:**

```console
npx hardhat test
```

**Run coverage:**

```console
npx hardhat coverage
```

**Deploy:**

```console
truffle dashboard
```

```console
npx hardhat run ./scripts/deploy.ts --network truffleDashboard
```

## Functionality

#### Batch Refund

```solidity
function batchRefund(uint256[] calldata tokenIds) external
```

* This function allows users to batch refund tokens specified by their **token IDs (pool ids)**. It refunds tokens owned by `the caller` to **RefundProvider**. The tokens must be approved for refunding.

#### Batch Withdraw

```solidity
function batchWithdraw(uint256[] calldata tokenIds) external
```

* This function allows users to withdraw multiple tokens specified by their token IDs in a batch. It iterates through the provided **token IDs (pool ids)** and **withdraws** each token if it is not empty.

* Users should ensure that they have ownership of the tokens they wish to withdraw and that they have approved the contract to interact with their tokens.

#### Withdraw All

```solidity
function withdrawAll() external
```

* This function allows users to withdraw all tokens owned by the caller that are not empty. It iterates through all tokens owned by `the caller` and withdraws each non-empty token.

#### Withdraw all by token filter

```solidity
function withdrawAll(address[] calldata tokenFilter) external
```

This function allows users to withdraw all tokens owned by the caller that are not empty and match the specified token filter. It iterates through all tokens owned by the caller that match the filter and withdraws each non-empty token.

## UML

![classDiagram](https://github.com/The-Poolz/BatchWithdraw/assets/68740472/75adf459-8ac9-4943-be01-1748423e896f)

## License

[The-Poolz](https://poolz.finance/) Contracts is released under the [MIT License](https://github.com/The-Poolz/BatchWithdraw/blob/master/LICENSE).
