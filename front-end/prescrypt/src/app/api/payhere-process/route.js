// src/app/api/payhere-process/route.js

export async function GET() {
    const amount = 3000;
    const merchant_id = process.env.PAYHERE_MERCHANT_ID;
    const order_id = Math.floor(Math.random() * 1000000000).toString();
    const merchant_secret = process.env.PAYHERE_MERCHANT_SECRET;
    const currency = "LKR";
    const first_name = "Dewmin";
    const last_name = "Deniyegedara";
    const email = "dewminkasmitha30@gmail.com";
    const phone = "0771234567";
    const address = "Colombo 07";
    const city = "Colombo";
    const country = "Sri Lanka";
  
    const crypto = require('crypto');
    const formattedAmount = amount.toFixed(2);
  
    // Corrected hash logic
    const secretHash = crypto
      .createHash('md5')
      .update(merchant_secret)
      .digest("hex")
      .toUpperCase();
  
    const hash = crypto
      .createHash('md5')
      .update(
        merchant_id +
        order_id +
        formattedAmount +
        currency +
        secretHash
      )
      .digest("hex")
      .toUpperCase();
  
    const responseData = {
      items: "Booking for Mr. Chathurika Perera",
      first_name: first_name,
      last_name: last_name,
      email: email,
      phone: phone,
      address: address,
      city: city,
      country: country,
      amount: amount,
      merchant_id: merchant_id,
      order_id: order_id,
      currency: currency,
      hash: hash,
    };
  
    return Response.json(responseData);
  }
  