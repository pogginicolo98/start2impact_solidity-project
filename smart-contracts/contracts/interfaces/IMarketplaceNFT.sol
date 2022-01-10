// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title The interface for the MarketplaceNFT
 * @notice The Marketplace NFT allows the sale of ERC721 NFTs via ERC20 tokens
 */
interface IMarketplaceNFT {
  struct Sale {
    uint256 tokenId;
    uint256 price;
  }

  /**
   * @notice Emitted when a sale of an NFT is created
   * @param from The address that created the sale
   * @param tokenId The token ID of the NFT put up for sale
   */
  event SaleCreated(address from, uint256 tokenId);

  /**
   * @notice Emitted when a sale of an NFT is canceled
   * @param from The address that canceled the sale
   * @param tokenId The token ID of the NFT of the canceled sale
   */
  event SaleCanceled(address from, uint256 tokenId);

  /**
   * @notice Emitted when a sale of an NFT is completed
   * @param from The address that put the NFT up for sale
   * @param to The address that purchased the NFT
   * @param tokenId The token ID of the NFT being sold
   */
  event ItemSold(address from, address to, uint256 tokenId);

  /**
   * @notice It takes custody of a given NFT and creates a sell order with the price provided
   * @dev The owner of the NFT must have approved the contract before run the code
   * @param _tokenId The token ID of the NFT put up for sale
   * @param _price The price at which to sell the NFT
   */
  function sellItem(uint256 _tokenId, uint256 _price) external;

  /**
   * @notice Returns the total number of active sales for a given address
   * @param owner The address of the sales owner
   * @return _sales The total number of active sales
   */
  function salesOf(address owner) external view returns (uint256 _sales);

  /**
   * @notice Cancel a sales order for a given index and returns the NFT
   * @dev There must be sales orders belonging to the sender and the index provided
   * must be validated before run the code
   *
   * @param index The index representative of the sale to be canceled
   */
  function cancelSaleByIndex(uint256 index) external;

  /**
   * @notice Returns the details of the sale for a given owner and index
   * @dev There must be sales orders belonging to the owner and the index provided
   * must be validated before run the code
   * @param owner The address of the owner of the sale
   * @param index The index representative of the desired sale
   * @return tokenId The token id of the NFT put up for sale
   * @return price The price of the NFT put up for sale
   */
  function saleOfOwnerByIndex(address owner, uint256 index) external view returns (uint256 tokenId, uint256 price);

  /**
   * @notice Exchange the amount of ERC20 tokens required in the sale in exchange for the desired NFT
   * @dev There must be sales orders belonging to the owner, the index provided
   * must be validated and the sender must have approved the ERC20 token contract before run the code
   *
   * @param owner The address of the owner of the sale
   * @param index The index representative of the desired sale
   */
  function buyItemOfOwnerByIndex(address owner, uint256 index) external;
}
