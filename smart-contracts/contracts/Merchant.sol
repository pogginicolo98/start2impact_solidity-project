// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./WispToken.sol";
import "./TreasureNFT.sol";


/**
 * @dev WISP token faucet
 */
contract WelcomeChest {
    WispToken public wispContract;
    TreasureNft public treasureContract;
    struct Order {
      uint256 tokenId;
      uint256 price;
    }
    mapping(address => Order[]) public Orders;

    constructor(WispToken _wispContract, TreasureNft _treasureContract) {
        wispContract = _wispContract;
        treasureContract = _treasureContract;
    }

    event OrderPlaced(address by, uint256 tokenId);
    event OrderCanceled(address by, uint256 tokenId);
    event Sold(address to, uint256 tokenId);
    event Withdrawn(address by, uint256 amount);

    function placeOrder(uint256 tokenId, uint256 price) external {
      treasureContract.transferFrom(msg.sender, address(this), tokenId);
      Orders[msg.sender].push(Bid({
        tokenId: tokenId,
        price: price
      }));
    }

    /**
     * @dev Send 1000 WISP to the specified address
     */
    function request(address beneficiary) external {
        uint amount = 1000 * 10**18;
        require(wispContract.balanceOf(address(this)) >= amount, "Insufficient funds");
        wispContract.transfer(beneficiary, amount);
        emit Sent(beneficiary, amount);
    }
}
