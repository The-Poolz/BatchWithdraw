// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@poolzfinance/poolz-helper-v2/contracts/interfaces/IProvider.sol";
import "./MockLockDealNFT.sol";

contract MockRefundProvider is ERC721Holder {
    MockLockDealNFT public lockDealNFT;

    constructor(MockLockDealNFT _lockDealNFT) {
        lockDealNFT = _lockDealNFT;
    }

    function name() external pure returns (string memory) {
        return "RefundProvider";
    }

    function onERC721Received(address, address user, uint256, bytes memory) public override returns (bytes4) {
        lockDealNFT.mint(user, 1);
        return this.onERC721Received.selector;
    }
}