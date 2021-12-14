const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TreasureNFT contract", function () {
    let _contract;
    let contract;
    let owner;
    let addr1;
    let addr2;
    let addrs;

    beforeEach(async function () {
        _contract = await ethers.getContractFactory("TreasureNFT");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        contract = await _contract.deploy();
    });

    describe("Deployment", function () {
        it("Should set the right name", async function () {
            expect(await contract.name()).to.equal("Treasure");
        });

        it("Should set the right symbol", async function () {
            expect(await contract.symbol()).to.equal("TRS");
        });
    });

    describe("Minting", function () {
        it("Should mint a new token", async function () {
            expect(await contract.balanceOf(owner.address)).to.equal(0);
            await contract.mintTresure(owner.address, "Token URI");
            expect(await contract.balanceOf(owner.address)).to.equal(1);
        });
    });

    describe("Transactions", function () {
        it("Should transfer tokens between accounts", async function () {
            await contract.mintTresure(owner.address, "Token URI");
            let tokenId = await contract.tokenOfOwnerByIndex(owner.address, 0);
            await contract.transferFrom(owner.address, addr1.address, tokenId);
            await contract.connect(addr1).transferFrom(addr1.address, addr2.address, tokenId);
            expect(await contract.balanceOf(addr2.address)).to.equal(1);
        });

    // it("Should fail if sender doesn’t have permission", async function () {
    //   const initialOwnerBalance = await contract.balanceOf(owner.address);
    //   const amount = ethers.utils.parseUnits("1", 18);
    //
    //   await expect(
    //     contract.connect(addr1).transfer(owner.address, amount)
    //   ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    //
    //   expect(await contract.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    // });
    //
    // it("Should update balances after transfers", async function () {
    //   const initialOwnerBalance = await contract.balanceOf(owner.address);
    //   const amount1 = ethers.utils.parseUnits("50", 18);
    //   const amount2 = ethers.utils.parseUnits("25", 18);
    //
    //   await contract.transfer(addr1.address, amount1);
    //   await contract.transfer(addr2.address, amount2);
    //
    //   const finalOwnerBalance = await contract.balanceOf(owner.address);
    //   expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(amount1.add(amount2)));
    //
    //   const addr1Balance = await contract.balanceOf(addr1.address);
    //   expect(addr1Balance).to.equal(amount1);
    //
    //   const addr2Balance = await contract.balanceOf(addr2.address);
    //   expect(addr2Balance).to.equal(amount2);
    // });
    //
    // it("Should give permission to another account", async function () {
    //   const initialOwnerBalance = await contract.balanceOf(owner.address);
    //   const amount = ethers.utils.parseUnits("1", 18);
    //
    //   await expect(
    //     contract.connect(addr1).transfer(owner.address, amount)
    //   ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    //
    //   expect(await contract.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    // });
    });
});
