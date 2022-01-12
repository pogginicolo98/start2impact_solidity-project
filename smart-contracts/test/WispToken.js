const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("WispToken contract", function () {
  /*
    WispToken.sol test unit
  */

  let _wispToken;
  let wispToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;
  let initialSupply;

  beforeEach(async function () {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // Deploy WispToken.sol
    _wispToken = await ethers.getContractFactory("WispToken");
    initialSupply = ethers.utils.parseUnits("100000000000", 18);
    wispToken = await _wispToken.deploy(initialSupply);
  });

  describe("Deployment", function () {
    it("Should set the right name", async function () {
      await expect(await wispToken.name()).to.equal("Wisp");
    });

    it("Should set the right symbol", async function () {
      await expect(await wispToken.symbol()).to.equal("WISP");
    });

    it("Should set the right owner", async function () {
      await expect(await wispToken.signer.address).to.equal(owner.address);
    });

    it("Should set the right totalSupply", async function () {
      const ownerBalance = await wispToken.balanceOf(owner.address);
      await expect(await wispToken.totalSupply()).to.equal(initialSupply);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await wispToken.balanceOf(owner.address);
      await expect(await wispToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      // Transaction from owner to addr1
      const amount = ethers.utils.parseUnits("50", 18);
      await wispToken.transfer(addr1.address, amount);
      const addr1Balance = await wispToken.balanceOf(addr1.address);
      await expect(addr1Balance).to.equal(amount);

      // Transaction from addr1 to addr2
      await wispToken.connect(addr1).transfer(addr2.address, amount);
      const addr2Balance = await wispToken.balanceOf(addr2.address);
      await expect(addr2Balance).to.equal(amount);
    });

    it("Should fail if sender doesn’t have enough tokens", async function () {
      const initialOwnerBalance = await wispToken.balanceOf(owner.address);
      const amount = ethers.utils.parseUnits("1", 18);

      // Transaction with no available funds
      await expect(wispToken.connect(addr1).transfer(owner.address, amount))
        .to.be.revertedWith("ERC20: transfer amount exceeds balance");

      // Checking the results
      const ownerBalance = await wispToken.balanceOf(owner.address);
      await expect(ownerBalance).to.equal(initialOwnerBalance);
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await wispToken.balanceOf(owner.address);
      const amount1 = ethers.utils.parseUnits("50", 18);
      const amount2 = ethers.utils.parseUnits("25", 18);

      // Transactions between owner, addr1 and addr2
      await wispToken.transfer(addr1.address, amount1);
      await wispToken.transfer(addr2.address, amount2);

      // Checking the results
      const ownerBalance = await wispToken.balanceOf(owner.address);
      const expectedOwnerBalance = initialOwnerBalance.sub(amount1.add(amount2));
      await expect(ownerBalance).to.equal(expectedOwnerBalance);
      const addr1Balance = await wispToken.balanceOf(addr1.address);
      await expect(addr1Balance).to.equal(amount1);
      const addr2Balance = await wispToken.balanceOf(addr2.address);
      await expect(addr2Balance).to.equal(amount2);
    });
  });
});
