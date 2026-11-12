import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchStreamers } from './api/streamerService'
import App from './App'

vi.mock('./api/streamerService', () => ({
  fetchStreamers: vi.fn(),
}))

const fetchStreamersMock = vi.mocked(fetchStreamers)

function createDeferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason: unknown) => void
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise
    reject = rejectPromise
  })

  return { promise, resolve, reject }
}

describe('App', () => {
  beforeEach(() => {
    fetchStreamersMock.mockReset()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('shows loading and renders a card for every streamer returned', async () => {
    const request = createDeferred<Awaited<ReturnType<typeof fetchStreamers>>>()
    fetchStreamersMock.mockReturnValue(request.promise)
    render(<App />)

    expect(screen.getByRole('status')).toHaveTextContent('Carregando streamers')
    expect(fetchStreamersMock).toHaveBeenCalledWith(expect.any(AbortSignal))

    await act(async () => {
      request.resolve([
        { username: 'ChessPlayer', isLive: true },
        { username: 'AnotherPlayer', isLive: false },
      ])
    })

    expect(screen.getByRole('list', { name: 'Lista de streamers' })).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByRole('heading', { name: 'ChessPlayer' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'AnotherPlayer' })).toBeInTheDocument()
    expect(screen.getByText('Ao vivo')).toBeInTheDocument()
    expect(screen.getByText('Offline')).toBeInTheDocument()
  })

  it('shows the empty state when the service returns no streamers', async () => {
    fetchStreamersMock.mockResolvedValue([])
    render(<App />)

    expect(
      await screen.findByText('Não há streamers disponíveis no momento.'),
    ).toBeInTheDocument()
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })

  it('shows an error and retries the request when requested', async () => {
    fetchStreamersMock
      .mockRejectedValueOnce(new Error('Network unavailable'))
      .mockResolvedValueOnce([{ username: 'ChessPlayer' }])
    render(<App />)

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível carregar a lista de streamers.',
    )
    fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'ChessPlayer' })).toBeInTheDocument()
    })
    expect(fetchStreamersMock).toHaveBeenCalledTimes(2)
  })

  it('aborts the request when the page unmounts', () => {
    const request = createDeferred<Awaited<ReturnType<typeof fetchStreamers>>>()
    fetchStreamersMock.mockReturnValue(request.promise)
    const { unmount } = render(<App />)
    const signal = fetchStreamersMock.mock.calls[0][0]

    unmount()

    expect(signal).toBeInstanceOf(AbortSignal)
    expect(signal?.aborted).toBe(true)
    request.resolve([])
  })
})
