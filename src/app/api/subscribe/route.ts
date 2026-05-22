import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Fetch subscription status
export async function GET() {
  try {
    const subscription = await db.subscription.findFirst()
    return NextResponse.json({
      success: true,
      subscription: subscription || { plan: 'free', status: 'inactive', provider: 'none' }
    })
  } catch (error) {
    console.error('Fetch subscription error:', error)
    return NextResponse.json({ error: 'Failed to fetch subscription' }, { status: 500 })
  }
}

// POST - Create/update subscription via Google Play Billing
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { plan, provider, productId, amount, currency } = body

    if (!['monthly', 'yearly'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan. Use monthly or yearly.' }, { status: 400 })
    }

    // Only Google Play Billing is accepted
    if (provider && provider !== 'google_play') {
      return NextResponse.json({ error: 'Only Google Play Billing is supported.' }, { status: 400 })
    }

    let user = await db.userProfile.findFirst()
    if (!user) {
      user = await db.userProfile.create({
        data: { id: 'default-user', name: 'User', email: 'user@safeeat.ai' }
      })
    }

    // In production, verify the purchase token with Google Play Developer API
    // For now, simulate successful purchase verification
    const googlePlayOrderId = `GPA.${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

    // Upsert subscription
    const existing = await db.subscription.findFirst()
    const now = new Date()
    const endDate = new Date(now)
    if (plan === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1)
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1)
    }

    const subscriptionData = {
      plan,
      provider: 'google_play',
      providerId: googlePlayOrderId,
      status: 'active',
      startDate: now,
      endDate,
      amount: amount || (plan === 'monthly' ? 299 : 1999),
      currency: currency || 'INR',
    }

    let subscription
    if (existing) {
      subscription = await db.subscription.update({
        where: { id: existing.id },
        data: subscriptionData,
      })
    } else {
      subscription = await db.subscription.create({
        data: {
          userId: user.id,
          ...subscriptionData,
        },
      })
    }

    // Update user premium status
    await db.userProfile.update({
      where: { id: user.id },
      data: { isPremium: true, premiumExpiry: endDate }
    })

    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription.id,
        plan: subscription.plan,
        provider: subscription.provider,
        providerId: subscription.providerId,
        status: subscription.status,
        startDate: subscription.startDate?.toISOString(),
        endDate: subscription.endDate?.toISOString(),
        amount: subscription.amount,
        currency: subscription.currency,
      }
    })
  } catch (error) {
    console.error('Create subscription error:', error)
    return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 })
  }
}

// DELETE - Cancel subscription
export async function DELETE() {
  try {
    const existing = await db.subscription.findFirst()
    if (existing) {
      await db.subscription.update({
        where: { id: existing.id },
        data: { status: 'cancelled' }
      })
    }

    let user = await db.userProfile.findFirst()
    if (user) {
      await db.userProfile.update({
        where: { id: user.id },
        data: { isPremium: false, premiumExpiry: null }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Cancel subscription error:', error)
    return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 })
  }
}
