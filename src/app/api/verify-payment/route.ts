import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan,
      amount,
      currency,
    } = body;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment verification failed",
        },
        { status: 400 }
      );
    }

    let user = await db.userProfile.findFirst();

    if (!user) {
      user = await db.userProfile.create({
        data: {
          id: "default-user",
          name: "User",
          email: "user@safeeat.ai",
        },
      });
    }

    const now = new Date();
    const expiry = new Date(now);

    if (plan === "monthly") {
      expiry.setMonth(expiry.getMonth() + 1);
    } else {
      expiry.setFullYear(expiry.getFullYear() + 1);
    }

    const existing = await db.subscription.findFirst();

    if (existing) {
      await db.subscription.update({
        where: { id: existing.id },
        data: {
          plan,
          provider: "razorpay",
          providerId: razorpay_payment_id,
          status: "active",
          amount,
          currency,
          startDate: now,
          endDate: expiry,
        },
      });
    } else {
      await db.subscription.create({
        data: {
          userId: user.id,
          plan,
          provider: "razorpay",
          providerId: razorpay_payment_id,
          status: "active",
          amount,
          currency,
          startDate: now,
          endDate: expiry,
        },
      });
    }

    await db.userProfile.update({
      where: { id: user.id },
      data: {
        isPremium: true,
        premiumExpiry: expiry,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        success: false,
        message: "Verification failed",
      },
      {
        status: 500,
      }
    );
  }
}