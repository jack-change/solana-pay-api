import { Keypair, Transaction,sendAndConfirmTransaction, clusterApiUrl, Connection} from "@solana/web3.js"
import { NextApiRequest, NextApiResponse } from "next"

export type MakeTransactionRefrenceOutputData = {
  transaction_JSON: Transaction,
  message: string,
}
export type MakeTransactionRefrenceInputData = {
    transaction: string,
  }

type ErrorOutput = {
  error: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MakeTransactionRefrenceOutputData | ErrorOutput>
) {
    const txHash = req.body as MakeTransactionRefrenceInputData
    const decrypt_transaction =  txHash.transaction;
    console.log(decrypt_transaction)
     const transact = Transaction.from(Buffer.from(decrypt_transaction, 'base64'));
     console.log(transact);
     let keypair = Keypair.generate();
let connection = new Connection(clusterApiUrl('testnet'));

    // Return the serialized transaction
    res.status(200).json({
      transaction_JSON: transact,
      message: "Created a new refrence for transaction",
    })
    return

}