import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req) {
  const body = await req.json();

  const paymentId = body.payment_id;
  const reason = body.reason || "Customer request";

  const merchant_id = process.env.PAYHERE_MERCHANT_ID;
  const merchant_secret = process.env.PAYHERE_MERCHANT_SECRET;

  const hash = crypto
    .createHash("md5")
    .update(merchant_id + paymentId + merchant_secret)
    .digest("hex")
    .toUpperCase();

  const refundData = {
    merchant_id,
    payment_id: paymentId,
    reason,
    hash,
  };

  const response = await fetch("https://sandbox.payhere.lk/merchant/v1/refund", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(refundData),
  });

  const result = await response.json();

  return NextResponse.json(result);
}
