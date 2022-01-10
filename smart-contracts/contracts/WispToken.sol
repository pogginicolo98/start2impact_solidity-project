// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


/**
 * @title The wisp token
 */
contract WispToken is ERC20 {
  /// @param initialSupply The initial supply of the token
  constructor(uint256 initialSupply) ERC20("Wisp", "WISP") {
    _mint(msg.sender, initialSupply);
  }
}
