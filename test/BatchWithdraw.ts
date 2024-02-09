import { BatchWithdraw, MockLockDealNFT } from "../typechain-types/"
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers"
import { expect } from "chai"
import { parseUnits } from "ethers"
import { ethers } from "hardhat"

describe("Batch Withdraw", function () {
    let batchWithdraw: BatchWithdraw
    let lockDealNFT: MockLockDealNFT
    let owner: SignerWithAddress
    let user: SignerWithAddress
    let totalSupply = 0
    const tokenAmount = 10 // per iteration

    before(async () => {
        [owner, user] = await ethers.getSigners()
        const ERC721 = await ethers.getContractFactory("MockLockDealNFT")
        lockDealNFT = await ERC721.deploy("LockDealNFT", "LDNFT")
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
