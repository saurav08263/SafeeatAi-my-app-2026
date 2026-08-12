import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: NextRequest) {
  try {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      return NextResponse.json(
        {
          success: false,
          message: "Razorpay keys are missing",
        },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({
      key_id,
      key_secret,
    });

    const { amount, currency = "INR" } = await req.json();

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency,
      receipt: `receipt_${Date.now()}`,
    });

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create order",
      },
      { status: 500 }
    );
  }
}