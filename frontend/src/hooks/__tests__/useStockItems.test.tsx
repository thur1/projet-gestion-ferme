import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { useStockItems } from '../useStockItems'
import { listStockItems, type StockItem } from '../../lib/api-client'

vi.mock('../../lib/api-client', () => ({
  listStockItems: vi.fn(),
}))

const mockedListStockItems = vi.mocked(listStockItems)

describe('useStockItems', () => {
  const sampleItems: StockItem[] = [
    {
      id: '1',
      farm: 'f1',
      name: 'Maïs',
      item_type: 'feed',
      quantity: 120,
      unit: 'kg',
      alert_threshold: 10,
    },
  ]

  beforeEach(() => {
    mockedListStockItems.mockReset()
  })

  it('charge le stock et expose les données', async () => {
    mockedListStockItems.mockResolvedValue(sampleItems)

    const { result } = renderHook(() => useStockItems())

    expect(result.current.loading).toBe(true)

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.data).toEqual(sampleItems)
    expect(result.current.error).toBe('')
  })

  it('gère les erreurs et expose le message', async () => {
    mockedListStockItems.mockRejectedValue(new Error('rupture API'))

    const { result } = renderHook(() => useStockItems())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.data).toEqual([])
    expect(result.current.error).toBe('rupture API')
  })
})
