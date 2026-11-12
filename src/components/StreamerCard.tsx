import type { Streamer } from '../types/streamer'
import './StreamerCard.css'

type StreamerCardProps = {
  streamer: Streamer
}

function getStatus(isLive: Streamer['isLive']) {
  if (isLive === true) {
    return { label: 'Ao vivo', className: 'streamer-card__status--live' }
  }

  if (isLive === false) {
    return { label: 'Offline', className: 'streamer-card__status--offline' }
  }

  return {
    label: 'Status indisponível',
    className: 'streamer-card__status--unavailable',
  }
}

export function StreamerCard({ streamer }: StreamerCardProps) {
  const displayName = streamer.username || 'Streamer sem nome'
  const status = getStatus(streamer.isLive)

  return (
    <div className="streamer-card">
      {streamer.avatar ? (
        <img
          className="streamer-card__avatar"
          src={streamer.avatar}
          alt={`Avatar de ${displayName}`}
        />
      ) : (
        <div
          className="streamer-card__avatar streamer-card__avatar--fallback"
          role="img"
          aria-label={`Avatar indisponível para ${displayName}`}
        >
          <span aria-hidden="true">{displayName.charAt(0).toUpperCase()}</span>
        </div>
      )}

      <div className="streamer-card__details">
        <h2 className="streamer-card__name">{displayName}</h2>
        <p
          className={`streamer-card__status ${status.className}`}
          aria-label={`Status: ${status.label}`}
        >
          <span className="streamer-card__status-indicator" aria-hidden="true" />
          {status.label}
        </p>
      </div>

      {streamer.twitchUrl && (
        <a
          className="streamer-card__link"
          href={streamer.twitchUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Assistir ${displayName} na Twitch`}
        >
          Assistir na Twitch
        </a>
      )}
    </div>
  )
}
