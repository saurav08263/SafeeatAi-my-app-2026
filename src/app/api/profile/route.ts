import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// helper safe JSON parse
function safeParse(value: any) {
  try {
    if (!value) return [];
    return JSON.parse(value);
  } catch {
    return [];
  }
}

// ================= GET =================
export async function GET() {
  try {
    let user = await db.userProfile.findFirst();

    if (!user) {
      user = await db.userProfile.create({
        data: {
          name: "User",
          email: "user@safteyeat.ai",
        },
      });
    }

    return NextResponse.json({
      success: true,
      profile: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        allergies: safeParse(user.allergies),
        dietaryRestrictions: safeParse(user.dietaryRestrictions),
        healthGoals: safeParse(user.healthGoals),
        isPremium: user.isPremium,
        trialStart: user.trialStart?.toISOString() || null,
        trialEnd: user.trialEnd?.toISOString() || null,
        isTrialUsed: user.isTrialUsed,
        scanCount: user.scanCount,
        authProvider: user.authProvider,
        country: user.country,
        notificationEnabled: user.notificationEnabled,
        createdAt: user.createdAt?.toISOString(),
      },
    });
  } catch (error) {
    console.error("Fetch profile error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

// ================= PUT =================
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      phone,
      allergies,
      dietaryRestrictions,
      healthGoals,
      notificationEnabled,
      country,
      isPremium,
      trialStart,
      trialEnd,
      isTrialUsed,
    } = body;

    let user = await db.userProfile.findFirst();

    if (!user) {
      user = await db.userProfile.create({
        data: {
          name: name || "User",
          email: email || "user@safteyeat.ai",
        },
      });
    }

    const updated = await db.userProfile.update({
      where: { id: user.id },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
        ...(allergies !== undefined && {
          allergies: JSON.stringify(allergies),
        }),
        ...(dietaryRestrictions !== undefined && {
          dietaryRestrictions: JSON.stringify(dietaryRestrictions),
        }),
        ...(healthGoals !== undefined && {
          healthGoals: JSON.stringify(healthGoals),
        }),
        ...(notificationEnabled !== undefined && { notificationEnabled }),
        ...(country !== undefined && { country }),
        ...(isPremium !== undefined && { isPremium }),
        ...(isTrialUsed !== undefined && { isTrialUsed }),
        ...(trialStart !== undefined && {
          trialStart: trialStart ? new Date(trialStart) : null,
        }),
        ...(trialEnd !== undefined && {
          trialEnd: trialEnd ? new Date(trialEnd) : null,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      profile: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        allergies: safeParse(updated.allergies),
        dietaryRestrictions: safeParse(updated.dietaryRestrictions),
        healthGoals: safeParse(updated.healthGoals),
        isPremium: updated.isPremium,
        trialStart: updated.trialStart?.toISOString() || null,
        trialEnd: updated.trialEnd?.toISOString() || null,
        isTrialUsed: updated.isTrialUsed,
        scanCount: updated.scanCount,
        authProvider: updated.authProvider,
        country: updated.country,
        notificationEnabled: updated.notificationEnabled,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update profile" },
      { status: 500 }
    );
  }
}