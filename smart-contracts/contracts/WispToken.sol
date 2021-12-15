// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @dev Implementation of Openzeppelin's ERC20 contract
 */
contract WispToken is ERC20 {
    /**
     * @param initialSupply The initial supply of the token
     */
    constructor(uint256 initialSupply) ERC20("Wisp", "WISP") {
        _mint(msg.sender, initialSupply);
    }
}
