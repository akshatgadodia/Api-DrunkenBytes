const nodemailer = require("nodemailer");
const { OPENSEA_URL, BLOCK_EXPLORER_URL, CONTRACT_ADDRESS } = require("./constants");

const transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com", // hostname smtp.live.com //smtp-mail.outlook.com
  //secureConnection: false, // TLS requires secureConnection to be false
  port: 587, // port for secure SMTP
  //tls: {
  //ciphers:'SSLv3'
  //},
  secure: false,
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendErrorMail = async (data) => {
  try {
    let sendResult = await transporter.sendMail({
      from: "Drunken Bytes <bytes.drunken@hotmail.com>",
      to: `${data.sellerEmail}`,
      subject: `We Regret to Inform You: ${data.nftName} NFT Generation Failed`,
      text: `We Regret to Inform You: ${data.nftName} NFT Generation Failed

      Dear ${data.sellerName},
      
      We regret to inform you that there has been an issue with the generation of your NFT on Drunken Bytes, a platform specializing in NFTs for businesses. Unfortunately, the NFT generation process has failed and your NFT has not been successfully generated.
      
      We apologize for any inconvenience this may cause. Our team is working diligently to resolve the issue as soon as possible. We understand the importance of your NFT and we are taking all necessary steps to rectify the situation.
      
      We assure you that we are actively investigating the issue and will keep you updated on the progress. If you have any questions or need further assistance, please do not hesitate to contact us. We appreciate your patience and understanding.
      
      Please note that the following details were provided for the NFT generation:
      
      - Receiver Name: ${data.receiverName}
      - Receiver Email: ${data.receiverEmail}
      - Receiver Wallet Address: ${data.receiverWalletAddress}
      - Token ID: ${data.tokenId}
      - Permanence: ${data.isBurnable ? "Non-Permanent" : "Permanent"}
      - Transferability: ${data.isTransferable ? "Transferable" : "Non-Transferable"}
      - Value: ${data.value}
      
      Thank you for your understanding and continued support.
      
      Best regards,
      Drunken Bytes Team`,
      html: `<div><h1>We Regret to Inform You: ${data.nftName} NFT Generation Failed</h1>
      <p>
        Dear ${data.sellerName},
      </p>
      <p>
        We regret to inform you that there has been an issue with the generation of your NFT on Drunken Bytes, a platform specializing in NFTs for businesses. Unfortunately, the NFT generation process has failed and your NFT has not been successfully generated.
      </p>
      <p>
        We apologize for any inconvenience this may cause. Our team is working diligently to resolve the issue as soon as possible. We understand the importance of your NFT and we are taking all necessary steps to rectify the situation.
      </p>
      <p>
        We assure you that we are actively investigating the issue and will keep you updated on the progress. If you have any questions or need further assistance, please do not hesitate to contact us. We appreciate your patience and understanding.
      </p>
      <p>
        Please note that the following details were provided for the NFT generation:
      </p>
      <ul>
        <li><strong>Receiver Name:</strong> ${data.receiverName}</li>
        <li><strong>Receiver Email:</strong> ${data.receiverEmail}</li>
        <li><strong>Receiver Wallet Address:</strong> ${data.receiverWalletAddress}</li>
        <li><strong>Token ID:</strong> ${data.tokenId}</li>
        <li><strong>Permanence:</strong> ${data.isBurnable ? "Non-Permanent" : "Permanent"}</li>
        <li><strong>Transferability:</strong> ${data.isTransferable ? "Transferable" : "Non-Transferable"}</li>
        <li><strong>Value:</strong> ${data.value}</li>
      </ul>
      <p>
        Thank you for your understanding and continued support.
      </p>
      <p>
        Best regards,<br>
        Drunken Bytes Team
      </p></div>`,
    });
    //   console.log(sendResult);
  } catch (err) {
    console.log(err);
  }
};

