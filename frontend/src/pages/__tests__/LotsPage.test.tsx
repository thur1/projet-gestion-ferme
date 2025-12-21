import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import LotsPage from '../Lots'
import { useLots } from '../../hooks/useLots'
import { useUnits } from '../../hooks/useUnits'
import { useFarms } from '../../hooks/useFarms'

vi.mock('../../hooks/useLots', () => ({
  useLots: vi.fn(),
}))
vi.mock('../../hooks/useUnits', () => ({
  useUnits: vi.fn(),
}))
vi.mock('../../hooks/useFarms', () => ({
  useFarms: vi.fn(),
}))

const mockedUseLots = vi.mocked(useLots)
const mockedUseUnits = vi.mocked(useUnits)
const mockedUseFarms = vi.mocked(useFarms)

describe('LotsPage', () => {
  beforeEach(() => {
    mockedUseLots.mockReset()
    mockedUseUnits.mockReset()
    mockedUseFarms.mockReset()
  })

  it('affiche le chargement', () => {
    mockedUseLots.mockReturnValue({ data: [], loading: true, error: '', create: vi.fn(), creating: false })
    mockedUseUnits.mockReturnValue({ data: [], loading: false, error: '', create: vi.fn(), creating: false })
    mockedUseFarms.mockReturnValue({ data: [], loading: false, error: '' })

    render(<LotsPage />)

    expect(screen.getByText(/lots/i)).toBeInTheDocument()
    expect(screen.getByText(/chargement en cours/i)).toBeInTheDocument()
  })

  it('affiche une erreur', () => {
    mockedUseLots.mockReturnValue({ data: [], loading: false, error: 'erreur lots', create: vi.fn(), creating: false })
    mockedUseUnits.mockReturnValue({ data: [], loading: false, error: '', create: vi.fn(), creating: false })
    mockedUseFarms.mockReturnValue({ data: [], loading: false, error: '' })

    render(<LotsPage />)

    expect(screen.getByText(/erreur lots/i)).toBeInTheDocument()
  })

  it('affiche un état vide', () => {
    mockedUseLots.mockReturnValue({ data: [], loading: false, error: '', create: vi.fn(), creating: false })
    mockedUseUnits.mockReturnValue({ data: [], loading: false, error: '', create: vi.fn(), creating: false })
    mockedUseFarms.mockReturnValue({ data: [], loading: false, error: '' })

    render(<LotsPage />)

    expect(screen.getByText(/aucun lot/i)).toBeInTheDocument()
  })

  it('affiche la liste des lots', () => {
    mockedUseLots.mockReturnValue({
      data: [
        { id: '1', unit: 'u1', species: 'sp1', code: 'LOT-A', entry_date: '2025-01-01', initial_count: 45, status: 'active' },
      ],
      loading: false,
      error: '',
      create: vi.fn(),
      creating: false,
    })
    mockedUseUnits.mockReturnValue({
      data: [{ id: 'u1', farm: 'f1', species: 'sp1', name: 'Unit A', capacity: 100 }],
      loading: false,
      error: '',
      create: vi.fn(),
      creating: false,
    })
    mockedUseFarms.mockReturnValue({
      data: [{ id: 'f1', name: 'Ferme Nord', enterprise: 'ent', location: '' }],
      loading: false,
      error: '',
    })

    render(<LotsPage />)

    expect(screen.getByText(/lot-a/i)).toBeInTheDocument()
    expect(screen.getByText(/effectif initial: 45/i)).toBeInTheDocument()
    expect(screen.getByText(/unit #u1/i)).toBeInTheDocument()
    expect(screen.getAllByText(/ferme nord/i).length).toBeGreaterThanOrEqual(1)
  })

  it('filtre par ferme', () => {
    mockedUseLots.mockReturnValue({
      data: [
        { id: '1', unit: 'u1', species: 'sp1', code: 'LOT-A', entry_date: '2025-01-01', initial_count: 45, status: 'active' },
        { id: '2', unit: 'u2', species: 'sp1', code: 'LOT-B', entry_date: '2025-01-01', initial_count: 30, status: 'closed' },
      ],
      loading: false,
      error: '',
      create: vi.fn(),
      creating: false,
    })
    mockedUseUnits.mockReturnValue({
      data: [
        { id: 'u1', farm: 'f1', species: 'sp1', name: 'Unit A', capacity: 100 },
        { id: 'u2', farm: 'f2', species: 'sp1', name: 'Unit B', capacity: 80 },
      ],
      loading: false,
      error: '',
      create: vi.fn(),
      creating: false,
    })
    mockedUseFarms.mockReturnValue({
      data: [
        { id: 'f1', name: 'Ferme Nord', enterprise: 'ent', location: '' },
        { id: 'f2', name: 'Ferme Sud', enterprise: 'ent', location: '' },
      ],
      loading: false,
      error: '',
    })

    render(<LotsPage />)

    expect(screen.getByText(/lot-a/i)).toBeInTheDocument()
    expect(screen.getByText(/lot-b/i)).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText(/filtrer par ferme/i), { target: { value: 'f2' } })

    expect(screen.queryByText(/lot-a/i)).not.toBeInTheDocument()
    expect(screen.getByText(/lot-b/i)).toBeInTheDocument()
  })
})
