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
    await treasureNFT.mint(owner.address, "Token URI");
    await treasureNFT.mint(owner.address, "Token URI");
    tokenId1 = await treasureNFT.tokenOfOwnerByIndex(owner.address, 0);
    tokenId2 = await treasureNFT.tokenOfOwnerByIndex(owner.address, 1);
    initialOwnerNFTs = await treasureNFT.balanceOf(owner.address);
  });

  describe("Deployment", function () {
    it("Should set the right WispToken contract address", async function () {
      const wisp = await merchant.wisp();
      await expect(wisp).to.equal(wispToken.address);
    });

    it("Should set the right TreasureNFT contract address", async function () {
      const trs = await merchant.trs();
      await expect(trs).to.equal(treasureNFT.address);
    });
  });

  describe("Sales creation", function () {
    it("Should create a sale", async function () {
      // Approve Merchant and place 1 order
      await treasureNFT.setApprovalForAll(merchant.address, true);
      await merchant.sellItem(tokenId1, 100);

      // Check the results
      const ownerNFTs = await treasureNFT.balanceOf(owner.address);
      const ownerSales = await merchant.salesOf(owner.address);
      await expect(ownerNFTs).to.equal(initialOwnerNFTs.sub(1));
      await expect(ownerSales).to.equal(1);
    });

    it("Should fail if create a sale without approving the NFT contract", async function () {
      await expect(merchant.sellItem(tokenId1, 100))
        .to.be.revertedWith("TreasureNFT: contract not approved");
      const ownerNfts = await treasureNFT.balanceOf(owner.address);
      await expect(ownerNfts).to.equal(initialOwnerNFTs);
    });

    it("Should emit an event after successfully creating a sale", async function () {
      // Approve Merchant
      await treasureNFT.setApprovalForAll(merchant.address, true);

      // Check the results
      await expect(merchant.sellItem(tokenId1, 100))
        .to.emit(merchant, "SaleCreated")
        .withArgs(owner.address, tokenId1);
    });
  });

  describe("Sales retrieve", function () {
    it("Should return the number of active sales", async function () {
      // Approve Merchant and place 2 orders
      await treasureNFT.setApprovalForAll(merchant.address, true);
      await merchant.sellItem(tokenId1, 100);
      await merchant.sellItem(tokenId2, 200);

      // Check the results
      const sales = await merchant.salesOf(owner.address);
      await expect(sales).to.equal(2);
    });

    it("Should return the details of the selected sale", async function () {
      // Approve Merchant and place 2 orders
      await treasureNFT.setApprovalForAll(merchant.address, true);
      await merchant.sellItem(tokenId1, 100);
      await merchant.sellItem(tokenId2, 200);

      // Check the results
      const sale1 = await merchant.saleOfOwnerByIndex(owner.address, 0);
      await expect(sale1.tokenId).to.equal(tokenId1);
      await expect(sale1.price).to.equal(100);
      const sale2 = await merchant.saleOfOwnerByIndex(owner.address, 1);
      await expect(sale2.tokenId).to.equal(tokenId2);
      await expect(sale2.price).to.equal(200);
    });

    it("Should fail if retrieving a non existing sale", async function () {
      await expect(merchant.saleOfOwnerByIndex(owner.address, 0))
        .to.be.revertedWith("No sales available");
    });

    it("Should fail if provide a bad index", async function () {
      // Approve Merchant and place 1 order
      await treasureNFT.setApprovalForAll(merchant.address, true);
      await merchant.sellItem(tokenId1, 100);

      // Check the results
      await expect(merchant.saleOfOwnerByIndex(owner.address, 1))
        .to.be.revertedWith("Index out of range");
    });
  });

  describe("Sales cancellation", function () {
    it("Should cancel an existing sale", async function () {
      // Approve Merchant, place 2 orders and cancel one
      await treasureNFT.setApprovalForAll(merchant.address, true);
      await merchant.sellItem(tokenId1, 100);
      await merchant.sellItem(tokenId2, 200);
      await merchant.cancelSaleByIndex(0);

      // Check the results
      const ownerNfts = await treasureNFT.balanceOf(owner.address);
      await expect(ownerNfts).to.equal(initialOwnerNFTs.sub(1));
      const ownerSales = await merchant.salesOf(owner.address);
      await expect(ownerSales).to.equal(1);
      const sale2 = await merchant.saleOfOwnerByIndex(owner.address, 0);
      await expect(sale2.tokenId).to.equal(tokenId2);
      await expect(sale2.price).to.equal(200);
    });

    it("Should fail if canceling a non existing sale", async function () {
      await expect(merchant.cancelSaleByIndex(0))
        .to.be.revertedWith("No sales available");
    });

    it("Should fail if provide a bad index", async function () {
      // Approve Merchant and place 1 order
      await treasureNFT.setApprovalForAll(merchant.address, true);
      await merchant.sellItem(tokenId1, 100);

      // Check the results
      await expect(merchant.cancelSaleByIndex(1))
        .to.be.revertedWith("Index out of range");
    });

    it("Should emit an event after successfully canceling a sale", async function () {
      // Approve Merchant and place 1 order
      await treasureNFT.setApprovalForAll(merchant.address, true);
      await merchant.sellItem(tokenId1, 100);

      // Check the results
      await expect(merchant.cancelSaleByIndex(0))
        .to.emit(merchant, "SaleCanceled")
        .withArgs(owner.address, tokenId1);
    });
  });

  describe("Sales executions", function () {
    it("Should sell the NFT to the buyer", async function () {
      // Place 1 order and execute it
      await treasureNFT.setApprovalForAll(merchant.address, true);
      const price = initialAddr1Balance;
      await merchant.sellItem(tokenId1, price);
      await wispToken.connect(addr1).approve(merchant.address, unlimitedBalance);
      await merchant.connect(addr1).buyItemOfOwnerByIndex(owner.address, 0);

      // Check the results
      const ownerBalance = await wispToken.balanceOf(owner.address);
      await expect(ownerBalance).to.equal(initialOwnerBalance.add(price));
      const ownerSales = await merchant.salesOf(owner.address);
      await expect(ownerSales).to.equal(0);
      const addr1Balance = await wispToken.balanceOf(addr1.address);
      await expect(addr1Balance).to.equal(initialAddr1Balance.sub(price));
      const addr1Nfts = await treasureNFT.balanceOf(addr1.address);
      await expect(addr1Nfts).to.equal(1);
    });

    it("Should fail if the buyer has not approved the ERC20 token contract", async function () {
      // Place 1 order
      await treasureNFT.setApprovalForAll(merchant.address, true);
      const price = initialAddr1Balance;
      await merchant.sellItem(tokenId1, price);

      // Check the results
      await expect(merchant.connect(addr1).buyItemOfOwnerByIndex(owner.address, 0))
        .to.be.revertedWith("WispToken: contract not approved");
      const ownerBalance = await wispToken.balanceOf(owner.address);
      await expect(ownerBalance).to.equal(initialOwnerBalance);
      const ownerSales = await merchant.salesOf(owner.address);
      await expect(ownerSales).to.equal(1);
      const addr1Balance = await wispToken.balanceOf(addr1.address);
      await expect(addr1Balance).to.equal(initialAddr1Balance);
      const addr1Nfts = await treasureNFT.balanceOf(addr1.address);
      await expect(addr1Nfts).to.equal(0);

    });

    it("Should fail if the buyer has not enough ERC20 tokens", async function () {
      /// Place 1 order
      await treasureNFT.setApprovalForAll(merchant.address, true);
      const price = initialAddr1Balance.add(1);
      await merchant.sellItem(tokenId1, price);
      await wispToken.connect(addr1).approve(merchant.address, unlimitedBalance);

      // Check the results
      await expect(merchant.connect(addr1).buyItemOfOwnerByIndex(owner.address, 0))
        .to.be.revertedWith("ERC20: transfer amount exceeds balance");
      const ownerBalance = await wispToken.balanceOf(owner.address);
      await expect(ownerBalance).to.equal(initialOwnerBalance);
      const ownerSales = await merchant.salesOf(owner.address);
      await expect(ownerSales).to.equal(1);
      const addr1Balance = await wispToken.balanceOf(addr1.address);
      await expect(addr1Balance).to.equal(initialAddr1Balance);
      const addr1Nfts = await treasureNFT.balanceOf(addr1.address);
      await expect(addr1Nfts).to.equal(0);
    });

    it("Should emit an event after succesfully selling the NFT", async function () {
      // Place 1 order and execute it
      await treasureNFT.setApprovalForAll(merchant.address, true);
      const price = initialAddr1Balance;
      await merchant.sellItem(tokenId1, price);
      await wispToken.connect(addr1).approve(merchant.address, unlimitedBalance);

      // Check the results
      await expect(merchant.connect(addr1).buyItemOfOwnerByIndex(owner.address, 0))
        .to.emit(merchant, "ItemSold")
        .withArgs(owner.address, addr1.address, tokenId1);
    });
  });
});
