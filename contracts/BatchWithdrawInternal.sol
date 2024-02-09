// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/INFTView.sol";

contract BatchWithdrawInternal {
    ILockDealNFTViews public lockDealNFT;

    constructor(ILockDealNFTViews _lockDealNFT) {
        require(address(_lockDealNFT) != address(0), "InternalWithdraw: zero address");
        lockDealNFT = _lockDealNFT;
    }

    function _checkData(bool isApproved, uint256 poolId) internal view {
        require(lockDealNFT.ownerOf(poolId) == msg.sender, "BatchWithdraw: not owner");
        require(isApproved || lockDealNFT.getApproved(poolId) == address(this), "BatchWithdraw: not approved");
    }

    function _getIsApproved() internal view returns (bool isApproved) {
        isApproved = lockDealNFT.isApprovedForAll(msg.sender, address(this));
    }

    function _withdraw(bool isApproved, uint256 poolId) internal {
        _checkData(isApproved, poolId);
        _withdraw(poolId);
    }

    function _withdraw(uint256 poolId) internal {
        lockDealNFT.safeTransferFrom(msg.sender, address(lockDealNFT), poolId); // transfer to lockDealNFT = withdraw
    }

    function _refund(uint256 poolId) internal returns (uint256 newPoolId) {
        IProvider refundProvider = _getProvider(poolId);
        require(_isRefundProvider(refundProvider), "BatchWithdraw: must be RefundProvider");
        newPoolId = lockDealNFT.totalSupply();
        lockDealNFT.safeTransferFrom(msg.sender, address(refundProvider), poolId); // transfer to refundProvider = refund
    }

    function _withdrawIfNoEmpty(bool isApproved, uint256 poolId) internal {
        if (lockDealNFT.getWithdrawableAmount(poolId) > 0) {
            _withdraw(isApproved, poolId);
        }
    }

    function _isRefundProvider(IProvider provider) internal view returns (bool isRefundProvider) {
        isRefundProvider = keccak256(bytes(provider.name())) == keccak256(bytes("RefundProvider"));
    }

    function _getProvider(uint256 poolId) internal view returns (IProvider provider) {
        provider = lockDealNFT.poolIdToProvider(poolId);
    }
}