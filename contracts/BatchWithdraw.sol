// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@poolzfinance/poolz-helper-v2/contracts/Nameable.sol";
import "./BatchWithdrawInternal.sol";

contract BatchWithdraw is BatchWithdrawInternal, Nameable {
    constructor(ILockDealNFTViews _lockDealNFT, string memory name, string memory version) 
    BatchWithdrawInternal(_lockDealNFT) 
    Nameable(name, version)
    {}

    ///@dev Use this function to withdraw the tokens from the user
    ///@param tokenIds - array of token ids - must be owned by the user
    function batchWithdraw(uint256[] calldata tokenIds) external {
        bool isApproved = _getIsApproved();
        for (uint256 i = tokenIds.length; i > 0; ) {
            _withdrawIfNoEmpty(isApproved, tokenIds[--i]);
        }
    }

    ///@dev Use this function to refund the tokens to the user
    ///@param tokenIds - array of token ids - must be owned by the user and be RefundProvider
    function batchRefund(uint256[] calldata tokenIds) external {
        bool isApproved = _getIsApproved();
        require(isApproved, "BatchWithdraw: not approved");
        for (uint256 i = tokenIds.length; i > 0; ) {
            uint256 token = tokenIds[--i];
            _withdraw(_refund(token));
        }
    }
    ///@dev withdraw all tokens from the user that are not empty
    ///@notice This is very expensive function, use it only if you know what you are doing
    function withdrawAll() external {
        bool isApproved = _getIsApproved();
        for (uint256 i = lockDealNFT.balanceOf(msg.sender); i > 0; ) {
            uint256 token = lockDealNFT.tokenOfOwnerByIndex(msg.sender, --i);
            _withdrawIfNoEmpty(isApproved, token);
        }
    }

    ///@dev withdraw all tokens from the user that are not empty and match the filter
    ///@param tokenFilter - filter by token address
    ///@notice This is very expensive function, use it only if you know what you are doing
    function withdrawAll(address[] calldata tokenFilter) external {
        bool isApproved = _getIsApproved();
        for (uint256 i = lockDealNFT.balanceOf(msg.sender, tokenFilter); i > 0; ) {
            uint256 token = lockDealNFT.tokenOfOwnerByIndex(msg.sender, --i, tokenFilter);
            _withdrawIfNoEmpty(isApproved, token);
        }
    }
}