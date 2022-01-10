// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./WispToken.sol";
import "./TreasureNFT.sol";
import "./interfaces/IMarketplaceNFT.sol";

contract AcceptableTokens {
  WispToken public wisp;

  constructor(WispToken contractAddress) {
    wisp = contractAddress;
  }
}

contract AcceptableNFTs {
  TreasureNFT public trs;

  constructor(TreasureNFT contractAddress) {
    trs = contractAddress;
  }
}

abstract contract MarketplaceNFT is IMarketplaceNFT, AcceptableTokens, AcceptableNFTs {
  mapping(address => Sale[]) internal sales;

  /// @inheritdoc IMarketplaceNFT
  function sellItem(uint256 _tokenId, uint256 _price)
    external
    override
    onlyTrsApproved(msg.sender, _tokenId)
  {
    trs.transferFrom(msg.sender, address(this), _tokenId);
    sales[msg.sender].push(Sale({
      tokenId: _tokenId,
      price: _price
    }));
    emit SaleCreated(msg.sender, _tokenId);
  }

  /// @inheritdoc IMarketplaceNFT
  function salesOf(address owner)
    external
    view
    override
    returns (uint256 _sales)
  {
    _sales = sales[owner].length;
  }

  /// @inheritdoc IMarketplaceNFT
  function cancelSaleByIndex(uint256 index)
    external
    override
    onlyExistingSales(msg.sender)
    onlyValidIndex(msg.sender, index)
  {
    uint256 _tokenId = sales[msg.sender][index].tokenId;
    sales[msg.sender][index] = sales[msg.sender][sales[msg.sender].length - 1];
    sales[msg.sender].pop();
    trs.transferFrom(address(this), msg.sender, _tokenId);
    emit SaleCanceled(msg.sender, _tokenId);
  }

  /// @inheritdoc IMarketplaceNFT
  function saleOfOwnerByIndex(address owner, uint256 index)
    external
    view
    override
    onlyExistingSales(owner)
    onlyValidIndex(owner, index)
    returns (uint256 _tokenId, uint256 _price)
  {
    _tokenId = sales[owner][index].tokenId;
    _price = sales[owner][index].price;
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
    uint256 _tokenId = sales[owner][index].tokenId;
    sales[owner][index] = sales[owner][sales[owner].length - 1];
    sales[owner].pop();
    wisp.transferFrom(msg.sender, owner, amount);
    trs.transferFrom(address(this), msg.sender, _tokenId);
    emit ItemSold(owner, msg.sender, _tokenId);
  }

  modifier onlyTrsApproved(address _owner, uint256 _tokenId) {
    require(
      trs.isApprovedForAll(_owner, address(this)) == true || trs.getApproved(_tokenId) == address(this),
      "TreasureNFT: contract not approved"
    );
    _;
  }

  modifier onlyWispApproved(address _buyer, address _seller, uint256 _index) {
    require(
      wisp.allowance(_buyer, address(this)) >= sales[_seller][_index].price,
      "WispToken: contract not approved"
    );
    _;
  }

  modifier onlyExistingSales(address _owner) {
    require(
      sales[_owner].length > 0,
      "No sales available"
    );
    _;
  }

  modifier onlyValidIndex(address _owner, uint256 _index) {
    require(
      _index < sales[_owner].length,
      "Index out of range"
    );
    _;
  }
}

/**
 * @dev WISP token faucet
 */
contract Merchant is MarketplaceNFT {
  constructor(WispToken wispcontract, TreasureNFT trsContract) AcceptableTokens(wispcontract) AcceptableNFTs(trsContract) {}
}
