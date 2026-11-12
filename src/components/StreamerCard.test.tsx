import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StreamerCard } from './StreamerCard'

describe('StreamerCard', () => {
  it('displays the available streamer details and an accessible avatar', () => {
    render(
      <StreamerCard
        streamer={{
          username: 'ChessPlayer',
          avatar: 'https://example.com/avatar.png',
          isLive: true,
        }}
      />,
    )

    expect(
      screen.getByRole('heading', { name: 'ChessPlayer' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Avatar de ChessPlayer' })).toHaveAttribute(
      'src',
      'https://example.com/avatar.png',
    )
    expect(screen.getByText('Ao vivo')).toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: /Twitch/i }),
    ).not.toBeInTheDocument()
  })

  it('provides neutral accessible fallbacks for missing avatar and username', () => {
    render(<StreamerCard streamer={{}} />)

    expect(
      screen.getByRole('heading', { name: 'Streamer sem nome' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('img', {
        name: 'Avatar indisponível para Streamer sem nome',
      }),
    ).toBeInTheDocument()
    expect(screen.getByText('Status indisponível')).toBeInTheDocument()
  })

  it.each([
    [true, 'Ao vivo', 'streamer-card__status--live'],
    [false, 'Offline', 'streamer-card__status--offline'],
    [undefined, 'Status indisponível', 'streamer-card__status--unavailable'],
  ] as const)('shows %s status as text and with its visual state', (isLive, label, className) => {
    render(<StreamerCard streamer={{ isLive }} />)

    expect(screen.getByText(label).closest('p')).toHaveClass(className)
  })

  it('links to the provided Twitch URL in a protected new tab', () => {
    render(
      <StreamerCard
        streamer={{
          username: 'ChessPlayer',
          twitchUrl: 'https://twitch.tv/chessplayer',
        }}
      />,
    )

    expect(
      screen.getByRole('link', { name: 'Assistir ChessPlayer na Twitch' }),
    ).toHaveAttribute('href', 'https://twitch.tv/chessplayer')
    expect(
      screen.getByRole('link', { name: 'Assistir ChessPlayer na Twitch' }),
    ).toHaveAttribute('target', '_blank')
    expect(
      screen.getByRole('link', { name: 'Assistir ChessPlayer na Twitch' }),
    ).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
