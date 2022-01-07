// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./WispToken.sol";
import "./TreasureNFT.sol";


/**
 * @dev WISP token faucet
 */
contract Merchant {
    WispToken public wispContract;
    TreasureNFT public treasureContract;
    struct Order {
      uint256 tokenId;
      uint256 price;
    }
    mapping(address => Order[]) public orders;

    constructor(WispToken _wispContract, TreasureNFT _treasureContract) {
        wispContract = _wispContract;
        treasureContract = _treasureContract;
    }

    modifier onlyTresureNFTApproved(uint256 _tokenId) {
      require(
        treasureContract.getApproved(_tokenId) == address(this),
        "TreasureNFT not approved."
      );
      _;
    }

    modifier onlyWispTokenApproved(address _buyer, address _seller, uint256 _index) {
      require(
        wispContract.allowance(_buyer, address(this)) >= orders[_seller][_index].price,
        "Insufficient approved balance."
      );
      _;
    }

    modifier onlyExistingOrders(address _owner) {
      require(
        orders[_owner].length > 0,
        "No order available."
      );
      _;
    }

    modifier onlyValidIndex(address _owner, uint256 _index) {
      require(
        _index < orders[_owner].length,
        "Index out of range."
      );
      _;
    }

    event OrderPlaced(address by, uint256 tokenId);
    event OrderCanceled(address by, uint256 tokenId);
    event Sold(address to, uint256 tokenId);
    // event Withdrawn(address by, uint256 amount);

    function placeOrder(uint256 tokenId, uint256 price)
      external
      onlyTresureNFTApproved(tokenId)
    {
      treasureContract.transferFrom(msg.sender, address(this), tokenId);
      orders[msg.sender].push(Order({
        tokenId: tokenId,
        price: price
      }));
      emit OrderPlaced(msg.sender, tokenId);
    }

    function ordersOf(address owner)
      external
      view
      returns (uint256 numberOfOrders)
    {
      numberOfOrders = orders[owner].length;
    }

    function cancelOrderByIndex(uint256 index)
      external
      onlyExistingOrders(msg.sender)
      onlyValidIndex(msg.sender, index)
    {
      uint256 tokenId = orders[msg.sender][index].tokenId;
      orders[msg.sender][index] = orders[msg.sender][orders[msg.sender].length - 1];
      orders[msg.sender].pop();
      treasureContract.transferFrom(address(this), msg.sender, tokenId);
      emit OrderCanceled(msg.sender, tokenId);
    }

    function orderOfOwnerByIndex(address owner, uint256 index)
      external
      view
      onlyExistingOrders(owner)
      onlyValidIndex(owner, index)
      returns (uint256 tokenId, uint256 price)
    {
      tokenId = orders[owner][index].tokenId;
      price = orders[owner][index].price;
    }

    function buyTreasureOfOwnerByIndex(address seller, uint256 index)
      external
      onlyExistingOrders(seller)
      onlyValidIndex(seller, index)
      onlyWispTokenApproved(msg.sender, seller, index)
    {
      uint256 amount = orders[seller][index].price;
      uint256 tokenId = orders[seller][index].tokenId;
      orders[seller][index] = orders[seller][orders[seller].length - 1];
      orders[seller].pop();
      wispContract.transferFrom(msg.sender, seller, amount);
      treasureContract.transferFrom(address(this), msg.sender, tokenId);
      emit Sold(msg.sender, tokenId);
    }
}
