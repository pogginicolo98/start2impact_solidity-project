const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Merchant contract", function () {
  /*
    merchant.sol test unit
  */

  let _merchant;
  let merchant;
  let _wispToken;
  let wispToken;
  let _treasureNFT;
  let treasureNFT;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    /*
      Deploy WispToken.sol
      Deploy TreasureNFT.sol
      Deploy merchant.sol
    */

    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    _wispToken = await ethers.getContractFactory("WispToken");
    const initialSupply = ethers.utils.parseUnits("100000000000", 18);
    wispToken = await _wispToken.deploy(initialSupply);

    _treasureNFT = await ethers.getContractFactory("TreasureNFT");
    treasureNFT = await _treasureNFT.deploy();

    _merchant = await ethers.getContractFactory("Merchant");
    merchant = await _merchant.deploy(wispToken.address, treasureNFT.address);
  });

  describe("Deployment", function () {
    it("Should set the right WispToken contract address", async function () {
      const wispContract = await merchant.wispContract();
      await expect(wispContract).to.equal(wispToken.address);
    });

    it("Should set the right TreasureNFT contract address", async function () {
      const treasureContract = await merchant.treasureContract();
      await expect(treasureContract).to.equal(treasureNFT.address);
    });
  });

  describe("Place orders", function () {
    it("Should place a new order", async function () {
      // Minting 1 NFT
      await treasureNFT.mintTresure(owner.address, "Token URI");
      const tokenId = await treasureNFT.tokenOfOwnerByIndex(owner.address, 0);

      // Placing 1 order
      await treasureNFT.approve(merchant.address, tokenId);
      await merchant.placeOrder(tokenId, 100);

      // Checking the results
      const ownerNfts = await treasureNFT.balanceOf(owner.address);
      const ownerOrders = await merchant.ordersOf(owner.address);
      await expect(ownerNfts).to.equal(0);
      await expect(ownerOrders).to.equal(1);
    });

    it("Should fail if place a new order without approval", async function () {
      // Minting 1 NFT
      await treasureNFT.mintTresure(owner.address, "Token URI");
      const tokenId = await treasureNFT.tokenOfOwnerByIndex(owner.address, 0);

      // Checking the results
      await expect(merchant.placeOrder(tokenId, 100))
        .to.be.revertedWith("TreasureNFT not approved.");
      const ownerNfts = await treasureNFT.balanceOf(owner.address);
      await expect(ownerNfts).to.equal(1);
    });

    it("Should emit an event after successfully placing an order", async function () {
      // Minting 1 NFT
      await treasureNFT.mintTresure(owner.address, "Token URI");
      const tokenId = await treasureNFT.tokenOfOwnerByIndex(owner.address, 0);

      // Checking the results
      await treasureNFT.approve(merchant.address, tokenId);
      await expect(merchant.placeOrder(tokenId, 100))
        .to.emit(merchant, "OrderPlaced")
        .withArgs(owner.address, tokenId);
    });
  });

  describe("Cancel orders", function () {
    it("Should cancel an existing order", async function () {
      // Minting 2 NFTs
      await treasureNFT.mintTresure(owner.address, "Token URI");
      await treasureNFT.mintTresure(owner.address, "Token URI");
      const tokenId1 = await treasureNFT.tokenOfOwnerByIndex(owner.address, 0);
      const tokenId2 = await treasureNFT.tokenOfOwnerByIndex(owner.address, 1);

      // Placing 2 orders and canceling one
      await treasureNFT.approve(merchant.address, tokenId1);
      await treasureNFT.approve(merchant.address, tokenId2);
      await merchant.placeOrder(tokenId1, 100);
      await merchant.placeOrder(tokenId2, 200);
      await merchant.cancelOrderByIndex(1);

      // Checking the results
      const ownerNfts = await treasureNFT.balanceOf(owner.address);
      const ownerOrders = await merchant.ordersOf(owner.address);
      await expect(ownerNfts).to.equal(1);
      await expect(ownerOrders).to.equal(1);
    });

    it("Should fail if canceling without existing orders", async function () {
      await expect(merchant.cancelOrderByIndex(0))
        .to.be.revertedWith("No order available.");
    });

    it("Should fail if canceling an order with a bad index", async function () {
      // Minting 1 NFT
      await treasureNFT.mintTresure(owner.address, "Token URI");
      const tokenId = await treasureNFT.tokenOfOwnerByIndex(owner.address, 0);

      // Placing 1 order
      await treasureNFT.approve(merchant.address, tokenId);
      await merchant.placeOrder(tokenId, 100);

      // Checking the results
      await expect(merchant.cancelOrderByIndex(1))
        .to.be.revertedWith("Index out of range.");
    });

    it("Should emit an event after successfully canceling an order", async function () {
      // Minting 1 NFT
      await treasureNFT.mintTresure(owner.address, "Token URI");
      const tokenId = await treasureNFT.tokenOfOwnerByIndex(owner.address, 0);

      // Placing 1 order
      await treasureNFT.approve(merchant.address, tokenId);
      await merchant.placeOrder(tokenId, 100);

      // Checking the results
      await expect(merchant.cancelOrderByIndex(0))
        .to.emit(merchant, "OrderCanceled")
        .withArgs(owner.address, tokenId);
    });
  });
});
