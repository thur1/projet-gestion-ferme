import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { useLotRecords } from '../useLotRecords'
import {
  listLotRecords,
  createLotRecord,
  type LotDailyRecord,
  type CreateLotRecordPayload,
} from '../../lib/api-client'

vi.mock('../../lib/api-client', () => ({
  listLotRecords: vi.fn(),
  createLotRecord: vi.fn(),
}))

const mockedListRecords = vi.mocked(listLotRecords)
const mockedCreateRecord = vi.mocked(createLotRecord)

describe('useLotRecords', () => {
  const sampleRecords: LotDailyRecord[] = [
    {
      id: 'rec-1',
      lot: 'lot-42',
      date: '2025-02-01',
      mortality: 0,
      feed_intake_kg: 12,
      milk_production_l: 0,
      eggs_count: 0,
      avg_weight_kg: 1.2,
      notes: 'bonne journee',
    },
  ]

  const payload: CreateLotRecordPayload = {
    lot: 'lot-42',
    date: '2025-02-02',
    mortality: 1,
    feed_intake_kg: 10,
    milk_production_l: 0,
    eggs_count: 0,
    avg_weight_kg: 1.25,
    notes: 'leger incident',
  }

  beforeEach(() => {
    mockedListRecords.mockReset()
    mockedCreateRecord.mockReset()
  })

  it('charge les releves et expose les donnees', async () => {
    mockedListRecords.mockResolvedValue(sampleRecords)

    const { result } = renderHook(() => useLotRecords('lot-42'))

    expect(result.current.loading).toBe(true)

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.data).toEqual(sampleRecords)
    expect(result.current.error).toBe('')
  })

  it('gere les erreurs de chargement', async () => {
    mockedListRecords.mockRejectedValue(new Error('load lot failed'))

    const { result } = renderHook(() => useLotRecords('lot-42'))

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.data).toEqual([])
    expect(result.current.error).toBe('load lot failed')
  })

  it('cree un releve et met a jour la liste', async () => {
    mockedListRecords.mockResolvedValue([])
    const created: LotDailyRecord = { id: 'rec-2', ...payload }
    mockedCreateRecord.mockResolvedValue(created)

    const { result } = renderHook(() => useLotRecords('lot-42'))

    await waitFor(() => expect(result.current.loading).toBe(false))

    const res = await act(async () => result.current.create(payload))
    expect(res).toEqual({ success: true, record: created })
    await waitFor(() => expect(result.current.data[0]).toEqual(created))
  })

  it('retourne une erreur quand la creation echoue', async () => {
    mockedListRecords.mockResolvedValue([])
    mockedCreateRecord.mockRejectedValue(new Error('create lot failed'))

    const { result } = renderHook(() => useLotRecords('lot-42'))

    await waitFor(() => expect(result.current.loading).toBe(false))

    const res = await act(async () => result.current.create(payload))
    expect(res).toEqual({ success: false, error: 'create lot failed' })
    await waitFor(() => expect(result.current.error).toBe('create lot failed'))
  })
})
