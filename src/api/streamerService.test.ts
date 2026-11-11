import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchStreamers } from './streamerService'

describe('fetchStreamers', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('fetches and normalizes streamers from the Chess.com API', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          streamers: [
            {
              username: 'ChessPlayer',
              'twitch-url': 'https://twitch.tv/chessplayer',
              is_live: true,
            },
          ],
        }),
        { status: 200 },
      ),
    )
    vi.stubGlobal('fetch', fetchMock)

    await expect(fetchStreamers()).resolves.toEqual([
      {
        username: 'ChessPlayer',
        twitchUrl: 'https://twitch.tv/chessplayer',
        isLive: true,
      },
    ])
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.chess.com/pub/streamers',
      { method: 'GET', signal: undefined },
    )
  })

  it('rejects unsuccessful HTTP responses with their status', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockResolvedValue(
        new Response(null, { status: 503, statusText: 'Unavailable' }),
      ),
    )

    await expect(fetchStreamers()).rejects.toThrow('HTTP 503 Unavailable')
  })

  it('propagates network errors', async () => {
    const networkError = new TypeError('Network unavailable')
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockRejectedValue(networkError),
    )

    await expect(fetchStreamers()).rejects.toBe(networkError)
  })

  it('propagates invalid response data from the mapper', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockResolvedValue(
        new Response(JSON.stringify({ streamers: {} }), { status: 200 }),
      ),
    )

    await expect(fetchStreamers()).rejects.toThrow(TypeError)
  })

  it('forwards the abort signal and preserves cancellation errors', async () => {
    const controller = new AbortController()
    const abortError = new DOMException('Request aborted', 'AbortError')
    const fetchMock = vi.fn<typeof fetch>().mockRejectedValue(abortError)
    vi.stubGlobal('fetch', fetchMock)

    await expect(fetchStreamers(controller.signal)).rejects.toBe(abortError)
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.chess.com/pub/streamers',
      { method: 'GET', signal: controller.signal },
    )
  })
})
