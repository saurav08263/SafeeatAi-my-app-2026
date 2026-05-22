// ============================================================
// Frontend AI API utility — Auto-retry for pending/warming errors
// Handles "PreconditionFailed — function is pending state"
// ============================================================

interface FetchOptions extends RequestInit {
  body?: string
}

const MAX_RETRIES = 3
const RETRY_DELAYS = [3000, 6000, 10000] // 3s, 6s, 10s

function isRetryableError(data: { isPending?: boolean; error?: string }, status: number): boolean {
  if (data.isPending) return true
  if (status === 503) return true
  if (data.error?.toLowerCase().includes('warming up')) return true
  if (data.error?.toLowerCase().includes('initializing')) return true
  if (data.error?.toLowerCase().includes('pending')) return true
  return false
}

/**
 * Fetch with auto-retry for AI pending/warming-up errors.
 * Usage: const data = await fetchWithRetry('/api/analyze', { method: 'POST', body: JSON.stringify({...}) })
 */
export async function fetchWithRetry<T = Record<string, unknown>>(
  url: string,
  options: FetchOptions = {},
  retries = MAX_RETRIES
): Promise<T> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })

      const data = await response.json()

      // Check if it's a retryable pending error
      if (!response.ok && isRetryableError(data, response.status) && attempt < retries) {
        const delay = RETRY_DELAYS[Math.min(attempt, RETRY_DELAYS.length - 1)]
        console.warn(`[AI] Service pending (attempt ${attempt + 1}/${retries + 1}), retrying in ${delay / 1000}s...`)
        await new Promise(resolve => setTimeout(resolve, delay))
        continue
      }

      // If response is ok, return the data
      if (response.ok) {
        return data as T
      }

      // Non-retryable error — throw with message
      throw new Error(data.error || data.message || `Request failed with status ${response.status}`)
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      // Network errors — retry if we have retries left
      if (attempt < retries && lastError.message.includes('Failed to fetch')) {
        const delay = RETRY_DELAYS[Math.min(attempt, RETRY_DELAYS.length - 1)]
        console.warn(`[AI] Network error (attempt ${attempt + 1}/${retries + 1}), retrying in ${delay / 1000}s...`)
        await new Promise(resolve => setTimeout(resolve, delay))
        continue
      }

      if (attempt >= retries) {
        throw lastError
      }
    }
  }

  throw lastError || new Error('Request failed after retries')
}
