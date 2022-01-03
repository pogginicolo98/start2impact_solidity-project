// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./WispToken.sol";


/**
 * @dev WISP token faucet
 */
contract WelcomeChest {
    WispToken public wispContract;

    constructor(WispToken _wispContract) {
        wispContract = _wispContract;
    }

    event Sent(address to, uint256 amount);

    /**
     * @dev Send 1000 WISP to the specified address
     */
    function request(address beneficiary) external {
        uint256 amount = 1000 * 10**18;
        require(wispContract.balanceOf(address(this)) >= amount, "Insufficient funds");
        wispContract.transfer(beneficiary, amount);
        emit Sent(beneficiary, amount);
    }
}
