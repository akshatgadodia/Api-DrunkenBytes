const axios = require("axios");

const saveDataOnIPFS = async (values) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
    };
    const attributes = [
      { trait_type: "Token ID", value: values.tokenId.toString() },
      { trait_type: "Created By", value: values.sellerName },
      {
        display_type: "date",
        trait_type: "Date Created",
        value: new Date().toISOString(),
      },
      { trait_type: "Token Standard", value: "ERC721" },
    ];
    values.traits.forEach((element) => {
      const object = { trait_type: element.key, value: element.value };
      attributes.push(object);
    });
    const NFTData = {
      description:
        "Drunken Bytes NFTs are unique digital tokens created by businesses to represent their products and credentials in a verifiable and immutable way. These NFTs are designed to enhance the authenticity and trustworthiness of the products and credentials they represent, and can be used for a variety of purposes such as proof of ownership, verification of authenticity, or as a reward system for loyal customers. Each NFT is unique and can be easily verified on the blockchain, ensuring that it cannot be duplicated or tampered with. By leveraging the power of blockchain technology, Drunken Bytes NFTs offer businesses a new and innovative way to secure their products and credentials, while providing their customers with an added layer of trust and confidence.",
      image: values.useCustomImage
        ? values.imageBase64
        : "ipfs://QmSRGgeJjvo9WPfbmdhn8mMcMgYxcTzT3KdnWdGWtPGdkq",
      external_url: `https://drunkenbytes.vercel.app/raise-issue/${values.tokenId}`,
      name: values.nftName,
      attributes,
    };
    const data = JSON.stringify({
      pinataOptions: { cidVersion: 1 },
      pinataMetadata: {
        name: `${values.nftName} Data - ${values.tokenId}`,
        keyvalues: { customKey: "customValue", customKey2: "customValue2" },
      },
      pinataContent: NFTData,
    });
    const result = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      data,
      config
    );
    return `https://gateway.pinata.cloud/ipfs/${result.data.IpfsHash}`;
  } catch (err) {
    throw err;
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
