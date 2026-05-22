import { NextResponse } from 'next/server'
import { isZAIReady } from '@/lib/zai-sdk'

export async function GET() {
  const ready = isZAIReady()
  return NextResponse.json({ 
    status: ready ? 'active' : 'warming', 
    ready 
  })
}
