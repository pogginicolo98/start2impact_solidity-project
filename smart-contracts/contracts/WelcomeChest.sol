// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./WispToken.sol";


/**
 * @dev WISP token faucet
 */
contract WelcomeChest {
    WispToken wispContract;

    constructor(WispToken _wispContract) {
        wispContract = _wispContract;
    }

    event Sent(address to, uint amount);

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
