// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


/**
 * @title The interface for the ERC20Faucet
 * @notice The ERC20Faucet sends ERC20 tokens for free to the sender of the request
 */
interface IERC20Faucet {
  /**
   * @notice Emitted when the tokens have been sent
   *
   * @param to The address that the tokens were sent to
   * @param amount The amount of tokens sent
   */
  event TokensSent(address to, uint256 amount);

  /**
   * @notice It takes custody of a given NFT and creates a sell order with the price provided
   * @dev Sufficient funds must be available before running the code
   *
   * @param beneficiary The address to send the tokens to
   */
  function redeemTokens(address beneficiary) external;
}
