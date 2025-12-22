import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { useFinancialEntries } from '../useFinancialEntries'
import {
  listFinancialEntries,
  createFinancialEntry,
  type FinancialEntry,
  type CreateFinancialEntryPayload,
} from '../../lib/api-client'

vi.mock('../../lib/api-client', () => ({
  listFinancialEntries: vi.fn(),
  createFinancialEntry: vi.fn(),
}))

const mockedListEntries = vi.mocked(listFinancialEntries)
const mockedCreateEntry = vi.mocked(createFinancialEntry)

describe('useFinancialEntries', () => {
  const sampleEntries: FinancialEntry[] = [
    {
      id: 'fin-1',
      farm: 'farm-1',
      lot: 'lot-1',
      date: '2025-03-01',
      entry_type: 'revenue',
      category: 'sale',
      amount: 2500,
      notes: 'vente poulets',
    },
  ]

  const payload: CreateFinancialEntryPayload = {
    farm: 'farm-1',
    lot: 'lot-1',
    date: '2025-03-02',
    entry_type: 'cost',
    category: 'feed',
    amount: 300,
    notes: 'aliment semaine',
  }

  beforeEach(() => {
    mockedListEntries.mockReset()
    mockedCreateEntry.mockReset()
  })

  it('charge les ecritures financieres avec filtres', async () => {
    mockedListEntries.mockResolvedValue(sampleEntries)

    const { result } = renderHook(() => useFinancialEntries('farm-1', 'lot-1'))

    expect(result.current.loading).toBe(true)

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.data).toEqual(sampleEntries)
    expect(result.current.error).toBe('')
  })

  it('gere les erreurs de chargement', async () => {
    mockedListEntries.mockRejectedValue(new Error('finance load fail'))

    const { result } = renderHook(() => useFinancialEntries('farm-1'))

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.data).toEqual([])
    expect(result.current.error).toBe('finance load fail')
  })

  it('cree une ecriture et met a jour la liste', async () => {
    mockedListEntries.mockResolvedValue([])
    const created: FinancialEntry = { id: 'fin-2', ...payload }
    mockedCreateEntry.mockResolvedValue(created)

    const { result } = renderHook(() => useFinancialEntries('farm-1', 'lot-1'))

    await waitFor(() => expect(result.current.loading).toBe(false))

    const res = await act(async () => result.current.create(payload))
    expect(res).toEqual({ success: true, entry: created })
    await waitFor(() => expect(result.current.data[0]).toEqual(created))
  })

  it('retourne une erreur quand la creation echoue', async () => {
    mockedListEntries.mockResolvedValue([])
    mockedCreateEntry.mockRejectedValue(new Error('finance create fail'))

    const { result } = renderHook(() => useFinancialEntries('farm-1', 'lot-1'))

    await waitFor(() => expect(result.current.loading).toBe(false))

    const res = await act(async () => result.current.create(payload))
    expect(res).toEqual({ success: false, error: 'finance create fail' })
    await waitFor(() => expect(result.current.error).toBe('finance create fail'))
  })
})
