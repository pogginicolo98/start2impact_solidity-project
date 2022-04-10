// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/IMarketplaceNFT.sol";
import "./WispToken.sol";
import "./TreasureNFT.sol";


struct Sale {
  uint256 tokenId;
  uint256 price;
}


library IterableMapping {
  // Iterable mapping from address to uint;
  struct Map {
    address[] keys;
    mapping(address => Sale[]) values;
    mapping(address => uint) indexOf;
    mapping(address => bool) inserted;
  }

  function get(Map storage map, address key) public view returns (Sale[] memory) {
    return map.values[key];
  }

  function getKeyAtIndex(Map storage map, uint index) public view returns (address) {
    return map.keys[index];
  }

  function size(Map storage map) public view returns (uint) {
    return map.keys.length;
  }

  function set(Map storage map, address key, Sale calldata val) public {
    if (map.inserted[key]) {
      map.values[key].push(val);
    } else {
      map.inserted[key] = true;
      map.values[key].push(val);
      map.indexOf[key] = map.keys.length;
      map.keys.push(key);
    }
  }

  function remove(Map storage map, address key, uint256 indexValue) public {
    if (!map.inserted[key]) {
      return;
    }

    if (map.values[key].length == 1) {
      delete map.inserted[key];
      delete map.values[key];

      uint index = map.indexOf[key];
      uint lastIndex = map.keys.length - 1;
      address lastKey = map.keys[lastIndex];

      map.indexOf[lastKey] = index;
      delete map.indexOf[key];

      map.keys[index] = lastKey;
      map.keys.pop();

      return;
    }

    map.values[key][indexValue] = map.values[key][map.values[key].length -1];
    map.values[key].pop();
  }
}


/**
 * @title The acceptable tokens
 * @notice ERC20 contracts supported for payment
 */
contract SupportedTokens {
  WispToken public wisp;

  /// @param contractAddress WispToken.sol address
  constructor(WispToken contractAddress) {
    wisp = contractAddress;
  }
}


/**
 * @title The acceptable NFTs
 * @notice ERC721 contracts supported for sales
 */
contract SupportedNFTs {
  TreasureNFT public trs;

  /// @param contractAddress TreasureNFT.sol address
  constructor(TreasureNFT contractAddress) {
    trs = contractAddress;
  }
}


/**
 * @title The NFT marketplace
 * @notice Marketplace that allows the sale of ERC721 NFTs via ERC20 tokens
 */
abstract contract MarketplaceNFT is IMarketplaceNFT, SupportedTokens, SupportedNFTs {
  using IterableMapping for IterableMapping.Map;
  IterableMapping.Map internal sales;

  /// @inheritdoc IMarketplaceNFT
  function sellItem(uint256 tokenId, uint256 price)
    external
    override
    onlyTrsApproved(msg.sender, tokenId)
  {
    trs.transferFrom(msg.sender, address(this), tokenId);
    sales.set(msg.sender, Sale({
        tokenId: tokenId,
        price: price
      })
    );
    emit SaleCreated(msg.sender, tokenId);
  }

  /// @inheritdoc IMarketplaceNFT
  function salesOf(address owner)
    external
    view
    override
    returns (uint256 salesNum)
  {
    salesNum = sales.get(owner).length;
  }

  /// @inheritdoc IMarketplaceNFT
  function cancelSaleByIndex(uint256 index)
    external
    override
    onlyExistingSales(msg.sender)
    onlyValidIndex(msg.sender, index)
  {

    uint256 tokenId = sales.get(msg.sender)[index].tokenId;
    sales.remove(msg.sender, index);
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
    tokenId = sales.get(owner)[index].tokenId;
    price = sales.get(owner)[index].price;
  }

  /// @inheritdoc IMarketplaceNFT
  function buyItemOfOwnerByIndex(address owner, uint256 index)
    external
    override
    onlyExistingSales(owner)
    onlyValidIndex(owner, index)
    onlyWispApproved(msg.sender, owner, index)
    onlySufficientBalance(msg.sender, owner, index)
  {
    uint256 amount = sales.get(owner)[index].price;
    uint256 tokenId = sales.get(owner)[index].tokenId;
    sales.remove(owner, index);
    wisp.transferFrom(msg.sender, owner, amount);
    trs.transferFrom(address(this), msg.sender, tokenId);
    emit ItemSold(owner, msg.sender, tokenId);
  }

  /// @inheritdoc IMarketplaceNFT
  function totalSellers() external view override returns(uint256 sellersNum) {
    sellersNum = sales.size();
  }

  /// @inheritdoc IMarketplaceNFT
  function sellerByIndex(uint256 index) external view override returns(address seller) {
    seller = sales.getKeyAtIndex(index);
  }

  /**
   * @dev Allows execution only if the NFT of the owner has been approved for Merchant
   *
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
   *
   * @param _buyer The address of the buyer of the NFT
   * @param _seller The address of the owner of the NFT
   * @param _index The index representative of the sale of the owner
   */
  modifier onlyWispApproved(address _buyer, address _seller, uint256 _index) {
    require(
      wisp.allowance(_buyer, address(this)) >= sales.get(_seller)[_index].price,
      "WispToken: contract not approved"
    );
    _;
  }

  /**
   * @dev Allows execution only if the buyer has at least the required amount of ERC20 tokens
   *
   * @param _buyer The address of the buyer of the NFT
   * @param _seller The address of the owner of the NFT
   * @param _index The index representative of the sale of the owner
   */
  modifier onlySufficientBalance(address _buyer, address _seller, uint256 _index) {
    require(
      wisp.balanceOf(_buyer) >= sales.get(_seller)[_index].price,
      "WispToken: insufficient balance"
    );
    _;
  }

  /**
   * @dev Allows execution only if there are active sales for a given owner
   *
   * @param _owner The address of the owner of the sale
   */
  modifier onlyExistingSales(address _owner) {
    require(
      sales.get(_owner).length > 0,
      "No sales available"
    );
    _;
  }

  /**
   * @dev Allows execution only if the index provided refers to an existing sale
   *
   * @param _owner The address of the owner of the sale
   * @param _index The index representative of the sale of the owner
   */
  modifier onlyValidIndex(address _owner, uint256 _index) {
    require(
      _index < sales.get(_owner).length,
      "Index out of range"
    );
    _;
  }
}


/**
 * @title The merchant
 */
contract Merchant is MarketplaceNFT {
  /*
   * @param wispContract WispToken.sol address
   * @param trsContract TreasureNFT.sol address
   */
  constructor(WispToken wispContract, TreasureNFT trsContract) SupportedTokens(wispContract) SupportedNFTs(trsContract) {}
}
