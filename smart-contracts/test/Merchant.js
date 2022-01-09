const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Merchant contract", function () {
  /*
    Merchant.sol test unit
  */

  let _merchant;
  let merchant;
  let _wispToken;
  let wispToken;
  let _treasureNFT;
  let treasureNFT;
  let owner;
  let addr1;
  let addrs;
  let tokenId1;
  let tokenId2;
  let initialOwnerBalance;
  let initialOwnerNFTs;
  let initialAddr1Balance;
  let unlimitedBalance;

  beforeEach(async function () {
    [owner, addr1, ...addrs] = await ethers.getSigners();

    // Deploy WispToken.sol
    const initialSupply = ethers.utils.parseUnits("100000000000", 18);
    initialAddr1Balance = ethers.utils.parseUnits("100", 18);
    initialOwnerBalance = initialSupply.sub(initialAddr1Balance);
    unlimitedBalance = ethers.BigNumber.from(2).pow(256).sub(1);
    _wispToken = await ethers.getContractFactory("WispToken");
    wispToken = await _wispToken.deploy(initialSupply);
    await wispToken.transfer(addr1.address, initialAddr1Balance);

    // Deploy WispToken.sol
    _treasureNFT = await ethers.getContractFactory("TreasureNFT");
    treasureNFT = await _treasureNFT.deploy();

    // Deploy WispToken.sol
    _merchant = await ethers.getContractFactory("Merchant");
    merchant = await _merchant.deploy(wispToken.address, treasureNFT.address);

    // Mint 2 NFTs with owner
    await treasureNFT.mintTresure(owner.address, "Token URI");
    await treasureNFT.mintTresure(owner.address, "Token URI");
    tokenId1 = await treasureNFT.tokenOfOwnerByIndex(owner.address, 0);
    tokenId2 = await treasureNFT.tokenOfOwnerByIndex(owner.address, 1);
    initialOwnerNFTs = await treasureNFT.balanceOf(owner.address);
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
      // Approve Merchant and place 1 order
      await treasureNFT.setApprovalForAll(merchant.address, true);
      await merchant.placeOrder(tokenId1, 100);

      // Check the results
      const ownerNFTs = await treasureNFT.balanceOf(owner.address);
      const ownerOrders = await merchant.ordersOf(owner.address);
      await expect(ownerNFTs).to.equal(initialOwnerNFTs.sub(1));
      await expect(ownerOrders).to.equal(1);
    });

    it("Should fail if place a new order without approval", async function () {
      await expect(merchant.placeOrder(tokenId1, 100))
        .to.be.revertedWith("TreasureNFT: contract not approved");
      const ownerNfts = await treasureNFT.balanceOf(owner.address);
      await expect(ownerNfts).to.equal(initialOwnerNFTs);
    });

    it("Should emit an event after successfully placing an order", async function () {
      // Approve Merchant
      await treasureNFT.setApprovalForAll(merchant.address, true);

      // Check the results
      await expect(merchant.placeOrder(tokenId1, 100))
        .to.emit(merchant, "OrderPlaced")
        .withArgs(owner.address, tokenId1);
    });
  });

  describe("Get orders", function () {
    it("Should return the order details", async function () {
      // Approve Merchant and place 2 orders
      await treasureNFT.setApprovalForAll(merchant.address, true);
      await merchant.placeOrder(tokenId1, 100);
      await merchant.placeOrder(tokenId2, 200);

      // Check the results
      const order1 = await merchant.orderOfOwnerByIndex(owner.address, 0);
      await expect(order1.tokenId).to.equal(tokenId1);
      await expect(order1.price).to.equal(100);
      const order2 = await merchant.orderOfOwnerByIndex(owner.address, 1);
      await expect(order2.tokenId).to.equal(tokenId2);
      await expect(order2.price).to.equal(200);
    });
  });

  describe("Cancel orders", function () {
    it("Should cancel an existing order", async function () {
      // Approve Merchant, place 2 orders and cancel one
      await treasureNFT.setApprovalForAll(merchant.address, true);
      await merchant.placeOrder(tokenId1, 100);
      await merchant.placeOrder(tokenId2, 200);
      await merchant.cancelOrderByIndex(0);

      // Check the results
      const ownerNfts = await treasureNFT.balanceOf(owner.address);
      await expect(ownerNfts).to.equal(initialOwnerNFTs.sub(1));
      const ownerOrders = await merchant.ordersOf(owner.address);
      await expect(ownerOrders).to.equal(1);
      const order2 = await merchant.orderOfOwnerByIndex(owner.address, 0);
      await expect(order2.tokenId).to.equal(tokenId2);
      await expect(order2.price).to.equal(200);
    });

    it("Should fail if canceling a non existing order", async function () {
      await expect(merchant.cancelOrderByIndex(0))
        .to.be.revertedWith("No order available");
    });

    it("Should fail if provide a bad index", async function () {
      // Approve Merchant and place 1 order
      await treasureNFT.setApprovalForAll(merchant.address, true);
      await merchant.placeOrder(tokenId1, 100);

      // Check the results
      await expect(merchant.cancelOrderByIndex(1))
        .to.be.revertedWith("Index out of range");
    });

    it("Should emit an event after successfully canceling an order", async function () {
      // Approve Merchant and place 1 order
      await treasureNFT.setApprovalForAll(merchant.address, true);
      await merchant.placeOrder(tokenId1, 100);

      // Check the results
      await expect(merchant.cancelOrderByIndex(0))
        .to.emit(merchant, "OrderCanceled")
        .withArgs(owner.address, tokenId1);
    });
  });

  describe("Execute orders", function () {
    it("Should sell the NFT to the buyer", async function () {
      // Place 1 order and execute it
      await treasureNFT.setApprovalForAll(merchant.address, true);
      const price = initialAddr1Balance;
      await merchant.placeOrder(tokenId1, price);
      await wispToken.connect(addr1).approve(merchant.address, unlimitedBalance);
      await merchant.connect(addr1).buyTreasureOfOwnerByIndex(owner.address, 0);

      // Check the results
      const ownerBalance = await wispToken.balanceOf(owner.address);
      await expect(ownerBalance).to.equal(initialOwnerBalance.add(price));
      const ownerOrders = await merchant.ordersOf(owner.address);
      await expect(ownerOrders).to.equal(0);
      const addr1Balance = await wispToken.balanceOf(addr1.address);
      await expect(addr1Balance).to.equal(initialAddr1Balance.sub(price));
      const addr1Nfts = await treasureNFT.balanceOf(addr1.address);
      await expect(addr1Nfts).to.equal(1);
    });

    it("Should not sell the NFT if the buyer has not approved the contract", async function () {
      // Place 1 order
      await treasureNFT.setApprovalForAll(merchant.address, true);
      const price = initialAddr1Balance;
      await merchant.placeOrder(tokenId1, price);

      // Check the results
      await expect(merchant.connect(addr1).buyTreasureOfOwnerByIndex(owner.address, 0))
        .to.be.revertedWith("WispToken: contract not approved");
      const ownerBalance = await wispToken.balanceOf(owner.address);
      await expect(ownerBalance).to.equal(initialOwnerBalance);
      const ownerOrders = await merchant.ordersOf(owner.address);
      await expect(ownerOrders).to.equal(1);
      const addr1Balance = await wispToken.balanceOf(addr1.address);
      await expect(addr1Balance).to.equal(initialAddr1Balance);
      const addr1Nfts = await treasureNFT.balanceOf(addr1.address);
      await expect(addr1Nfts).to.equal(0);

    });

    it("Should not sell the NFT if the buyer has not enough WISP", async function () {
      /// Place 1 order
      await treasureNFT.setApprovalForAll(merchant.address, true);
      const price = initialAddr1Balance.add(1);
      await merchant.placeOrder(tokenId1, price);
      await wispToken.connect(addr1).approve(merchant.address, unlimitedBalance);

      // Check the results
      await expect(merchant.connect(addr1).buyTreasureOfOwnerByIndex(owner.address, 0))
        .to.be.revertedWith("ERC20: transfer amount exceeds balance");
      const ownerBalance = await wispToken.balanceOf(owner.address);
      await expect(ownerBalance).to.equal(initialOwnerBalance);
      const ownerOrders = await merchant.ordersOf(owner.address);
      await expect(ownerOrders).to.equal(1);
      const addr1Balance = await wispToken.balanceOf(addr1.address);
      await expect(addr1Balance).to.equal(initialAddr1Balance);
      const addr1Nfts = await treasureNFT.balanceOf(addr1.address);
      await expect(addr1Nfts).to.equal(0);
    });
  });
});
