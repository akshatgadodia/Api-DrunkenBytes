// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.4.0 <0.9.0;
//pragma solidity >=0.7.0 <0.9.0;

import "./NFT.sol";
import "./ERC721URIStorage.sol";
import "./ERC721Soulbound.sol";


contract NFTCreation is NFT, ERC721URIStorage, ERC721Soulbound {

    address public owner; 

    constructor() NFT("Drunken Bytes", "DB") {
        owner = msg.sender;
    }

    /** 
     * @dev See {IERC721-safeTransferFrom}.
     */
    function safeMint(address to, uint tokenId, bool isSoulbound, string memory uri) public returns(uint){
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        _setSoulBound(tokenId, isSoulbound);
        return tokenId;
    }

    /**
     * @dev See {IERC721-safeTransferFrom}.
     */
    function burnByDeleting(uint256 tokenId) public{
        require(msg.sender== owner, "ERC721: Burning from invalid account");
        _burn(tokenId);
    }

    /**
     * @dev See {IERC721-transferFrom}.
     */
    function transferFrom(address from ,address to ,uint256 tokenId) public virtual override {
        //solhint-disable-next-line max-line-length
        // require(!_soulbound[tokenId], "Cannot transfer soulbound token");
        require(!isSoulbound(tokenId), "Cannot transfer soulbound token");
        require(_isApprovedOrOwner(msg.sender, tokenId), "ERC721: caller is not token owner nor approved");
        _transfer(from, to, tokenId);
        _clearApproval(tokenId);
    }

     /**
     * @dev See {IERC721-safeTransferFrom}.
     */
    function safeTransferFrom(address from,address to,uint256 tokenId,bytes memory data) public virtual override {
        require(_isApprovedOrOwner(msg.sender, tokenId), "ERC721: caller is not token owner nor approved");
        // require(!_soulbound[tokenId], "Cannot transfer soulbound token");
        require(!isSoulbound(tokenId), "Cannot transfer soulbound token");
        _safeTransfer(from, to, tokenId, data);
        _clearApproval(tokenId);
    }

    /**
     * @dev See {IERC721-safeTransferFrom}.
     */
    function safeTransferFrom(address from,address to,uint256 tokenId) public virtual override {
        require(_isApprovedOrOwner(msg.sender, tokenId), "ERC721: caller is not token owner nor approved");
        // require(!_soulbound[tokenId], "Cannot transfer soulbound token");
        require(!isSoulbound(tokenId), "Cannot transfer soulbound token");
        safeTransferFrom(from, to, tokenId, "");
        _clearApproval(tokenId);
    }

    /**
     * @dev See {IERC721-safeTransferFrom}.
     */
    function burnByTransfering(uint tokenId) public{
        require(msg.sender == owner, "Cannot transfer to this address");
        _deleteTokenURIs(tokenId);
        _deleteSoulbound(tokenId);
        _clearApproval(tokenId);
        address NFTOwner = ownerOf(tokenId);
        _transferByOwner(NFTOwner, address(0), tokenId);
    }

    // The following functions are overrides required by Solidity.
    function _burn(uint256 tokenId) internal override(NFT) {
        _deleteTokenURIs(tokenId);
        _deleteSoulbound(tokenId);
        _clearApproval(tokenId);
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(NFT, ERC721URIStorage) returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

}