// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


/**
 * @title The treasure NFT
 * @notice Implementation of Openzeppelin's ERC721Enumerable and ERC721URIStorage contracts
 */
contract TreasureNFT is ERC721Enumerable, ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  constructor() ERC721("Treasure", "TRS") {}

  function _beforeTokenTransfer(address from, address to, uint256 tokenId)
    internal
    override(ERC721, ERC721Enumerable)
  {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function _burn(uint256 tokenId)
    internal
    override(ERC721, ERC721URIStorage)
  {
    super._burn(tokenId);
  }

  function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721, ERC721Enumerable)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }

  function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721, ERC721URIStorage)
    returns (string memory)
  {
    return super.tokenURI(tokenId);
  }

  /**
   * @notice Mint a new NFT
   *
   * @param owner The owner of the token being minted
   * @param tokenUri The URI of the token being minted
   * @return tokenId The ID of the token minted
   */
  function mint(address owner, string memory tokenUri)
    public
    returns (uint256 tokenId)
  {
    _tokenIds.increment();
    tokenId = _tokenIds.current();
    _mint(owner, tokenId);
    _setTokenURI(tokenId, tokenUri);
  }
}
