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

    modifier onlyExistingOrders(uint256 _index) {
      require(
        orders[msg.sender].length > 0,
        "No order available."
      );
      _;
    }

    modifier onlyValidIndex(uint256 _index) {
      require(
        _index < orders[msg.sender].length,
        "Index out of range."
      );
      _;
    }

    event OrderPlaced(address by, uint256 tokenId);
    event OrderCanceled(address by, uint256 tokenId);
    // event Sold(address to, uint256 tokenId);
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
      onlyExistingOrders(index)
      onlyValidIndex(index)
    {
      uint256 tokenId = orders[msg.sender][index].tokenId;
      treasureContract.transferFrom(address(this), msg.sender, tokenId);
      orders[msg.sender][index] = orders[msg.sender][orders[msg.sender].length - 1];
      orders[msg.sender].pop();
      emit OrderCanceled(msg.sender, tokenId);
    }

}
