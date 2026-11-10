import { describe, expect, it } from 'vitest'
import { normalizeStreamersResponse } from './streamerMapper'

describe('normalizeStreamersResponse', () => {
  it('maps valid API data to the internal streamer model', () => {
    const result = normalizeStreamersResponse({
      streamers: [
        {
          username: 'ChessPlayer',
          avatar: 'https://example.com/avatar.png',
          'twitch-url': 'https://twitch.tv/chessplayer',
          is_live: true,
        },
      ],
    })

    expect(result).toEqual([ 
      {
        username: 'ChessPlayer',
        avatar: 'https://example.com/avatar.png',
        twitchUrl: 'https://twitch.tv/chessplayer',
        isLive: true,
      },
    ])
  })

  it('preserves absent optional fields without inventing values', () => {
    expect(normalizeStreamersResponse({ streamers: [{}] })).toEqual([{}])
  })

  it.each([
    null,
    {},
    { streamers: {} },
    { streamers: [null] },
    { streamers: [{ username: 42 }] },
    { streamers: [{ is_live: 'true' }] },
  ])('rejects invalid API data: %j', (payload) => {
    expect(() => normalizeStreamersResponse(payload)).toThrow(TypeError)
  })
})
