import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Fetch scan history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || 'default-user'
    const limit = parseInt(searchParams.get('limit') || '20')

    // Ensure user exists
    let user = await db.userProfile.findFirst()
    if (!user) {
      user = await db.userProfile.create({
        data: { id: 'default-user', name: 'User', email: 'user@safteyeat.ai' }
      })
    }

    const scans = await db.scan.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    const formatted = scans.map(scan => ({
      id: scan.id,
      productName: scan.productName,
      safetyScore: scan.safetyScore,
      riskLevel: scan.riskLevel,
      ingredients: JSON.parse(scan.ingredients),
      warnings: JSON.parse(scan.warnings),
      allergenAlerts: JSON.parse(scan.allergenAlerts),
      nutritionSummary: JSON.parse(scan.nutritionSummary),
      aiAnalysis: scan.aiAnalysis,
      imageData: scan.imageData,
      scanType: scan.scanType,
      comboItems: JSON.parse(scan.comboItems),
      isSaved: scan.isSaved,
      createdAt: scan.createdAt.toISOString(),
    }))

    return NextResponse.json({ success: true, scans: formatted })
  } catch (error) {
    console.error('Fetch scans error:', error)
    return NextResponse.json({ error: 'Failed to fetch scans' }, { status: 500 })
  }
}

// POST - Save a new scan
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, ...scanData } = body

    // Ensure user exists
    let user = await db.userProfile.findFirst()
    if (!user) {
      user = await db.userProfile.create({
        data: { id: 'default-user', name: 'User', email: 'user@safteyeat.ai' }
      })
    }

    const scan = await db.scan.create({
      data: {
        userId: user.id,
        productName: scanData.productName || 'Unknown Product',
        ingredients: JSON.stringify(scanData.ingredients || []),
        safetyScore: scanData.safetyScore ?? 50,
        riskLevel: scanData.riskLevel || 'medium',
        warnings: JSON.stringify(scanData.warnings || []),
        allergenAlerts: JSON.stringify(scanData.allergenAlerts || []),
        nutritionSummary: JSON.stringify(scanData.nutritionSummary || {}),
        aiAnalysis: scanData.aiAnalysis || '',
        imageData: scanData.imageData || null,
        scanType: scanData.scanType || 'text',
        comboItems: JSON.stringify(scanData.comboItems || []),
        isSaved: scanData.isSaved || false,
      }
    })

    // Increment scan count
    await db.userProfile.update({
      where: { id: user.id },
      data: { scanCount: { increment: 1 } }
    })

    return NextResponse.json({ success: true, scanId: scan.id })
  } catch (error) {
    console.error('Save scan error:', error)
    return NextResponse.json({ error: 'Failed to save scan' }, { status: 500 })
  }
}

// DELETE - Clear scan history
export async function DELETE(request: NextRequest) {
  try {
    let user = await db.userProfile.findFirst()
    if (!user) {
      user = await db.userProfile.create({
        data: { id: 'default-user', name: 'User', email: 'user@safteyeat.ai' }
      })
    }

    await db.scan.deleteMany({ where: { userId: user.id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Clear scans error:', error)
    return NextResponse.json({ error: 'Failed to clear scans' }, { status: 500 })
  }
}
