import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const amount = Number(body?.amount);
    const currency = body?.currency || "INR";

    console.log("CREATE ORDER BODY:", body);
    console.log("AMOUNT:", amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payment amount",
        },
        { status: 400 }
      );
    }

    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      console.error("Razorpay environment variables are missing");

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

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency,
      receipt: `receipt_${Date.now()}`,
    });

    console.log("RAZORPAY ORDER:", order);

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error: any) {
    console.error("RAZORPAY CREATE ORDER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.error?.description || error?.message || "Failed to create order",
      },
      { status: 500 }
    );
  }
}