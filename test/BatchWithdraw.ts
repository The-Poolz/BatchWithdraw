import { BatchWithdraw, MockLockDealNFT, MockRefundProvider } from "../typechain-types/"
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers"
import { expect } from "chai"
import { ethers } from "hardhat"

describe("Batch Withdraw", function () {
    let batchWithdraw: BatchWithdraw
    let lockDealNFT: MockLockDealNFT
    let refundProvider: MockRefundProvider
    let user: SignerWithAddress
    let totalSupply = 0
    const tokenAmount = 10 // per iteration

    before(async () => {
        [user] = await ethers.getSigners()
        const ERC721 = await ethers.getContractFactory("MockLockDealNFT")
        lockDealNFT = await ERC721.deploy("LockDealNFT", "LDNFT")
        const RefundProvider = await ethers.getContractFactory("MockRefundProvider")
        refundProvider = await RefundProvider.deploy(await lockDealNFT.getAddress())
        const refundProviderAddress = await refundProvider.getAddress()
        await lockDealNFT.setRefundProvider(refundProviderAddress)
        const BatchWithdraw = await ethers.getContractFactory("BatchWithdraw")
        batchWithdraw = await BatchWithdraw.deploy(await lockDealNFT.getAddress())
        // approve batchWithdraw to withdraw tokens
        await lockDealNFT.connect(user).setApprovalForAll(await batchWithdraw.getAddress(), true)
    })

    beforeEach(async () => {
        totalSupply += tokenAmount
        // mint 10 tokens to user
        await lockDealNFT.mint(user.address, tokenAmount)
    })

    it("should withdraw all tokens", async () => {
        const balance = await lockDealNFT.balanceOf(await lockDealNFT.getAddress())
        await batchWithdraw.connect(user)["withdrawAll()"]()
        expect(await lockDealNFT.balanceOf(await lockDealNFT.getAddress())).to.equal(
            BigInt(balance) + BigInt(tokenAmount)
        )
    })

    it("should send tokens to refund provider", async () => {
        const balance = await lockDealNFT.balanceOf(await refundProvider.getAddress())
        await batchWithdraw.connect(user).batchRefund([totalSupply - 1, totalSupply - 2, totalSupply - 3])
        expect(await lockDealNFT.balanceOf(await refundProvider.getAddress())).to.equal(BigInt(balance) + BigInt(3))
    })

    it("should withdraw tokens after refund", async () => {
        const lockDealNFTBalance = await lockDealNFT.balanceOf(await lockDealNFT.getAddress())
        await batchWithdraw.connect(user).batchRefund([totalSupply - 1, totalSupply - 2, totalSupply - 3])
        expect(await lockDealNFT.balanceOf(await lockDealNFT.getAddress())).to.equal(
            BigInt(lockDealNFTBalance) + BigInt(3)
        )
    })

    it("should revert withdraw if the user doesn't approve the transfer", async () => {
        await lockDealNFT.connect(user).setApprovalForAll(await batchWithdraw.getAddress(), false)
        await expect(batchWithdraw.connect(user)["withdrawAll()"]()).to.be.revertedWith("BatchWithdraw: not approved")
    })

    it("should revert batchWithdraw if the user doesn't approve the transfer", async () => {
        await lockDealNFT.connect(user).setApprovalForAll(await batchWithdraw.getAddress(), false)
        await expect(batchWithdraw.connect(user).batchWithdraw([totalSupply - 1])).to.be.revertedWith(
            "BatchWithdraw: not approved"
        )
    })

    it("should revert batchRefund if the user doesn't approve the transfer", async () => {
        await lockDealNFT.connect(user).setApprovalForAll(await batchWithdraw.getAddress(), false)
        await expect(batchWithdraw.connect(user).batchRefund([0, 1, 3])).to.be.revertedWith(
            "BatchWithdraw: not approved"
        )
    })
})
