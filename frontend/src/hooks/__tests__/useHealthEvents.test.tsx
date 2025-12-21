import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { useHealthEvents } from '../useHealthEvents'
import { listHealthEvents, type HealthEvent } from '../../lib/api-client'

vi.mock('../../lib/api-client', () => ({
  listHealthEvents: vi.fn(),
}))

const mockedListHealthEvents = vi.mocked(listHealthEvents)

describe('useHealthEvents', () => {
  const sampleEvents: HealthEvent[] = [
    {
      id: '2',
      lot: '2',
      event_type: 'vaccination',
      date: '2025-01-15',
      product: 'Vaccination annuelle',
    },
  ]

  beforeEach(() => {
    mockedListHealthEvents.mockReset()
  })

  it('charge les évènements et expose les données', async () => {
    mockedListHealthEvents.mockResolvedValue(sampleEvents)

    const { result } = renderHook(() => useHealthEvents())

    expect(result.current.loading).toBe(true)

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.data).toEqual(sampleEvents)
    expect(result.current.error).toBe('')
  })

  it('gère les erreurs et expose le message', async () => {
    mockedListHealthEvents.mockRejectedValue(new Error('oups'))

    const { result } = renderHook(() => useHealthEvents())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.data).toEqual([])
    expect(result.current.error).toBe('oups')
  })
})
