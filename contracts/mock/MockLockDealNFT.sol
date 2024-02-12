// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@poolzfinance/poolz-helper-v2/contracts/interfaces/IProvider.sol";

contract MockLockDealNFT is ERC721Enumerable, ERC721Holder {
    IProvider public refundProvider;

    constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) {}

    function setRefundProvider(IProvider _refundProvider) external {
        refundProvider = _refundProvider;
    }

    function mint(address to, uint256 count) external {
        for(uint256 i = 0; i < count; ++i){
            _safeMint(to, totalSupply());
        }
    }

    function getWithdrawableAmount(uint256 _poolId) external pure returns (uint256) {
        return _poolId + 1;
    }

    function poolIdToProvider(uint256) external view returns (IProvider) {
        return refundProvider;
    }
}