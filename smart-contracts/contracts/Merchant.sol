// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/IMarketplaceNFT.sol";
import "./WispToken.sol";
import "./TreasureNFT.sol";

/**
 * @title The acceptable tokens
 * @notice ERC20 contracts supported for payment
 */
contract AcceptableTokens {
  WispToken public wisp;

  constructor(WispToken contractAddress) {
    wisp = contractAddress;
  }
}

/**
 * @title The acceptable NFTs
 * @notice ERC721 contracts supported for sales
 */
contract AcceptableNFTs {
  TreasureNFT public trs;

  constructor(TreasureNFT contractAddress) {
    trs = contractAddress;
  }
}

/**
 * @title The NFT marketplace
 * @notice Marketplace that allows the sale of ERC721 NFTs via ERC20 tokens
 */
abstract contract MarketplaceNFT is IMarketplaceNFT, AcceptableTokens, AcceptableNFTs {
  /// @dev Set of all sales grouped by owner
  mapping(address => Sale[]) internal sales;

  /// @inheritdoc IMarketplaceNFT
  function sellItem(uint256 tokenId, uint256 price)
    external
    override
    onlyTrsApproved(msg.sender, tokenId)
  {
    trs.transferFrom(msg.sender, address(this), tokenId);
    sales[msg.sender].push(Sale({
      tokenId: tokenId,
      price: price
    }));
    emit SaleCreated(msg.sender, tokenId);
  }

  /// @inheritdoc IMarketplaceNFT
  function salesOf(address owner)
    external
    view
    override
    returns (uint256 salesNum)
  {
    salesNum = sales[owner].length;
  }

  /// @inheritdoc IMarketplaceNFT
  function cancelSaleByIndex(uint256 index)
    external
    override
    onlyExistingSales(msg.sender)
    onlyValidIndex(msg.sender, index)
  {
    uint256 tokenId = sales[msg.sender][index].tokenId;
    sales[msg.sender][index] = sales[msg.sender][sales[msg.sender].length - 1];
    sales[msg.sender].pop();
    trs.transferFrom(address(this), msg.sender, tokenId);
    emit SaleCanceled(msg.sender, tokenId);
  }

  /// @inheritdoc IMarketplaceNFT
  function saleOfOwnerByIndex(address owner, uint256 index)
    external
    view
    override
    onlyExistingSales(owner)
    onlyValidIndex(owner, index)
    returns (uint256 tokenId, uint256 price)
  {
    tokenId = sales[owner][index].tokenId;
    price = sales[owner][index].price;
  }

  /// @inheritdoc IMarketplaceNFT
  function buyItemOfOwnerByIndex(address owner, uint256 index)
    external
    override
    onlyExistingSales(owner)
    onlyValidIndex(owner, index)
    onlyWispApproved(msg.sender, owner, index)
  {
    uint256 amount = sales[owner][index].price;
    uint256 tokenId = sales[owner][index].tokenId;
    sales[owner][index] = sales[owner][sales[owner].length - 1];
    sales[owner].pop();
    wisp.transferFrom(msg.sender, owner, amount);
    trs.transferFrom(address(this), msg.sender, tokenId);
    emit ItemSold(owner, msg.sender, tokenId);
  }

  /**
   * @dev Allows execution only if the NFT of the owner has been approved for Merchant
   * @param _owner The address of the owner of the NFT
   * @param _tokenId The token ID of the NFT
   */
  modifier onlyTrsApproved(address _owner, uint256 _tokenId) {
    require(
      trs.isApprovedForAll(_owner, address(this)) == true || trs.getApproved(_tokenId) == address(this),
      "TreasureNFT: contract not approved"
    );
    _;
  }

  /**
   * @dev Allows execution only if ERC20 tokens of the buyer have been approved for Merchant
   * @param _buyer The address of the buyer of the NFT
   * @param _seller The address of the owner of the NFT
   * @param _index The index representative of the sale of the owner
   */
  modifier onlyWispApproved(address _buyer, address _seller, uint256 _index) {
    require(
      wisp.allowance(_buyer, address(this)) >= sales[_seller][_index].price,
      "WispToken: contract not approved"
    );
    _;
  }

  /**
   * @dev Allows execution only if there are active sales for a given owner
   * @param _owner The address of the owner of the sale
   */
  modifier onlyExistingSales(address _owner) {
    require(
      sales[_owner].length > 0,
      "No sales available"
    );
    _;
  }

  /**
   * @dev Allows execution only if the index provided refers to an existing sale
   * @param _owner The address of the owner of the sale
   * @param _index The index representative of the sale of the owner
   */
  modifier onlyValidIndex(address _owner, uint256 _index) {
    require(
      _index < sales[_owner].length,
      "Index out of range"
    );
    _;
  }
}

/**
 * @title The Merchant
 */
contract Merchant is MarketplaceNFT {
  constructor(WispToken wispcontract, TreasureNFT trsContract) AcceptableTokens(wispcontract) AcceptableNFTs(trsContract) {}
}
