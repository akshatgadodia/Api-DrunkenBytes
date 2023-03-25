const axios = require('axios');

const saveDataOnIPFS = async values => {
  try {
    const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.PINATA_JWT}`
        }
      };
    const attributes = [
      { trait_type: "Token ID", value: values.tokenId.toString() },
      { trait_type: "Created By", value: values.sellerName },
      { display_type: "date", trait_type: "Date Created", value: new Date().toISOString() },
      { trait_type: "Token Standard", value: "ERC721" }
    ]
    values.traits.forEach((element)=>{
      const object = { trait_type: element.key, value: element.value }
      attributes.push(object);
    })
    const NFTData = {
      description: "A warranty card NFT is a unique digital asset that represents a warranty for a physical product or service. It is created and stored on a blockchain network, which ensures its authenticity and traceability. The owner of the warranty card NFT can use it to claim their warranty in case of any defects or issues with the product. The NFT can also be traded or sold on various NFT marketplaces, providing a new level of flexibility and liquidity to the traditional warranty process. Overall, the warranty card NFT is a revolutionary concept that combines the benefits of blockchain technology with traditional warranties, providing an enhanced user experience for both buyers and sellers.",
      image: values.useCustomImage ? values.imageBase64 : "ipfs://QmWvHbUYRZEUr4hx617nBiCsH2zrAGMBbLxJZEUpzwa6hh",
      external_url: `https://drunkenbytes.vercel.app/raise-issue/${values.tokenId}`, 
      name: values.nftName,
      attributes
    };
    const data = JSON.stringify({
      pinataOptions: { cidVersion: 1 },
      pinataMetadata: {
        name: `${values.nftName} Data - ${values.tokenId}`,
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