// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.4.0 <0.9.0;
//pragma solidity >=0.7.0 <0.9.0;

import "./NFT.sol";
import "./ERC721URIStorage.sol";
import "./Counters.sol";


contract NFTCreation is NFT, ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    address public owner ; 

    constructor() NFT("Warranty", "WAR") {
        owner = msg.sender;
    }

    function safeMint(address to, string memory uri) public returns(uint){
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        return tokenId;
    }

    function burnByDeleting(uint256 tokenId) public{
        require(msg.sender== owner, "ERC721: Burning from invalid account");
        _burn(tokenId);
    }

    function burnByTransfering(uint tokenId) public{
        require(msg.sender== owner, "ERC721: Burning from invalid account");
        address NFTOwner = ownerOf(tokenId);
        _transferByOwner(NFTOwner,address(0),tokenId);
    }

    // The following functions are overrides required by Solidity.
    function _burn(uint256 tokenId) internal override(NFT, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(NFT, ERC721URIStorage) returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

}