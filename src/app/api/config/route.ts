import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// ============================================================
// SECRET FIELD DEFINITIONS — All sections for production launch
// ============================================================

const SECRET_FIELDS: Record<string, string[]> = {
  firebase: ['apiKey', 'messagingSenderId', 'vapidKey'],
  googleplay: ['serviceAccountJson', 'licenseKey'],
  playstore: ['signingKeyBase64', 'signingKeyPassword', 'serviceAccountJson'],
  push: ['serverKey'],
  ai: ['apiKey'],
  server: ['jwtSecret', 'adminPassword', 'encryptionKey'],
  legal: [], // No secrets in legal URLs
}

// GET /api/config — Retrieve config by category (secrets masked)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    const where = category ? { category } : {}
    const configs = await db.appConfig.findMany({ where })

    // Group by category and mask secret values
    const result: Record<string, Record<string, string>> = {}
    for (const config of configs) {
      // Strip the category prefix from key for clean field names
      const rawKey = config.key.startsWith(config.category + '_')
        ? config.key.slice(config.category.length + 1)
        : config.key

      if (!result[config.category]) {
        result[config.category] = {}
      }
      result[config.category][rawKey] = config.isSecret
        ? '••••••••'
        : config.value
    }

    return NextResponse.json({ success: true, configs: result })
  } catch (error) {
    console.error('Config GET error:', error)
    return NextResponse.json({ success: false, error: 'Failed to load config' }, { status: 500 })
  }
}

// POST /api/config — Save config for a section
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { section, config } = body as {
      section: string
      config: Record<string, string>
    }

    if (!section || !config) {
      return NextResponse.json(
        { success: false, error: 'Missing section or config' },
        { status: 400 }
      )
    }

    const secretFields = SECRET_FIELDS[section] || []

    // Upsert each config key
    for (const [key, value] of Object.entries(config)) {
      if (typeof value !== 'string') continue
      // Skip masked values — user didn't change them
      if (value === '••••••••') continue
      // Skip empty values — don't overwrite with blank
      if (!value.trim()) continue

      const dbKey = `${section}_${key}`
      const isSecret = secretFields.includes(key)

      await db.appConfig.upsert({
        where: { key: dbKey },
        create: {
          key: dbKey,
          value,
          category: section,
          isSecret,
        },
        update: {
          value,
          isSecret,
        },
      })
    }

    return NextResponse.json({ success: true, message: `${section} configuration saved` })
  } catch (error) {
    console.error('Config POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save config' },
      { status: 500 }
    )
  }
}

// DELETE /api/config — Delete a config section
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Missing category' },
        { status: 400 }
      )
    }

    await db.appConfig.deleteMany({ where: { category } })

    return NextResponse.json({ success: true, message: `${category} configuration deleted` })
  } catch (error) {
    console.error('Config DELETE error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete config' },
      { status: 500 }
    )
  }
}
