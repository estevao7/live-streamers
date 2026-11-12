import type { ApiStreamer, Streamer } from '../types/streamer'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parseStreamer(value: unknown, index: number): Streamer {
  if (!isRecord(value)) {
    throw new TypeError(`Invalid streamer at index ${index}: expected an object`)
  }

  const stringFields: (keyof ApiStreamer)[] = [
    'username',
    'avatar',
    'twitch_url',
  ]

  for (const field of stringFields) {
    if (value[field] !== undefined && typeof value[field] !== 'string') {
      throw new TypeError(
        `Invalid streamer at index ${index}: "${field}" has an invalid type`,
      )
    }
  }

  if (value.is_live !== undefined && typeof value.is_live !== 'boolean') {
    throw new TypeError(
      `Invalid streamer at index ${index}: "is_live" has an invalid type`,
    )
  }

  return {
    ...(typeof value.username === 'string' && { username: value.username }),
    ...(typeof value.avatar === 'string' && { avatar: value.avatar }),
      ...(typeof value['twitch_url'] === 'string' && {
        twitchUrl: value['twitch_url'],
      }),
    ...(typeof value.is_live === 'boolean' && { isLive: value.is_live }),
  }
}

export function normalizeStreamersResponse(payload: unknown): Streamer[] {
  if (!isRecord(payload) || !Array.isArray(payload.streamers)) {
    throw new TypeError('Invalid streamers response: X')
  }

  return payload.streamers.map(parseStreamer)
}
