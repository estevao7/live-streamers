import { useEffect, useState } from 'react'
import { fetchStreamers } from './api/streamerService'
import { StreamerCard } from './components/StreamerCard'
import type { Streamer } from './types/streamer'
import './App.css'

type StreamersState =
  | { status: 'loading' }
  | { status: 'success'; streamers: Streamer[] }
  | { status: 'error' }

function App() {
  const [retryCount, setRetryCount] = useState(0)
  const [streamersState, setStreamersState] = useState<StreamersState>({
    status: 'loading',
  })

  useEffect(() => {
    const controller = new AbortController()

    fetchStreamers(controller.signal).then(
      (streamers) => {
        if (!controller.signal.aborted) {
          setStreamersState({ status: 'success', streamers })
        }
      },
      () => {
        if (!controller.signal.aborted) {
          setStreamersState({ status: 'error' })
        }
      },
    )

    return () => controller.abort()
  }, [retryCount])

  function retryLoading() {
    setStreamersState({ status: 'loading' })
    setRetryCount((count) => count + 1)
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="site-header__content">
          <p className="site-header__eyebrow">Comunidade Chess.com</p>
          <h1>Streamers do Chess.com</h1>
          <p className="site-header__subtitle">Veja quem está ao vivo agora</p>
        </div>
      </header>

      <main className="main-content" aria-label="Streamers">
        <div className="streamers-content">
          {streamersState.status === 'loading' && (
            <p className="streamers-feedback" role="status">
              Carregando streamers...
            </p>
          )}

          {streamersState.status === 'error' && (
            <div className="streamers-feedback streamers-feedback--error" role="alert">
              <p>Não foi possível carregar a lista de streamers.</p>
              <button
                className="streamers-retry"
                type="button"
                onClick={retryLoading}
              >
                Tentar novamente
              </button>
            </div>
          )}

          {streamersState.status === 'success' &&
            (streamersState.streamers.length > 0 ? (
              <ul className="streamers-list" aria-label="Lista de streamers">
                {streamersState.streamers.map((streamer) => (
                  <li key={streamer.username}>
                    <StreamerCard streamer={streamer} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="streamers-feedback" role="status">
                Não há streamers disponíveis no momento.
              </p>
            ))}
        </div>
      </main>
    </div>
  )
}

export default App
