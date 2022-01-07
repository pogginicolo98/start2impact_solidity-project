const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TreasureNFT contract", function () {
  /*
  TreasureNFT.sol test unit
  */

  let _treasureNFT;
  let treasureNFT;
  let owner;
  let addr1;
  let addr2;
  let addrs;
  let initialOwnerBalance;

  beforeEach(async function () {
    /*
      Deploy TreasureNFT.sol and mint one token
    */

    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    _treasureNFT = await ethers.getContractFactory("TreasureNFT");
    treasureNFT = await _treasureNFT.deploy();
    await treasureNFT.mintTresure(owner.address, "Token URI");
    initialOwnerBalance = await treasureNFT.balanceOf(owner.address);
  });

  describe("Deployment", function () {
    it("Should set the right name", async function () {
      await expect(await treasureNFT.name()).to.equal("Treasure");
    });

    it("Should set the right symbol", async function () {
      await expect(await treasureNFT.symbol()).to.equal("TRS");
    });
  });

  describe("Minting", function () {
    it("Should mint a new token", async function () {
      await treasureNFT.mintTresure(owner.address, "Token URI");

      const ownerBalance = await treasureNFT.balanceOf(owner.address);
      await expect(ownerBalance).to.equal(initialOwnerBalance.add(1));
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      const tokenId = await treasureNFT.tokenOfOwnerByIndex(owner.address, 0);

      // Transactions between owner, addr1 and addr2
      await treasureNFT.transferFrom(owner.address, addr1.address, tokenId);
      await treasureNFT.connect(addr1).transferFrom(addr1.address, addr2.address, tokenId);

      // Checking the results
      const addr2Balance = await treasureNFT.balanceOf(addr2.address);
      await expect(addr2Balance).to.equal(1);
    });

    it("Should fail if sender doesn’t have permission", async function () {
      const tokenId = await treasureNFT.tokenOfOwnerByIndex(owner.address, 0);

      // Transaction with no available funds
      await expect(treasureNFT.connect(addr1).transferFrom(owner.address, addr1.address, tokenId))
        .to.be.revertedWith("ERC721: transfer caller is not owner nor approved");

      // Checking the results
      const ownerBalance = await treasureNFT.balanceOf(owner.address);
      await expect(ownerBalance).to.equal(initialOwnerBalance);
    });

    it("Should update balances after transfers", async function () {
      // Minting tokens
      await treasureNFT.mintTresure(owner.address, "Token URI");
      await treasureNFT.mintTresure(owner.address, "Token URI");
      const token1Id = await treasureNFT.tokenOfOwnerByIndex(owner.address, 0);
      const token2Id = await treasureNFT.tokenOfOwnerByIndex(owner.address, 1);
      const token3Id = await treasureNFT.tokenOfOwnerByIndex(owner.address, 2);

      let ownerBalance = await treasureNFT.balanceOf(owner.address);
      await expect(ownerBalance).to.equal(initialOwnerBalance.add(2));

      // Transactions from owner to addr1
      await treasureNFT.transferFrom(owner.address, addr1.address, token1Id);
      await treasureNFT.transferFrom(owner.address, addr1.address, token2Id);
      await treasureNFT.transferFrom(owner.address, addr1.address, token3Id);
      ownerBalance = await treasureNFT.balanceOf(owner.address);
      let addr1Balance = await treasureNFT.balanceOf(addr1.address);
      await expect(ownerBalance).to.equal(0);
      await expect(addr1Balance).to.equal(3);

      // Transactions from addr1 to addr2
      await treasureNFT.connect(addr1).transferFrom(addr1.address, addr2.address, token1Id);
      await treasureNFT.connect(addr1).transferFrom(addr1.address, addr2.address, token2Id);
      addr1Balance = await treasureNFT.balanceOf(addr1.address);
      const addr2Balance = await treasureNFT.balanceOf(addr2.address);
      await expect(addr1Balance).to.equal(1);
      await expect(addr2Balance).to.equal(2);
    });

    it("Should give permission to another account", async function () {
      // Minting tokens
      await treasureNFT.mintTresure(owner.address, "Token URI");
      let token1Id = await treasureNFT.tokenOfOwnerByIndex(owner.address, 0);
      let token2Id = await treasureNFT.tokenOfOwnerByIndex(owner.address, 1);

      // Approve addr1 and transfer from owner to addr2
      await treasureNFT.approve(addr1.address, token1Id);
      await treasureNFT.connect(addr1).transferFrom(owner.address, addr2.address, token1Id);
      const addr2Balance = await treasureNFT.balanceOf(addr2.address);
      await expect(addr2Balance).to.equal(1);

      // Not approved transfer from owner to addr2
      await expect(treasureNFT.connect(addr1).transferFrom(owner.address, addr2.address, token2Id))
        .to.be.revertedWith("ERC721: transfer caller is not owner nor approved");
    });
  });
});
