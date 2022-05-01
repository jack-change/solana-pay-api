import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { clusterApiUrl, Connection, PublicKey, SystemProgram, LAMPORTS_PER_SOL, sendAndConfirmRawTransaction} from "@solana/web3.js"
import { NextApiRequest, NextApiResponse } from "next"
import { Keypair, Transaction, sendAndConfirmTransaction} from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
export type MakeTransactionInputData = {
  account: string,
}

export type MakeTransactionOutputData = {
  transaction: string,
  message: string,
}

type ErrorOutput = {
  error: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MakeTransactionOutputData | ErrorOutput>
) {
  const { reference } = req.query
  const {account} = req.query
  try {
    // We pass the selected items in the query, calculate the expected cost
    const amount = parseInt("100")
    if (amount === 0) {
      res.status(400).json({ error: "Can't checkout with charge of 0" })
      return
    }

    // We pass the reference to use in the query
    if (!reference) {
      res.status(400).json({ error: "No reference provided" })
      return
    }

     if (!account) {
       res.status(400).json({ error: "No account provided" })
       return
     }

    const buyerPublicKey = new PublicKey(account)
    const shopPublicKey = new PublicKey("3sCcDnsfpwe9YeFvcwhqdGDZUoibYsT76UwcGfRKZtnB")

    const network = WalletAdapterNetwork.Devnet
    const endpoint = clusterApiUrl(network)
    const connection = new Connection(endpoint)

    // Get a recent blockhash to include in the transaction
    const { blockhash } = await (connection.getLatestBlockhash('finalized'))

    const transaction = new Transaction({
      recentBlockhash: blockhash,
      // The buyer pays the transaction fee
      feePayer: buyerPublicKey,
    })

    // Create the instruction to send SOL from the buyer to the shop
    const transferInstruction = SystemProgram.transfer({
      fromPubkey: buyerPublicKey,
      lamports: amount * (LAMPORTS_PER_SOL),
      toPubkey: shopPublicKey,
    })

    // Add the reference to the instruction as a key
    // This will mean this transaction is returned when we query for the reference
    transferInstruction.keys.push({
      pubkey: new PublicKey(reference),
      isSigner: false,
      isWritable: false,
    })
    transaction.add(transferInstruction);
    console.log(transaction);
    // Serialize the transaction and convert to base64 to return it
    const serializedTransaction = transaction.serialize({
      // We will need the buyer to sign this transaction after it's returned to them
      requireAllSignatures: false
    })
    
    const base64 = serializedTransaction.toString('base64')
    
    // Insert into database: reference, amount

    // Return the serialized transaction
    res.status(200).json({
      transaction: base64,
      message: "Thanks for your order!",
    })
  } catch (err) {
    console.error(err);

    res.status(500).json({ error: 'error creating transaction', })
    return
  }
}