import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Fetch user profile
export async function GET() {
  try {
    let user = await db.userProfile.findFirst()
    if (!user) {
      user = await db.userProfile.create({
        data: { id: 'default-user', name: 'User', email: 'user@safteyeat.ai' }
      })
    }

    return NextResponse.json({
      success: true,
      profile: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        allergies: JSON.parse(user.allergies),
        dietaryRestrictions: JSON.parse(user.dietaryRestrictions),
        healthGoals: JSON.parse(user.healthGoals),
        isPremium: user.isPremium,
        trialStart: user.trialStart?.toISOString(),
        trialEnd: user.trialEnd?.toISOString(),
        isTrialUsed: user.isTrialUsed,
        scanCount: user.scanCount,
        authProvider: user.authProvider,
        country: user.country,
        notificationEnabled: user.notificationEnabled,
        createdAt: user.createdAt.toISOString(),
      }
    })
  } catch (error) {
    console.error('Fetch profile error:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, allergies, dietaryRestrictions, healthGoals, notificationEnabled, country, isPremium, trialStart, trialEnd, isTrialUsed } = body

    let user = await db.userProfile.findFirst()
    if (!user) {
      user = await db.userProfile.create({
        data: { id: 'default-user', name: name || 'User', email: email || 'user@safteyeat.ai' }
      })
    }

    const updated = await db.userProfile.update({
      where: { id: user.id },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
        ...(allergies !== undefined && { allergies: JSON.stringify(allergies) }),
        ...(dietaryRestrictions !== undefined && { dietaryRestrictions: JSON.stringify(dietaryRestrictions) }),
        ...(healthGoals !== undefined && { healthGoals: JSON.stringify(healthGoals) }),
        ...(notificationEnabled !== undefined && { notificationEnabled }),
        ...(country !== undefined && { country }),
        ...(isPremium !== undefined && { isPremium }),
        ...(isTrialUsed !== undefined && { isTrialUsed }),
        ...(trialStart !== undefined && { trialStart: trialStart ? new Date(trialStart) : null }),
        ...(trialEnd !== undefined && { trialEnd: trialEnd ? new Date(trialEnd) : null }),
      }
    })

    return NextResponse.json({
      success: true,
      profile: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        allergies: JSON.parse(updated.allergies),
        dietaryRestrictions: JSON.parse(updated.dietaryRestrictions),
        healthGoals: JSON.parse(updated.healthGoals),
        isPremium: updated.isPremium,
        trialStart: updated.trialStart?.toISOString(),
        trialEnd: updated.trialEnd?.toISOString(),
        isTrialUsed: updated.isTrialUsed,
        scanCount: updated.scanCount,
        authProvider: updated.authProvider,
        country: updated.country,
        notificationEnabled: updated.notificationEnabled,
      }
    })
  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
