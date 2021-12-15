/*
    TreasureNFT.sol test unit
*/

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TreasureNFT contract", function () {
    let _contract;
    let contract;
    let owner;
    let addr1;
    let addr2;
    let addrs;
    let initialOwnerBalance;

    beforeEach(async function () {
        /*
            Deploy TreasureNFT.sol and mint one token
        */

        _contract = await ethers.getContractFactory("TreasureNFT");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        contract = await _contract.deploy();
        await contract.mintTresure(owner.address, "Token URI");
        initialOwnerBalance = await contract.balanceOf(owner.address);
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
            await contract.mintTresure(owner.address, "Token URI");

            const ownerBalance = await contract.balanceOf(owner.address);
            expect(ownerBalance).to.equal(initialOwnerBalance.add(1));
        });
    });

    describe("Transactions", function () {
        it("Should transfer tokens between accounts", async function () {
            const tokenId = await contract.tokenOfOwnerByIndex(owner.address, 0);

            await contract.transferFrom(owner.address, addr1.address, tokenId);
            await contract.connect(addr1).transferFrom(addr1.address, addr2.address, tokenId);
            const addr2Balance = await contract.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(1);
        });

        it("Should fail if sender doesn’t have permission", async function () {
            const tokenId = await contract.tokenOfOwnerByIndex(owner.address, 0);

            await expect(
                contract.connect(addr1).transferFrom(owner.address, addr1.address, tokenId)
            ).to.be.revertedWith("ERC721: transfer caller is not owner nor approved");
            const ownerBalance = await contract.balanceOf(owner.address);
            expect(ownerBalance).to.equal(initialOwnerBalance);
        });

        it("Should update balances after transfers", async function () {
            await contract.mintTresure(owner.address, "Token URI");
            await contract.mintTresure(owner.address, "Token URI");
            const token1Id = await contract.tokenOfOwnerByIndex(owner.address, 0);
            const token2Id = await contract.tokenOfOwnerByIndex(owner.address, 1);
            const token3Id = await contract.tokenOfOwnerByIndex(owner.address, 2);

            let ownerBalance = await contract.balanceOf(owner.address);
            expect(ownerBalance).to.equal(initialOwnerBalance.add(2));

            await contract.transferFrom(owner.address, addr1.address, token1Id);
            await contract.transferFrom(owner.address, addr1.address, token2Id);
            await contract.transferFrom(owner.address, addr1.address, token3Id);
            ownerBalance = await contract.balanceOf(owner.address);
            let addr1Balance = await contract.balanceOf(addr1.address);
            expect(ownerBalance).to.equal(0);
            expect(addr1Balance).to.equal(3);

            await contract.connect(addr1).transferFrom(addr1.address, addr2.address, token1Id);
            await contract.connect(addr1).transferFrom(addr1.address, addr2.address, token2Id);
            addr1Balance = await contract.balanceOf(addr1.address);
            const addr2Balance = await contract.balanceOf(addr2.address);
            expect(addr1Balance).to.equal(1);
            expect(addr2Balance).to.equal(2);
        });

        it("Should give permission to another account", async function () {
            await contract.mintTresure(owner.address, "Token URI");
            let token1Id = await contract.tokenOfOwnerByIndex(owner.address, 0);
            let token2Id = await contract.tokenOfOwnerByIndex(owner.address, 1);

            await contract.approve(addr1.address, token1Id);
            await contract.connect(addr1).transferFrom(owner.address, addr2.address, token1Id);
            const addr2Balance = await contract.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(1);
            await expect(
                contract.connect(addr1).transferFrom(owner.address, addr2.address, token2Id)
            ).to.be.revertedWith("ERC721: transfer caller is not owner nor approved");
        });
    });
});
