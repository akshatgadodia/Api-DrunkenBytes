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
      description: "This is a Warranty Card",
      image: "ipfs://QmWvHbUYRZEUr4hx617nBiCsH2zrAGMBbLxJZEUpzwa6hh",
      name: "Warranty Card",
      attributes: [
        { trait_type: "Seller Name", value: values.sellerName },
        { trait_type: "Product Name", value: values.productName },
        { trait_type: "Brand Name", value: values.brandName },
        { trait_type: "Product Id", value: values.productId },
        { trait_type: "Buyer Name", value: values.buyerName },
        { trait_type: "Expiry Date", value: values.warrantyExpireDate },
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