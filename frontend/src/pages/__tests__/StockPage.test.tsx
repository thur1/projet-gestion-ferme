import { render, screen } from '@testing-library/react'
import { describe, expect, it, beforeEach, vi } from 'vitest'
import StockPage from '../Stock'
import { useStockItems } from '../../hooks/useStockItems'

vi.mock('../../hooks/useStockItems', () => ({
  useStockItems: vi.fn(),
}))

const mockedUseStockItems = vi.mocked(useStockItems)

describe('StockPage', () => {
  beforeEach(() => {
    mockedUseStockItems.mockReset()
  })

  it('affiche le chargement', () => {
    mockedUseStockItems.mockReturnValue({ data: [], loading: true, error: '' })

    render(<StockPage />)

    expect(screen.getByText(/stock/i)).toBeInTheDocument()
    expect(screen.getByText(/chargement en cours/i)).toBeInTheDocument()
  })

  it('affiche une erreur', () => {
    mockedUseStockItems.mockReturnValue({ data: [], loading: false, error: 'rupture api' })

    render(<StockPage />)

    expect(screen.getByText(/rupture api/i)).toBeInTheDocument()
  })

  it('affiche un état vide', () => {
    mockedUseStockItems.mockReturnValue({ data: [], loading: false, error: '' })

    render(<StockPage />)

    expect(screen.getByText(/aucun article/i)).toBeInTheDocument()
  })

  it('affiche la liste du stock', () => {
    mockedUseStockItems.mockReturnValue({
      data: [
        {
          id: 1,
          name: 'Maïs',
          quantity: 50,
          unit: 'kg',
          category: 'alimentation',
        },
      ],
      loading: false,
      error: '',
    })

    render(<StockPage />)

    expect(screen.getByText(/maïs/i)).toBeInTheDocument()
    expect(screen.getByText(/50 kg/i)).toBeInTheDocument()
    expect(screen.getByText(/alimentation/i)).toBeInTheDocument()
  })
})
