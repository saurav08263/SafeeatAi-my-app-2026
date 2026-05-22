import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const totalUsers = await db.userProfile.count()
    const premiumUsers = await db.userProfile.count({ where: { isPremium: true } })
    const totalScans = await db.scan.count()
    const activeTrials = await db.userProfile.count({ where: { isTrialUsed: true, isPremium: false } })

    let totalRevenue = 0
    try {
      const subscriptions = await db.subscription.findMany({ where: { status: 'active' } })
      totalRevenue = subscriptions.reduce((sum, s) => sum + s.amount, 0)
    } catch {
      // Subscription table might be empty
    }

    let recentScans: Array<{
      id: string; productName: string; safetyScore: number;
      riskLevel: string; scanType: string; createdAt: string; userName: string;
    }> = []
    try {
      const scans = await db.scan.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { user: { select: { name: true } } },
      })
      recentScans = scans.map(s => ({
        id: s.id,
        productName: s.productName,
        safetyScore: s.safetyScore,
        riskLevel: s.riskLevel,
        scanType: s.scanType,
        createdAt: s.createdAt.toISOString(),
        userName: s.user.name,
      }))
    } catch {
      // Scan table might be empty
    }

    let recentUsers: Array<{
      id: string; name: string; email: string;
      isPremium: boolean; scanCount: number; createdAt: string;
    }> = []
    try {
      const users = await db.userProfile.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
      })
      recentUsers = users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        isPremium: u.isPremium,
        scanCount: u.scanCount,
        createdAt: u.createdAt.toISOString(),
      }))
    } catch {
      // User table might be empty
    }

    // Scan type distribution
    let scanTypeCount: Record<string, number> = {}
    try {
      const allScans = await db.scan.findMany({ select: { scanType: true } })
      for (const scan of allScans) {
        scanTypeCount[scan.scanType] = (scanTypeCount[scan.scanType] || 0) + 1
      }
    } catch {
      // Ignore
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        premiumUsers,
        totalScans,
        totalRevenue,
        monthlyRevenue: totalRevenue * 0.3,
        activeTrials,
        scanTypeCount,
      },
      recentScans,
      recentUsers,
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json({
      success: true,
      stats: {
        totalUsers: 0,
        premiumUsers: 0,
        totalScans: 0,
        totalRevenue: 0,
        monthlyRevenue: 0,
        activeTrials: 0,
        scanTypeCount: {},
      },
      recentScans: [],
      recentUsers: [],
    })
  }
}
