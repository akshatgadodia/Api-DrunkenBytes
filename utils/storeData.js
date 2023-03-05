const axios = require('axios');

const saveDataOnIPFS = async values => {
  try {
    const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.PINATA_JWT}`
        }
      };
    const NFTData = {
      description: "A warranty card NFT is a unique digital asset that represents a warranty for a physical product or service. It is created and stored on a blockchain network, which ensures its authenticity and traceability. The owner of the warranty card NFT can use it to claim their warranty in case of any defects or issues with the product. The NFT can also be traded or sold on various NFT marketplaces, providing a new level of flexibility and liquidity to the traditional warranty process. Overall, the warranty card NFT is a revolutionary concept that combines the benefits of blockchain technology with traditional warranties, providing an enhanced user experience for both buyers and sellers.",
      image: "ipfs://QmWvHbUYRZEUr4hx617nBiCsH2zrAGMBbLxJZEUpzwa6hh",
      external_url: `https://claims.drunkenbytes.vercel.app/${tokenId}`, 
      name: "Warranty Card",
      attributes: [
        { trait_type: "Token ID", value: values.tokenId.toString() },
        { trait_type: "Seller Name", value: values.sellerName },
        { trait_type: "Product Name", value: values.productName },
        { trait_type: "Brand Name", value: values.brandName },
        { trait_type: "Product Id", value: values.productId },
        { trait_type: "Buyer Name", value: values.buyerName },
        { display_type: "date", trait_type: "Expiry Date", value: values.warrantyExpireDate },
        { trait_type: "Token Standard", value: "ERC721" }
      ]
    };
    const data = JSON.stringify({
      pinataOptions: { cidVersion: 1 },
      pinataMetadata: {
        name: "Warranty Card Data",
        keyvalues: { customKey: "customValue", customKey2: "customValue2" }
      },
      pinataContent: NFTData
    });
    const result = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      data,
      config
    );
    return `https://gateway.pinata.cloud/ipfs/${result.data.IpfsHash}`;
  } catch (err) {
    throw err
  }
};

module.exports = { saveDataOnIPFS };


/*
 try {
    const result = await saveDataOnIFPS(req.body);
    res.json({ result });
  } catch (err) {
    console.log(err);
  }
*/