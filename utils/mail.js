const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com", // hostname smtp.live.com //smtp-mail.outlook.com
  secureConnection: false, // TLS requires secureConnection to be false
  port: 587, // port for secure SMTP
  tls: {
     ciphers:'SSLv3'
  },
  auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASSWORD,
  }
});
const sendErrorMail = async (data) => {
    try{
        let sendResult = await transporter.sendMail({
            from : 'Drunken Bytes <bytes.drunken@hotmail.com>',
            to  : `${data.buyerEmail}`,
            subject : 'NFT Warranty Card generation failed',
            text : `Hello ${data.buyerName}, Congratulations on your sale of ${data.brandName} ${data.productName} with id ${data.productId} to 
                    ${data.buyerName}.This NFT will automatically be burned after ${data.expireDate}. Regards,The Drunken Bytes Team`,
            html :`Hello <b>${data.buyerName},</b>
                  <p>Congratulations on your sale of <b>${data.brandName} ${data.productName}</b> with product id <b>${data.productId}</b> to 
                  <b>${data.sellerName}</b>.<br/>This NFT will automatically be burned after <b>${data.warrantyExpireDate}</b>.
                  <br/><br/>Regards,<br/>The Drunken Bytes Team</p>`
          });
        //   console.log(sendResult);
        }
        catch(err){
            console.log(err);
        }
}

const sendConfirmationMail = async (data) => {
    try{
        let sendResult = await transporter.sendMail({
            from : 'Drunken Bytes <bytes.drunken@hotmail.com>',
            to  : `${data.buyerEmail}`,
            subject : 'Congratulations on receiving NFT Warranty Card',
            text : `Hello ${data.buyerName}, Congratulations on your purchase of ${data.brandName} ${data.productName} with product id ${data.productId} from 
                    ${data.sellerName}. You have also received the Warranty Card NFT with id ${data.tokenId} with your purchase.
                    You can view this NFT on OpenSea and it will automatically be burned after ${data.expireDate}. Regards,The Drunken Bytes Team`,
            html :`Hello <b>${data.buyerName},</b>
                  <p>Congratulations on your purchase of <b>${data.brandName} ${data.productName}</b> with product id <b>${data.productId}</b> from 
                  <b>${data.sellerName}</b>.<br/>You have also received the Warranty Card NFT with id <b>${data.tokenId}</b> with your purchase.<br/>
                  You can view this NFT on OpenSea and it will automatically be burned after <b>${data.warrantyExpireDate}</b>.
                  <br/><br/>Regards,<br/>The Drunken Bytes Team</p>`
          });
        //   console.log(sendResult);
          sendResult = await transporter.sendMail({
            from : 'Drunken Bytes <bytes.drunken@hotmail.com>',
            to  : `${data.sellerEmail}`,
            subject : 'NFT Warranty Card generation successful',
            text : `Hello ${data.sellerName}, Congratulations on your sale of ${data.brandName} ${data.productName} with id ${data.productId} to 
                    ${data.buyerName}.This NFT will automatically be burned after ${data.expireDate}. Regards,The Drunken Bytes Team`,
            html :`Hello <b>${data.sellerName},</b>
                  <p>Congratulations on your sale of <b>${data.brandName} ${data.productName}</b> with product id <b>${data.productId}</b> to 
                  <b>${data.sellerName}</b>.<br/>This NFT will automatically be burned after <b>${data.warrantyExpireDate}</b>.
                  <br/><br/>Regards,<br/>The Drunken Bytes Team</p>`
          });
        //   console.log(sendResult);
        }
        catch(err){
            console.log(err);
        }
}

const sendPendingMail = async (data) => {
  try{
      let sendResult = await transporter.sendMail({
          from : 'Drunken Bytes <bytes.drunken@hotmail.com>',
          to  : `${data.buyerEmail}`,
          subject : 'Congratulations on receiving NFT Warranty Card',
          text : `Hello ${data.buyerName}, Congratulations on your purchase of ${data.brandName} ${data.productName} with product id ${data.productId} from 
                  ${data.sellerName}. You have also received the Warranty Card NFT with id ${data.tokenId} with your purchase.
                  You can view this NFT on OpenSea and it will automatically be burned after ${data.expireDate}. Regards,The Drunken Bytes Team`,
          html :`Hello <b>${data.buyerName},</b>
                <p>Congratulations on your purchase of <b>${data.brandName} ${data.productName}</b> with product id <b>${data.productId}</b> from 
                <b>${data.sellerName}</b>.<br/>You have also received the Warranty Card NFT with id <b>${data.tokenId}</b> with your purchase.<br/>
                You can view this NFT on OpenSea and it will automatically be burned after <b>${data.warrantyExpireDate}</b>.
                <br/><br/>Regards,<br/>The Drunken Bytes Team</p>`
        });
      //   console.log(sendResult);
        sendResult = await transporter.sendMail({
          from : 'Drunken Bytes <bytes.drunken@hotmail.com>',
          to  : `${data.sellerEmail}`,
          subject : 'NFT Warranty Card generation successful',
          text : `Hello ${data.sellerName}, Congratulations on your sale of ${data.brandName} ${data.productName} with id ${data.productId} to 
                  ${data.buyerName}.This NFT will automatically be burned after ${data.expireDate}. Regards,The Drunken Bytes Team`,
          html :`Hello <b>${data.sellerName},</b>
                <p>Congratulations on your sale of <b>${data.brandName} ${data.productName}</b> with product id <b>${data.productId}</b> to 
                <b>${data.sellerName}</b>.<br/>This NFT will automatically be burned after <b>${data.warrantyExpireDate}</b>.
                <br/><br/>Regards,<br/>The Drunken Bytes Team</p>`
        });
      //   console.log(sendResult);
      }
      catch(err){
          console.log(err);
      }
}

module.exports = {sendConfirmationMail, sendErrorMail, sendPendingMail}