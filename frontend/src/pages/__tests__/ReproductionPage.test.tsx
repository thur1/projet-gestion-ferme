import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import ReproductionPage from '../Reproduction'
import { useFarms } from '../../hooks/useFarms'
import { useLots } from '../../hooks/useLots'
import { useReproductionEvents } from '../../hooks/useReproductionEvents'

vi.mock('../../hooks/useFarms', () => ({ useFarms: vi.fn() }))
vi.mock('../../hooks/useLots', () => ({ useLots: vi.fn() }))
vi.mock('../../hooks/useReproductionEvents', () => ({ useReproductionEvents: vi.fn() }))

const mockedUseFarms = vi.mocked(useFarms)
const mockedUseLots = vi.mocked(useLots)
const mockedUseRepro = vi.mocked(useReproductionEvents)

describe('ReproductionPage', () => {
  beforeEach(() => {
    mockedUseFarms.mockReset()
    mockedUseLots.mockReset()
    mockedUseRepro.mockReset()
  })

  it('affiche le chargement', () => {
    mockedUseFarms.mockReturnValue({ data: [], loading: true, error: '' })
    mockedUseLots.mockReturnValue({ data: [], loading: false, error: '', create: vi.fn(), creating: false })
    mockedUseRepro.mockReturnValue({ data: [], loading: false, error: '', create: vi.fn(), creating: false })

    render(<ReproductionPage />)

    expect(screen.getByText(/reproduction/i)).toBeInTheDocument()
    expect(screen.getByText(/chargement en cours/i)).toBeInTheDocument()
  })

  it('affiche une erreur', () => {
    mockedUseFarms.mockReturnValue({ data: [], loading: false, error: 'api down' })
    mockedUseLots.mockReturnValue({ data: [], loading: false, error: '', create: vi.fn(), creating: false })
    mockedUseRepro.mockReturnValue({ data: [], loading: false, error: '', create: vi.fn(), creating: false })

    render(<ReproductionPage />)

    expect(screen.getByText(/api down/i)).toBeInTheDocument()
  })

  it('affiche un état vide', () => {
    mockedUseFarms.mockReturnValue({ data: [{ id: 'f1', name: 'Ferme A', enterprise: 'e1', location: '' }], loading: false, error: '' })
    mockedUseLots.mockReturnValue({ data: [], loading: false, error: '', create: vi.fn(), creating: false })
    mockedUseRepro.mockReturnValue({ data: [], loading: false, error: '', create: vi.fn(), creating: false })

    render(<ReproductionPage />)

    expect(screen.getByText(/aucun événement/i)).toBeInTheDocument()
  })

  it('affiche des événements', () => {
    mockedUseFarms.mockReturnValue({ data: [{ id: 'f1', name: 'Ferme A', enterprise: 'e1', location: '' }], loading: false, error: '' })
    mockedUseLots.mockReturnValue({ data: [{ id: 'l1', code: 'LOT-1', unit: 'u1', species: 's1', entry_date: '2025-01-01', initial_count: 100, status: 'active' }], loading: false, error: '', create: vi.fn(), creating: false })
    mockedUseRepro.mockReturnValue({
      data: [
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
      ],
      loading: false,
      error: '',
      create: vi.fn(),
      creating: false,
    })

    render(<ReproductionPage />)

    expect(screen.getByText(/2025-01-10/)).toBeInTheDocument()
    expect(screen.getAllByText(/Insémination/).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/Lot: l1/i)).toBeInTheDocument()
  })
})
