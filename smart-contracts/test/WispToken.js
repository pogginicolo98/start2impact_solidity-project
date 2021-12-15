/*
    WispToken.sol test unit
*/

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("WispToken contract", function () {
    let _contract;
    let contract;
    let owner;
    let addr1;
    let addr2;
    let addrs;
    let initialSupply;

    beforeEach(async function () {
        /*
            Deploy WispToken.sol and set initialSupply
        */

        _contract = await ethers.getContractFactory("WispToken");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        initialSupply= ethers.utils.parseUnits("100000000000", 18);
        contract = await _contract.deploy(initialSupply);
    });

    describe("Deployment", function () {
        it("Should set the right name", async function () {
            expect(await contract.name()).to.equal("Wisp");
        });

        it("Should set the right symbol", async function () {
            expect(await contract.symbol()).to.equal("WISP");
        });

        it("Should set the right owner", async function () {
            expect(await contract.signer.address).to.equal(owner.address);
        });

        it("Should set the right totalSupply", async function () {
            const ownerBalance = await contract.balanceOf(owner.address);
            expect(await contract.totalSupply()).to.equal(initialSupply);
        });

        it("Should assign the total supply of tokens to the owner", async function () {
            const ownerBalance = await contract.balanceOf(owner.address);
            expect(await contract.totalSupply()).to.equal(ownerBalance);
        });
    });

    describe("Transactions", function () {
        it("Should transfer tokens between accounts", async function () {
            const amount = ethers.utils.parseUnits("50", 18);
            await contract.transfer(addr1.address, amount);
            const addr1Balance = await contract.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(amount);

            await contract.connect(addr1).transfer(addr2.address, amount);
            const addr2Balance = await contract.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(amount);
        });

        it("Should fail if sender doesn’t have enough tokens", async function () {
            const initialOwnerBalance = await contract.balanceOf(owner.address);
            const amount = ethers.utils.parseUnits("1", 18);

            await expect(
                contract.connect(addr1).transfer(owner.address, amount)
            ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
            const ownerBalance = await contract.balanceOf(owner.address);
            expect(ownerBalance).to.equal(initialOwnerBalance);
        });

        it("Should update balances after transfers", async function () {
            const initialOwnerBalance = await contract.balanceOf(owner.address);
            const amount1 = ethers.utils.parseUnits("50", 18);
            const amount2 = ethers.utils.parseUnits("25", 18);
            await contract.transfer(addr1.address, amount1);
            await contract.transfer(addr2.address, amount2);

            const ownerBalance = await contract.balanceOf(owner.address);
            const expectedOwnerBalance = initialOwnerBalance.sub(amount1.add(amount2));
            expect(ownerBalance).to.equal(expectedOwnerBalance);

            const addr1Balance = await contract.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(amount1);

            const addr2Balance = await contract.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(amount2);
        });
    });
});
