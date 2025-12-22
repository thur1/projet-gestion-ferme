import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { useReproductionEvents } from '../useReproductionEvents'
import {
  listReproductionEvents,
  createReproductionEvent,
  type ReproductionEvent,
  type CreateReproductionEventPayload,
} from '../../lib/api-client'

vi.mock('../../lib/api-client', () => ({
  listReproductionEvents: vi.fn(),
  createReproductionEvent: vi.fn(),
}))

const mockedListRepro = vi.mocked(listReproductionEvents)
const mockedCreateRepro = vi.mocked(createReproductionEvent)

describe('useReproductionEvents', () => {
  const sampleEvents: ReproductionEvent[] = [
    {
      id: 'r1',
      lot: 'l1',
      date: '2025-01-10',
      event_type: 'insemination',
      gestation_days: 0,
      born_alive: 0,
      born_dead: 0,
      notes: 'RAS',
    },
  ]

  const payload: CreateReproductionEventPayload = {
    lot: 'l1',
    date: '2025-01-12',
    event_type: 'gestation_check',
    gestation_days: 30,
    born_alive: 0,
    born_dead: 0,
    notes: 'check ok',
  }

  beforeEach(() => {
    mockedListRepro.mockReset()
    mockedCreateRepro.mockReset()
  })

  it('charge les evenements et expose les donnees', async () => {
    mockedListRepro.mockResolvedValue(sampleEvents)

    const { result } = renderHook(() => useReproductionEvents())

    expect(result.current.loading).toBe(true)

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.data).toEqual(sampleEvents)
    expect(result.current.error).toBe('')
  })

  it('gere les erreurs de chargement', async () => {
    mockedListRepro.mockRejectedValue(new Error('oups repro'))

    const { result } = renderHook(() => useReproductionEvents())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.data).toEqual([])
    expect(result.current.error).toBe('oups repro')
  })

  it('cree un evenement et met a jour la liste', async () => {
    mockedListRepro.mockResolvedValue([])
    const created: ReproductionEvent = { id: 'r2', ...payload }
    mockedCreateRepro.mockResolvedValue(created)

    const { result } = renderHook(() => useReproductionEvents('l1'))

    await waitFor(() => expect(result.current.loading).toBe(false))

    const res = await act(async () => result.current.create(payload))
    expect(res).toEqual({ success: true, event: created })
    await waitFor(() => expect(result.current.data[0]).toEqual(created))
  })

  it('renvoie une erreur quand la creation echoue', async () => {
    mockedListRepro.mockResolvedValue([])
    mockedCreateRepro.mockRejectedValue(new Error('fail create'))

    const { result } = renderHook(() => useReproductionEvents('l1'))

    await waitFor(() => expect(result.current.loading).toBe(false))

    const res = await act(async () => result.current.create(payload))
    expect(res).toEqual({ success: false, error: 'fail create' })
    await waitFor(() => expect(result.current.error).toBe('fail create'))
  })
})
