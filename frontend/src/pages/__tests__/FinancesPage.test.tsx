import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import FinancesPage from '../Finances'
import { useFarms } from '../../hooks/useFarms'
import { useLots } from '../../hooks/useLots'
import { useFinancialEntries } from '../../hooks/useFinancialEntries'

vi.mock('../../hooks/useFarms', () => ({ useFarms: vi.fn() }))
vi.mock('../../hooks/useLots', () => ({ useLots: vi.fn() }))
vi.mock('../../hooks/useFinancialEntries', () => ({ useFinancialEntries: vi.fn() }))

const mockedUseFarms = vi.mocked(useFarms)
const mockedUseLots = vi.mocked(useLots)
const mockedUseFin = vi.mocked(useFinancialEntries)

describe('FinancesPage', () => {
  beforeEach(() => {
    mockedUseFarms.mockReset()
    mockedUseLots.mockReset()
    mockedUseFin.mockReset()
  })

  it('affiche le chargement', () => {
    mockedUseFarms.mockReturnValue({ data: [], loading: true, error: '' })
    mockedUseLots.mockReturnValue({ data: [], loading: false, error: '', create: vi.fn(), creating: false })
    mockedUseFin.mockReturnValue({ data: [], loading: false, error: '', create: vi.fn(), creating: false })

    render(<FinancesPage />)

    expect(screen.getByText(/finances/i)).toBeInTheDocument()
    expect(screen.getByText(/chargement en cours/i)).toBeInTheDocument()
  })

  it('affiche une erreur', () => {
    mockedUseFarms.mockReturnValue({ data: [], loading: false, error: 'api down' })
    mockedUseLots.mockReturnValue({ data: [], loading: false, error: '', create: vi.fn(), creating: false })
    mockedUseFin.mockReturnValue({ data: [], loading: false, error: '', create: vi.fn(), creating: false })

    render(<FinancesPage />)

    expect(screen.getByText(/api down/i)).toBeInTheDocument()
  })

  it('affiche un état vide', () => {
    mockedUseFarms.mockReturnValue({ data: [{ id: 'f1', name: 'Ferme A', enterprise: 'e1', location: '' }], loading: false, error: '' })
    mockedUseLots.mockReturnValue({ data: [], loading: false, error: '', create: vi.fn(), creating: false })
    mockedUseFin.mockReturnValue({ data: [], loading: false, error: '', create: vi.fn(), creating: false })

    render(<FinancesPage />)

    expect(screen.getByText(/aucune entrée/i)).toBeInTheDocument()
  })

  it('affiche des entrées financières et les totaux', () => {
    mockedUseFarms.mockReturnValue({ data: [{ id: 'f1', name: 'Ferme A', enterprise: 'e1', location: '' }], loading: false, error: '' })
    mockedUseLots.mockReturnValue({ data: [{ id: 'l1', code: 'LOT-1', unit: 'u1', species: 's1', entry_date: '2025-01-01', initial_count: 100, status: 'active' }], loading: false, error: '', create: vi.fn(), creating: false })
    mockedUseFin.mockReturnValue({
      data: [
        { id: 'fin1', farm: 'f1', lot: 'l1', date: '2025-01-02', entry_type: 'cost', category: 'feed', amount: 100, notes: 'sac' },
        { id: 'fin2', farm: 'f1', lot: null, date: '2025-01-03', entry_type: 'revenue', category: 'sale', amount: 250, notes: '' },
      ],
      loading: false,
      error: '',
      create: vi.fn(),
      creating: false,
    })

    render(<FinancesPage />)

    expect(screen.getByText(/2025-01-02/)).toBeInTheDocument()
    expect(screen.getAllByText(/Aliment/).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/250.00/).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/Résultat: 150.00/)).toBeInTheDocument()
  })
})
