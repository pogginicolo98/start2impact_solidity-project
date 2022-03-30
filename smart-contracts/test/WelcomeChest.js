const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("WelcomeChest contract", function () {
  /*
    WelcomeChest.sol test unit
  */

  let _welcomeChest;
  let welcomeChest;
  let _wispToken;
  let wispToken;
  let owner;
  let addr1;
  let addrs;
  let initialWelcomeChestSupply
  let expectedAmount

  beforeEach(async function () {
    [owner, addr1, ...addrs] = await ethers.getSigners();

    // Deploy WispToken.sol
    _wispToken = await ethers.getContractFactory("WispToken");
    const initialSupply = ethers.utils.parseUnits("100000000000", 18);
    wispToken = await _wispToken.deploy(initialSupply);

    // Deploy WelcomeChest.sol
    _welcomeChest = await ethers.getContractFactory("WelcomeChest");
    welcomeChest = await _welcomeChest.deploy(wispToken.address);

    // Faucet replenishment
    initialWelcomeChestSupply = ethers.utils.parseUnits("1000", 18);
    expectedAmount = ethers.utils.parseUnits("1000", 18);
    await wispToken.transfer(welcomeChest.address, initialWelcomeChestSupply);
  });

  describe("Deployment", function () {
    it("Should set the right WispToken contract address", async function () {
      const wisp = await welcomeChest.wisp();
      await expect(wisp).to.equal(wispToken.address);
    });
  });

  describe("Transactions", function () {
    it("Should send 1000 WISP to the address provided", async function () {
      // Redeem WISP for addr1
      await welcomeChest.redeemTokens(addr1.address);

      // Check the results
      const addr1Balance = await wispToken.balanceOf(addr1.address);
      await expect(addr1Balance).to.equal(expectedAmount);
      const welcomeChestBalance = await wispToken.balanceOf(welcomeChest.address);
      await expect(welcomeChestBalance).to.equal(initialWelcomeChestSupply.sub(expectedAmount));
    });

    it("Should fail if doesn’t have enough WISP", async function () {
      // Emptying the faucet
      await welcomeChest.redeemTokens(owner.address);

      // Check the results
      await expect(welcomeChest.redeemTokens(addr1.address))
        .to.be.revertedWith("Insufficient funds");
      const addr1Balance = await wispToken.balanceOf(addr1.address);
      await expect(addr1Balance).to.equal(0);
    });

    it("Should emit an event after successfully sending 1000 WISP", async function () {
      await expect(welcomeChest.redeemTokens(addr1.address))
        .to.emit(welcomeChest, "TokensSent")
        .withArgs(addr1.address, expectedAmount);
    });
  });
});
