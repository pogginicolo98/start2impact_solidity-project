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
  let addr2;
  let addrs;

  beforeEach(async function () {
    /*
      Deploy WispToken.sol and set initialSupply
      Deploy WelcomeChest.sol and set WISP contract address
    */

    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    _wispToken = await ethers.getContractFactory("WispToken");
    const initialSupply = ethers.utils.parseUnits("100000000000", 18);
    wispToken = await _wispToken.deploy(initialSupply);

    _welcomeChest = await ethers.getContractFactory("WelcomeChest");
    welcomeChest = await _welcomeChest.deploy(wispToken.address);
  });

  describe("Transactions", function () {
    it("Should send 1000 WISP to the requested address", async function () {
      // Funding the faucet
      const amount = ethers.utils.parseUnits("1000", 18);
      await wispToken.transfer(welcomeChest.address, amount.mul(5));

      // Requesting WISP for addr1
      await welcomeChest.request(addr1.address);
      const addr1Balance = await wispToken.balanceOf(addr1.address);
      await expect(addr1Balance).to.equal(amount);

      // Requesting WISP for addr2
      await welcomeChest.request(addr2.address);
      await welcomeChest.request(addr2.address);
      const addr2Balance = await wispToken.balanceOf(addr2.address);
      await expect(addr2Balance).to.equal(amount.mul(2));

      // Checking the results
      const contractBalance = await wispToken.balanceOf(welcomeChest.address);
      await expect(contractBalance).to.equal(amount.mul(2));
    });

    it("Should fail if doesn’t have enough WISP", async function () {
      // Requesting WISP with no available funds
      await expect(welcomeChest.request(addr1.address))
        .to.be.revertedWith("Insufficient funds");

      // Checking the results
      const addr1Balance = await wispToken.balanceOf(addr1.address);
      await expect(addr1Balance).to.equal(0);
    });

    it("Should emit an event after successfully sending 1000 WISP", async function () {
      // Funding the faucet
      const amount = ethers.utils.parseUnits("1000", 18);
      await wispToken.transfer(welcomeChest.address, amount);

      // Checking the results
      await expect(welcomeChest.request(addr1.address))
        .to.emit(welcomeChest, "Sent")
        .withArgs(addr1.address, amount);
    });
  });
});