const sendConfirmationMail = async (data) => {
  try {
    const etherscanURL = `${BLOCK_EXPLORER_URL}/${data.txId}`;
    const openseaURL = `${OPENSEA_URL}/${CONTRACT_ADDRESS}/${data.tokenId}`;
    let sendResult = await transporter.sendMail({
      from: "Drunken Bytes <bytes.drunken@hotmail.com>",
      to: `${data.receiverEmail}`,
      subject: `Congratulations! You've received an NFT from ${data.sellerName}`,
      text: `Congratulations! You've Received ${data.nftName} NFT from ${data.sellerName}

      Dear ${data.receiverName},
      
      Congratulations! You have received an NFT from ${data.sellerName}. We are excited to share the details of your NFT below:
      
      - NFT Type: ${data.nftType.charAt(0).toUpperCase() + data.nftType.slice(1)}
      - Transaction Hash: ${data.txId}
      - Token ID: ${data.tokenId}
      - Permanence: ${data.isBurnable ? "Non-Permanent" : "Permanent"}
      - Transferability: ${data.isTransferable ? "Transferable" : "Non-Transferable"}
      - View Transaction on Etherscan: ${etherscanURL}
      - View NFT on OpenSea: ${openseaURL}
      - Please note that the NFT may be permanent or non-permanent, as indicated above. If it is non-permanent, it will vanish after a certain period of time, as specified in the NFT details. Additionally, the transferability of the NFT is also mentioned above, indicating whether it can be transferred to other wallets or not.
      
      We hope you enjoy your NFT that is created using Drunken Bytes, a platform specializing in NFTs for businesses! If you have any questions or need further assistance, please feel free to reach out to us at https://drunkenbytes.vercel.app/raise-issue/${data.tokenId}.
      
      Best regards,
      Drunken Bytes Team`,
      html: `<div><h1>Congratulations! You've Received ${data.nftName} NFT from ${data.sellerName}</h1>
          <p>
              Dear ${data.receiverName},
          </p>
          <p>
              Congratulations! You have received an NFT from ${data.sellerName}. We are excited to share the details of your NFT below:
          </p>
          <ul>
              <li><strong>NFT Type:</strong> ${data.nftType.charAt(0).toUpperCase() + data.nftType.slice(1)}</li>
              <li><strong>Transaction Hash:</strong> ${data.txId}</li>
              <li><strong>Token ID:</strong> ${data.tokenId}</li>
              <li><strong>Permanence:</strong> ${data.isBurnable ? "Non-Permanent" : "Permanent"}</li>
              <li><strong>Transferability:</strong> ${data.isTransferable ? "Transferable" : "Non-Transferable"}</li>
          </ul>
          <p>
            You can view your NFT on Etherscan using the following link: <a href=${etherscanURL} target="_blank">Etherscan Link</a><br>
            You can also view your NFT on OpenSea using the following link: <a href=${openseaURL} target="_blank">OpenSea Link</a>
          </p>
          <p>
              Please note that the NFT may be permanent or non-permanent, as indicated above. If it is non-permanent, it will vanish after a certain period of time, as specified in the NFT details. Additionally, the transferability of the NFT is also mentioned above, indicating whether it can be transferred to other wallets or not.
          </p>
          <p>
              We hope you enjoy your NFT that is created using Drunken Bytes, a platform specializing in NFTs for businesses! If you have any questions or need further assistance, please feel free to reach out to us at <a href="https://drunkenbytes.vercel.app/raise-issue/${data.tokenId}" target="_blank">Raise Issue</a>.
          </p>
          <p>
              Best regards,<br>
              Drunken Bytes Team
          </p></div>`,
    });
    //   console.log(sendResult);
    let sendMailResult = await transporter.sendMail({
      from: "Drunken Bytes <bytes.drunken@hotmail.com>",
      to: `${data.sellerEmail}`,
      subject: `Congratulations! Your ${data.nftName} NFT has been Successfully Generated`,
      text: `Congratulations! Your ${data.nftName} NFT has been Successfully Generated

      Dear ${data.sellerName},
      
      Congratulations! Your NFT has been successfully generated on Drunken Bytes, a platform specializing in NFTs for businesses. We are excited to share the details of your NFT below:
      
      - NFT Type: ${data.nftType.charAt(0).toUpperCase() + data.nftType.slice(1)}
      - Transaction Hash: ${data.txId}
      - Receiver Name: ${data.receiverName}
      - Receiver Email: ${data.receiverEmail}
      - Receiver Wallet Address: ${data.receiverWalletAddress}
      - Token ID: ${data.tokenId}
      - Permanence: ${data.isBurnable ? "Non-Permanent" : "Permanent"}
      - Transferability: ${data.isTransferable ? "Transferable" : "Non-Transferable"}
      - Value: ${data.value}
      
      You can view your NFT on Etherscan using the following link: ${etherscanURL}
      You can also view your NFT on OpenSea using the following link: ${openseaURL}
      
      Please note that the NFT may be permanent or non-permanent, as indicated above. If it is non-permanent, it will vanish after a certain period of time, as specified in the NFT details. Additionally, the transferability of the NFT is also mentioned above, indicating whether it can be transferred to other wallets or not.
      
      We would like to thank you for choosing Drunken Bytes to create your NFT. If you have any questions or need further assistance, please do not hesitate to contact us.
      
      Best regards,
      Drunken Bytes Team`,
      html: `<div><h1>Congratulations! Your ${data.nftName} NFT has been Successfully Generated</h1>
      <p>Dear ${data.sellerName},</p>
      <p>
        Congratulations! Your NFT has been successfully generated on Drunken Bytes, a platform specializing in NFTs for businesses. We are excited to share the details of your NFT below:
      </p>
      <ul>
        <li><strong>NFT Type:</strong> ${data.nftType.charAt(0).toUpperCase() + data.nftType.slice(1)}</li>
        <li><strong>Transaction Hash:</strong> ${data.txId}</li>
        <li><strong>Receiver Name:</strong> ${data.receiverName}</li>
        <li><strong>Receiver Email:</strong> ${data.receiverEmail}</li>
        <li><strong>Receiver Wallet Address:</strong> ${data.receiverWalletAddress}</li>
        <li><strong>Token ID:</strong> ${data.tokenId}</li>
        <li><strong>Permanence:</strong> ${data.isBurnable ? "Non-Permanent" : "Permanent"}</li>
        <li><strong>Transferability:</strong> ${data.isTransferable ? "Transferable" : "Non-Transferable"}</li>
        <li><strong>Value:</strong> ${data.value}</li>
      </ul>
      <p>
        You can view your NFT on Etherscan using the following link: <a href=${etherscanURL} target="_blank">Etherscan Link</a><br>
        You can also view your NFT on OpenSea using the following link: <a href=${openseaURL} target="_blank">OpenSea Link</a>
      </p>
      <p>
        Please note that the NFT may be permanent or non-permanent, as indicated above. If it is non-permanent, it will vanish after a certain period of time, as specified in the NFT details. Additionally, the transferability of the NFT is also mentioned above, indicating whether it can be transferred to other wallets or not.
      </p>
      <p>
        We would like to thank you for choosing Drunken Bytes to create your NFT. If you have any questions or need further assistance, please do not hesitate to contact us.
      </p>
      <p>
        Best regards,<br>
        Drunken Bytes Team
      </p></div>`,
    });
  } catch (err) {
    console.log(err);
  }
};

