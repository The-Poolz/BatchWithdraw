import { ethers } from "hardhat"

async function main() {
    //const LockDealNFT = "0x3d2C83bbBbfB54087d46B80585253077509c21AE"
    const LockDealNFTTestnet = "0xe42876a77108E8B3B2af53907f5e533Cba2Ce7BE"
    const name = "BatchWithdraw"
    const version = "0.9.0"

    const BatchWithdraw = await ethers.getContractFactory("BatchWithdraw")
    const batchWithdraw = await BatchWithdraw.deploy(LockDealNFTTestnet, name, version)
    console.log("BatchWithdraw deployed to:", await batchWithdraw.getAddress())
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
