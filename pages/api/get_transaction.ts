import { Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { NextApiRequest, NextApiResponse } from "next"

export type MakeTransactionRefrenceOutputData = {
  transaction_refrence: PublicKey,
  message: string,
}

type ErrorOutput = {
  error: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MakeTransactionRefrenceOutputData | ErrorOutput>
) {
 // Generate the unique reference which will be used for this transaction
    const reference = Keypair.generate().publicKey;
    if (reference)
    {
    // Return the serialized transaction
    res.status(200).json({
      transaction_refrence: reference,
      message: "Thanks for your order! 🍪",
    })
    return
}
else {
    res.status(500).json({ error: 'error creating transaction', })
    return
  }
}