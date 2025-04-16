// src/app/api/payhere-process/route.js

export async function POST(req) {
  const crypto = require("crypto");
  const merchant_id = process.env.PAYHERE_MERCHANT_ID;
  const merchant_secret = process.env.PAYHERE_MERCHANT_SECRET;

  const body = await req.json();

  const {
    amount,
    item,
    first_name,
    last_name,
    email,
    phone,
    address,
    city,
    country,
  } = body;

  const order_id = Math.floor(Math.random() * 1000000000).toString();
  const currency = "LKR";
  const formattedAmount = amount.toFixed(2);

  const secretHash = crypto
    .createHash("md5")
    .update(merchant_secret)
    .digest("hex")
    .toUpperCase();

  const hash = crypto
    .createHash("md5")
    .update(
      merchant_id + order_id + formattedAmount + currency + secretHash
    )
    .digest("hex")
    .toUpperCase();

  const responseData = {
    items: item,
    first_name,
    last_name,
    email,
    phone,
    address,
    city,
    country,
    amount,
    merchant_id,
    order_id,
    currency,
    hash,
  };

  return Response.json(responseData);
}