const sendPendingMail = async (data) => {
  try {
    const etherscanURL = `${BLOCK_EXPLORER_URL}/${data.txId}`;
    let sendResult = await transporter.sendMail({
      from: "Drunken Bytes <bytes.drunken@hotmail.com>",
      to: `${data.sellerEmail}`,
      subject: `Congratulations! Your ${nftName} NFT Generation is Underway`,
      text: `Congratulations! Your ${nftName} NFT Generation is Underway

      Dear ${data.sellerName},

      Your NFT generation process has been initiated by Drunken Bytes, a platform specializing in NFTs for businesses. We are excited to share the details of your NFT below:
      
      - NFT Type: ${data.nftType.charAt(0).toUpperCase() + data.nftType.slice(1)}
      - Transaction Hash: ${data.txId}
      - Receiver Name: ${data.receiverName}
      - Receiver Email: ${data.receiverEmail}
      - Receiver Wallet Address: ${data.receiverWalletAddress}
      - Token ID: ${data.tokenId}
      - Permanence: ${data.isBurnable ? "Non-Permanent" : "Permanent"}
      - Transferability: ${data.isTransferable ? "Transferable" : "Non-Transferable"}
      
      Please note that the NFT generation process is currently in a pending state and may take up to 24 hours to complete. Once the NFT is successfully generated, we will inform you of the updated details, including the value associated with the NFT.
      
      You can view the status of your NFT generation process on Etherscan using the following link: ${etherscanURL}
      
      Please be patient as the NFT generation process completes. If you have any questions or need further assistance, please do not hesitate to contact us.
      
      Thank you for choosing Drunken Bytes to create your NFT.
      
      Best regards,
      Drunken Bytes Team`,
      html: `<div><h1>Congratulations! Your ${nftName} NFT Generation is Underway</h1>
      <p>
      Dear ${data.sellerName},
      </p>
      <p>Your NFT generation process has been initiated by Drunken Bytes, a platform specializing in NFTs for businesses. We are excited to share the details of your NFT below:</p>
      <ul>
        <li><strong>NFT Type:</strong> ${data.nftType.charAt(0).toUpperCase() + data.nftType.slice(1)}</li>
        <li><strong>Transaction Hash:</strong> ${data.txId}</li>
        <li><strong>Receiver Name:</strong> ${data.receiverName}</li>
        <li><strong>Receiver Email:</strong> ${data.receiverEmail}</li>
        <li><strong>Receiver Wallet Address:</strong> ${data.receiverWalletAddress}</li>
        <li><strong>Token ID:</strong> ${data.tokenId}</li>
        <li><strong>Permanence:</strong> ${data.isBurnable ? "Non-Permanent" : "Permanent"}</li>
        <li><strong>Transferability:</strong> ${data.isTransferable ? "Transferable" : "Non-Transferable"}</li>
      </ul>
      <p>Please note that the NFT generation process is currently in a pending state and may take up to 24 hours to complete. Once the NFT is successfully generated, we will inform you of the updated details, including the value associated with the NFT.</p>
      <p>You can view the status of your NFT generation process on Etherscan using the following link: <a href=${etherscanURL}>Block Explorer</a></p>
      <p>Please be patient as the NFT generation process completes. If you have any questions or need further assistance, please do not hesitate to contact us.</p>
      <p>Thank you for choosing Drunken Bytes to create your NFT.</p>
      <p>Best regards,</p>
      <p>Drunken Bytes Team</p></div>`,
    });
  } catch (err) {
    console.log(err);
  }
};

