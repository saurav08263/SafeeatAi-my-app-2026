import ZAI from 'z-ai-web-dev-sdk'

// ============================================================
// ZAI SDK SINGLETON — Pre-warmed + Auto-retry
// Handles "PreconditionFailed — function is pending state"
//
// Strategy:
// 1. Single persistent ZAI instance shared across all requests
// 2. Pre-warm on module load (first import)
// 3. Aggressive retry with long backoff for pending-state errors
// 4. Auto-recreate instance if it becomes stale
// ============================================================

let zaiInstance: ZAI | null = null
let initPromise: Promise<ZAI> | null = null
let isWarming = false

const MAX_INIT_RETRIES = 6
const INIT_RETRY_DELAYS = [3000, 5000, 8000, 12000, 16000, 20000] // 3s → 20s

function isPendingError(error: unknown): boolean {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase()
    return (
      msg.includes('preconditionfailed') ||
      msg.includes('pending state') ||
      msg.includes('function is pending') ||
      msg.includes('please try later') ||
      msg.includes('service unavailable') ||
      msg.includes('rate limit') ||
      msg.includes('overloaded') ||
      msg.includes('503') ||
      msg.includes('internal error')
    )
  }
  return false
}

async function initZAI(): Promise<ZAI> {
  if (zaiInstance) return zaiInstance

  // If initialization is already in progress, wait for it
  if (initPromise) return initPromise

  initPromise = (async () => {
    let lastError: unknown
    for (let attempt = 0; attempt < MAX_INIT_RETRIES; attempt++) {
      try {
        console.log(`[ZAI] Initializing SDK (attempt ${attempt + 1}/${MAX_INIT_RETRIES})...`)
        const zai = await ZAI.create()
        zaiInstance = zai
        console.log('[ZAI] ✅ SDK initialized successfully!')
        isWarming = false
        return zai
      } catch (error) {
        lastError = error
        if (isPendingError(error) && attempt < MAX_INIT_RETRIES - 1) {
          const delay = INIT_RETRY_DELAYS[attempt]
          console.warn(`[ZAI] ⏳ Function pending (attempt ${attempt + 1}/${MAX_INIT_RETRIES}), retrying in ${delay / 1000}s...`)
          await new Promise(resolve => setTimeout(resolve, delay))
          continue
        }
        // Non-retryable error or exhausted retries
        console.error(`[ZAI] ❌ SDK init failed after ${attempt + 1} attempts:`, error instanceof Error ? error.message : error)
        initPromise = null // Allow retry on next request
        throw error
      }
    }
    initPromise = null
    throw lastError
  })()

  return initPromise
}

// Get or create the ZAI singleton
export async function getZAI(): Promise<ZAI> {
  // If we have a working instance, use it
  if (zaiInstance) return zaiInstance

  // Otherwise initialize
  return initZAI()
}

// Reset the instance (force re-initialization on next request)
export function resetZAI(): void {
  zaiInstance = null
  initPromise = null
  console.log('[ZAI] 🔄 Instance reset, will re-initialize on next request')
}

// Call an AI function with automatic retry on pending errors
// If the call fails with pending error, it resets the instance and retries
export async function callAI<T>(fn: (zai: ZAI) => Promise<T>, label: string): Promise<T> {
  const MAX_CALL_RETRIES = 3
  const CALL_RETRY_DELAYS = [3000, 6000, 10000]

  let lastError: unknown
  for (let attempt = 0; attempt < MAX_CALL_RETRIES; attempt++) {
    try {
      const zai = await getZAI()
      return await fn(zai)
    } catch (error) {
      lastError = error
      if (isPendingError(error)) {
        const delay = CALL_RETRY_DELAYS[attempt]
        console.warn(`[ZAI] ⏳ ${label} pending (attempt ${attempt + 1}/${MAX_CALL_RETRIES}), retrying in ${delay / 1000}s...`)
        // Reset instance — it might be stale
        resetZAI()
        if (attempt < MAX_CALL_RETRIES - 1) {
          await new Promise(resolve => setTimeout(resolve, delay))
          continue
        }
      }
      throw error
    }
  }
  throw lastError
}

// Pre-warm the SDK at module load time
// This starts initialization immediately when the server boots
export function prewarmZAI(): void {
  if (isWarming || zaiInstance) return
  isWarming = true
  console.log('[ZAI] 🔥 Pre-warming SDK...')
  initZAI().catch((err) => {
    console.warn('[ZAI] Pre-warm failed (will retry on first request):', err instanceof Error ? err.message : err)
    isWarming = false
    initPromise = null
  })
}

// Check if the SDK is ready
export function isZAIReady(): boolean {
  return zaiInstance !== null
}

// Export the isPendingError checker for use in error handlers
export { isPendingError }

// Auto pre-warm when this module is imported
// prewarmZAI()
