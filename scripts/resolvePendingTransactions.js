const NftTransaction = require("../models/NftTransaction");
const { web3 } = require("../config/web3");

const resolvePendingTransactions = async () => {
    console.log("RESOLVING PENDING TRANSACTIONS")
    const res=await NftTransaction.find({status:"Pending"})
    res.forEach(async(trans)=>{
        const result1 = await web3.eth.getTransactionReceipt(trans.txId);
        // console.log(result1)
        if(result1)
        {
            trans.status="Success"
            await trans.save()

        }
    })
}

module.exports = { resolvePendingTransactions }