const sendBurnMail = async (data) => {
  try {
    const etherscanURL = `${BLOCK_EXPLORER_URL}/${data.txId}`;
    let sendResult = await transporter.sendMail({
      from: "Drunken Bytes <bytes.drunken@hotmail.com>",
      to: `${data.sellerEmail}`,
      subject: `Notification of ${data.nftName} NFT Burn`,
      text: `Notification of ${data.nftName} NFT Burn

      Dear ${data.sellerName},

      The ${data.nftName} NFT that you created has been burned and is no longer in the user possession.
      The burn was initiated as the NFT has expired.

      The details of your NFT are:
      
      - NFT Type: ${data.nftType.charAt(0).toUpperCase() + data.nftType.slice(1)}
      - Transaction Hash: ${data.txId}
      - Token ID: ${data.tokenId}
      - Permanence: Non-Permanent
      - Transferability: ${data.isTransferable ? "Transferable" : "Non-Transferable"}
      - View Transaction on Etherscan: ${etherscanURL}
      
      Please note that once an NFT is burned, it cannot be recovered. The action is irreversible, and the NFT will no longer exist on the blockchain. You will not be able to transfer, sell or trade this NFT anymore.
      If you have any questions or concerns regarding the NFT burn process, please do not hesitate to contact us. Our support team is always available to assist you.
      
      Best regards,
      Drunken Bytes Team`,
      html: `<div><h1>Notification of ${data.nftName} NFT Burn</h1>
      <p>
      Dear ${data.sellerName},
      </p>
      <p>
              The ${data.nftName} NFT that you created has been burned and is no longer in the user possession.<br/>
              The burn was initiated as the NFT has expired.<br/><br/>
              The details of the NFT are:
          </p>
          <ul>
              <li><strong>NFT Type:</strong> ${data.nftType.charAt(0).toUpperCase() + data.nftType.slice(1)}</li>
              <li><strong>Transaction Hash:</strong> ${data.txId}</li>
              <li><strong>Token ID:</strong> ${data.tokenId}</li>
              <li><strong>Permanence:</strong> Non-Permanent</li>
              <li><strong>Transferability:</strong> ${data.isTransferable ? "Transferable" : "Non-Transferable"}</li>
          </ul>
          <p>
              Please note that once an NFT is burned, it cannot be recovered. The action is irreversible, and the NFT will no longer exist on the blockchain. You will not be able to transfer, sell or trade this NFT anymore.
          </p>
          <p>
             If you have any questions or concerns regarding the NFT burn process, please do not hesitate to contact us. Our support team is always available to assist you.
          </p>
          <p>
              Best regards,<br>
              Drunken Bytes Team
          </p></div>`,
    });

    sendResult = await transporter.sendMail({
      from: "Drunken Bytes <bytes.drunken@hotmail.com>",
      to: `${data.receiverEmail}`,
      subject: `Notification of Your ${data.nftName} NFT Burn`,
      text: `Notification of Your ${data.nftName} NFT Burn

      Dear ${data.receiverName},
      
      Your ${data.nftName} NFT has been burned and is no longer in your possession.
      The burn was initiated as the NFT has expired.

      The details of your NFT are:
      
      - NFT Type: ${data.nftType.charAt(0).toUpperCase() + data.nftType.slice(1)}
      - Transaction Hash: ${data.txId}
      - Token ID: ${data.tokenId}
      - Permanence: Non-Permanent
      - Transferability: ${data.isTransferable ? "Transferable" : "Non-Transferable"}
      - View Transaction on Etherscan: ${etherscanURL}
      
      Please note that once an NFT is burned, it cannot be recovered. The action is irreversible, and the NFT will no longer exist on the blockchain. You will not be able to transfer, sell or trade this NFT anymore.
      If you have any questions or concerns regarding the NFT burn process, please do not hesitate to contact us. Our support team is always available to assist you.
      
      Best regards,
      Drunken Bytes Team`,
      html: `<div><h1>Notification of Your ${data.nftName} NFT Burn</h1>
          <p>
              Dear ${data.receiverName},
          </p>
          <p>
              Your ${data.nftName} NFT has been burned and is no longer in your possession.<br/>
              The burn was initiated as the NFT has expired.<br/><br/>
              The details of your NFT are:
          </p>
          <ul>
              <li><strong>NFT Type:</strong> ${data.nftType.charAt(0).toUpperCase() + data.nftType.slice(1)}</li>
              <li><strong>Transaction Hash:</strong> ${data.txId}</li>
              <li><strong>Token ID:</strong> ${data.tokenId}</li>
              <li><strong>Permanence:</strong> Non-Permanent</li>
              <li><strong>Transferability:</strong> ${data.isTransferable ? "Transferable" : "Non-Transferable"}</li>
          </ul>
          <p>
              Please note that once an NFT is burned, it cannot be recovered. The action is irreversible, and the NFT will no longer exist on the blockchain. You will not be able to transfer, sell or trade this NFT anymore.
          </p>
          <p>
             If you have any questions or concerns regarding the NFT burn process, please do not hesitate to contact us. Our support team is always available to assist you.
          </p>
          <p>
              Best regards,<br>
              Drunken Bytes Team
          </p></div>`,
    });
  } catch (err) {
    console.log(err);
  }
};

