import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import AlimentationPage from '../Alimentation'
import { useFarms } from '../../hooks/useFarms'
import { useLots } from '../../hooks/useLots'
import { useLotRecords } from '../../hooks/useLotRecords'

vi.mock('../../hooks/useFarms', () => ({ useFarms: vi.fn() }))
vi.mock('../../hooks/useLots', () => ({ useLots: vi.fn() }))
vi.mock('../../hooks/useLotRecords', () => ({ useLotRecords: vi.fn() }))

const mockedUseFarms = vi.mocked(useFarms) as unknown as { mockReturnValue: (value: any) => void; mockReset: () => void }
const mockedUseLots = vi.mocked(useLots)
const mockedUseRecords = vi.mocked(useLotRecords)

describe('AlimentationPage', () => {
  beforeEach(() => {
    mockedUseFarms.mockReset()
    mockedUseLots.mockReset()
    mockedUseRecords.mockReset()
  })

  it('affiche le chargement', () => {
    mockedUseFarms.mockReturnValue({ data: [], loading: true, error: '' })
    mockedUseLots.mockReturnValue({ data: [], loading: false, error: '', create: vi.fn(), creating: false })
    mockedUseRecords.mockReturnValue({ data: [], loading: false, error: '', create: vi.fn(), creating: false })

    render(<AlimentationPage />)

    expect(screen.getByText(/alimentation/i)).toBeInTheDocument()
    expect(screen.getByText(/chargement en cours/i)).toBeInTheDocument()
  })

  it('affiche une erreur', () => {
    mockedUseFarms.mockReturnValue({ data: [], loading: false, error: 'api down' })
    mockedUseLots.mockReturnValue({ data: [], loading: false, error: '', create: vi.fn(), creating: false })
    mockedUseRecords.mockReturnValue({ data: [], loading: false, error: '', create: vi.fn(), creating: false })

    render(<AlimentationPage />)

    expect(screen.getByText(/api down/i)).toBeInTheDocument()
  })

  it('affiche un état vide', () => {
    mockedUseFarms.mockReturnValue({ data: [{ id: 'f1', name: 'Ferme A', enterprise: 'e1', location: '' }], loading: false, error: '' })
    mockedUseLots.mockReturnValue({ data: [], loading: false, error: '', create: vi.fn(), creating: false })
    mockedUseRecords.mockReturnValue({ data: [], loading: false, error: '', create: vi.fn(), creating: false })

    render(<AlimentationPage />)

    expect(screen.getByText(/aucun enregistrement/i)).toBeInTheDocument()
  })

  it('affiche des enregistrements', () => {
    mockedUseFarms.mockReturnValue({ data: [{ id: 'f1', name: 'Ferme A', enterprise: 'e1', location: '' }], loading: false, error: '' })
    mockedUseLots.mockReturnValue({ data: [{ id: 'l1', code: 'LOT-1', unit: 'u1', species: 's1', entry_date: '2025-01-01', initial_count: 100, status: 'active' }], loading: false, error: '', create: vi.fn(), creating: false })
    mockedUseRecords.mockReturnValue({
      data: [
        {
          id: 'rec1',
          lot: 'l1',
          date: '2025-01-05',
          mortality: 1,
          feed_intake_kg: 12,
          milk_production_l: 0,
          eggs_count: 200,
          avg_weight_kg: 1.2,
          notes: 'RAS',
        },
      ],
      loading: false,
      error: '',
      create: vi.fn(),
      creating: false,
    })

    render(<AlimentationPage />)

    expect(screen.getByText(/2025-01-05/)).toBeInTheDocument()
    expect(screen.getByText(/Conso: 12 kg/i)).toBeInTheDocument()
    expect(screen.getByText(/Œufs: 200/i)).toBeInTheDocument()
  })
})
