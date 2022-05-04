import { createQR, encodeURL } from "@solana/pay";
import { Keypair, PublicKey } from "@solana/web3.js";
import { NextApiRequest, NextApiResponse } from "next";
import {BigNumber} from "bignumber.js"


export type MakePaymentQrInputData = {
  shopAddress: string,
  usdcAddress:string,
}

export type MakePaymentQrOutputData = {
  link: string,
  message: string
}

type ErrorOutput = {
  error: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MakePaymentQrOutputData | ErrorOutput>
) {
 // Generate the unique reference which will be used for this transaction
    const reference = Keypair.generate().publicKey;
    const info = req.query as MakePaymentQrInputData
    if (reference)
    {
        // Solana Pay transfer params
  // Solana Pay transfer params
  const urlParams = {
    recipient: new PublicKey(req.query.shopAddress),
    amount: new BigNumber(100),
    splToken:new PublicKey(req.query.usdcAddress),
    reference,
    label: "Cookies Inc",
    message: "Thanks for your order! 🍪"
  }


  const url = encodeURL(urlParams)
  console.log(url.toString());
 
    // Return the serialized transaction
    res.status(200).json({
      link : url.toString(),
      message: "Created a payment link"
    })
    return
}
else {
    res.status(500).json({ error: 'error creating transaction' })
    return
  }

}