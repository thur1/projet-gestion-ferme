import { render, screen } from '@testing-library/react'
import { describe, expect, it, beforeEach, vi } from 'vitest'
/* eslint-disable @typescript-eslint/no-explicit-any */
import StockPage from '../Stock'
import { useStockItems } from '../../hooks/useStockItems'
import { useFarms } from '../../hooks/useFarms'
import { useStockMovements } from '../../hooks/useStockMovements'
import { useLots } from '../../hooks/useLots'

vi.mock('../../hooks/useStockItems', () => ({
  useStockItems: vi.fn(),
}))
vi.mock('../../hooks/useFarms', () => ({
  useFarms: vi.fn(),
}))
vi.mock('../../hooks/useStockMovements', () => ({
  useStockMovements: vi.fn(),
}))
vi.mock('../../hooks/useLots', () => ({
  useLots: vi.fn(),
}))

const mockedUseStockItems = vi.mocked(useStockItems)
const mockedUseFarms = vi.mocked(useFarms) as unknown as { mockReturnValue: (value: any) => void; mockReset: () => void }
const mockedUseStockMovements = vi.mocked(useStockMovements)
const mockedUseLots = vi.mocked(useLots)

describe('StockPage', () => {
  beforeEach(() => {
    mockedUseStockItems.mockReset()
    mockedUseFarms.mockReset()
    mockedUseStockMovements.mockReset()
    mockedUseLots.mockReset()
  })

  it('affiche le chargement', () => {
    mockedUseStockItems.mockReturnValue({ data: [], loading: true, error: '', createItem: vi.fn(), creating: false })
    mockedUseFarms.mockReturnValue({ data: [], loading: false, error: '' })
    mockedUseStockMovements.mockReturnValue({ data: [], loading: false, error: '', create: vi.fn(), creating: false })
    mockedUseLots.mockReturnValue({ data: [], loading: false, error: '', create: vi.fn(), creating: false })

    render(<StockPage />)

    expect(screen.getByText(/stock/i)).toBeInTheDocument()
    expect(screen.getByText(/chargement en cours/i)).toBeInTheDocument()
  })

  it('affiche une erreur', () => {
    mockedUseStockItems.mockReturnValue({ data: [], loading: false, error: 'rupture api', createItem: vi.fn(), creating: false })
    mockedUseFarms.mockReturnValue({ data: [], loading: false, error: '' })
    mockedUseStockMovements.mockReturnValue({ data: [], loading: false, error: '', create: vi.fn(), creating: false })
    mockedUseLots.mockReturnValue({ data: [], loading: false, error: '', create: vi.fn(), creating: false })

    render(<StockPage />)

    expect(screen.getByText(/rupture api/i)).toBeInTheDocument()
  })

  it('affiche un état vide', () => {
    mockedUseStockItems.mockReturnValue({ data: [], loading: false, error: '', createItem: vi.fn(), creating: false })
    mockedUseFarms.mockReturnValue({ data: [], loading: false, error: '' })
    mockedUseStockMovements.mockReturnValue({ data: [], loading: false, error: '', create: vi.fn(), creating: false })
    mockedUseLots.mockReturnValue({ data: [], loading: false, error: '', create: vi.fn(), creating: false })

    render(<StockPage />)

    expect(screen.getByText(/aucun article/i)).toBeInTheDocument()
  })

  it('affiche la liste du stock', () => {
    mockedUseStockItems.mockReturnValue({
      data: [
        {
          id: '1',
          farm: 'f1',
          name: 'Maïs',
          item_type: 'feed',
          quantity: 50,
          unit: 'kg',
          alert_threshold: 10,
        },
      ],
      loading: false,
      error: '',
      createItem: vi.fn(),
      creating: false,
    })
    mockedUseFarms.mockReturnValue({ data: [{ id: 'f1', name: 'Ferme Nord', enterprise: 'ent', location: '' }], loading: false, error: '' })
    mockedUseStockMovements.mockReturnValue({ data: [], loading: false, error: '', create: vi.fn(), creating: false })
    mockedUseLots.mockReturnValue({ data: [], loading: false, error: '', create: vi.fn(), creating: false })

    render(<StockPage />)

    expect(screen.getAllByText(/maïs/i)[0]).toBeInTheDocument()
    expect(screen.getByText(/50 kg/i)).toBeInTheDocument()
    expect(screen.getByText(/feed/i)).toBeInTheDocument()
    expect(screen.getAllByText(/ferme nord/i).length).toBeGreaterThanOrEqual(1)
  })
})
