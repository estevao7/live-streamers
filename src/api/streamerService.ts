import { normalizeStreamersResponse } from './streamerMapper'
import type { Streamer } from '../types/streamer'

const STREAMERS_API_URL = 'https://api.chess.com/pub/streamers'

export async function fetchStreamers(
  signal?: AbortSignal,
): Promise<Streamer[]> {
  const response = await fetch(STREAMERS_API_URL, { signal })

  if (!response.ok) {
    const statusText = response.statusText ? ` ${response.statusText}` : ''
    throw new Error(
      `Failed to fetch streamers: HTTP ${response.status}${statusText}`,
    )
  }

  const payload: unknown = await response.json()
  return normalizeStreamersResponse(payload)
}
