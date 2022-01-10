// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/IERC20Faucet.sol";
import "./WispToken.sol";


/**
 * @title The acceptable tokens
 * @notice ERC20 contracts supported for payment
 */
contract SupportedTokens {
  WispToken public wisp;

  constructor(WispToken contractAddress) {
    wisp = contractAddress;
  }
}


/**
 * @title The ERC20 faucet
 * @notice Faucet that sends ERC20 tokens for free to the sender of the request
 */
abstract contract ERC20Faucet is IERC20Faucet, SupportedTokens {
  /// @dev Amout to transfer per request: 1000 WISP
  uint256 public amount = 1000 * 10**18;

  /// @inheritdoc IERC20Faucet
  function requestTokens(address beneficiary)
    external
    override
    onlyAvailableFunds(amount)
  {
    wisp.transfer(beneficiary, amount);
    emit TokensSent(beneficiary, amount);
  }

  /**
   * @dev Allows execution only if there are sufficient funds available
   *
   * @param _amount The amount available needed
   */
  modifier onlyAvailableFunds(uint256 _amount) {
    require(
      wisp.balanceOf(address(this)) >= _amount,
      "Insufficient funds"
    );
    _;
  }
}


/**
 * @title The welcome chest
 */
contract WelcomeChest is ERC20Faucet {
  constructor(WispToken wispContract) SupportedTokens(wispContract) {}
}