const sendAccountApprovedMail = async (data) => {
  try {
    let sendResult = await transporter.sendMail({
      from: "Drunken Bytes <bytes.drunken@hotmail.com>",
      to: `${data.email}`,
      subject: `Account Verified and Approved by Drunken Bytes`,
      text: `Dear ${data.name},
      
      We are writing to inform you that your account has been verified and approved by the Drunken Bytes team. You can now log in to the Drunken Bytes website using your Web3 wallet and start availing all of our services.

      We understand the importance of maintaining a secure and reliable platform for our clients, and we take pride in ensuring that all accounts are thoroughly verified before being approved. With this verification process complete, you can now enjoy the benefits of our platform and all of its features.

      Please note that our team is always available to assist you with any questions or concerns you may have. We value your business and are committed to providing you with the highest level of support possible.

      Thank you for choosing Drunken Bytes for your needs. We look forward to working with you.
      
      Best regards,
      Drunken Bytes Team`,
      html: `<div><p>
        Dear ${data.name},
      </p>
      <p>
        We are writing to inform you that your account has been verified and approved by the Drunken Bytes team. You can now log in to the Drunken Bytes website using your Web3 wallet and start availing all of our services.
      </p>
      <p>
        We understand the importance of maintaining a secure and reliable platform for our clients, and we take pride in ensuring that all accounts are thoroughly verified before being approved. With this verification process complete, you can now enjoy the benefits of our platform and all of its features.
      </p>
      <p>
        Please note that our team is always available to assist you with any questions or concerns you may have. We value your business and are committed to providing you with the highest level of support possible.
      </p>
      <p>
        Thank you for choosing Drunken Bytes for your needs. We look forward to working with you.
      </p>
      <p>
        Best regards,<br>
        Drunken Bytes Team
      </p></div>`,
    });
    //   console.log(sendResult);
  } catch (err) {
    console.log(err);
  }
};

module.exports = { sendConfirmationMail, sendErrorMail, sendPendingMail, sendBurnMail, sendAccountApprovedMail };
