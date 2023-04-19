// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.4.0 <0.9.0;
//pragma solidity >=0.7.0 <0.9.0;

import "./NFT.sol";
/**
 * @dev ERC721 token with storage based token URI management.
 */
abstract contract ERC721Soulbound is NFT {
    // Mapping for token soulbounds
    mapping(uint256 => bool) private _soulbound;

    /**
     * @dev See .
     */
    function isSoulbound(uint256 tokenId) public view returns (bool) {
        _requireMinted(tokenId);
        return _soulbound[tokenId];
    }

    /**
     * @dev Sets `_tokenURI` as the tokenURI of `tokenId`.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function _setSoulBound(uint256 tokenId, bool _isSoulbound) internal virtual {
        require(_exists(tokenId), "ERC721URIStorage: URI set of nonexistent token");
        _soulbound[tokenId] = _isSoulbound;
    }

    /**
     * @dev See .
     */
    function _deleteSoulbound(uint256 tokenId) internal  {
         delete _soulbound[tokenId];
    }

}