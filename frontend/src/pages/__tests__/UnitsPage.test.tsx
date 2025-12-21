import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import UnitsPage from '../Units'
import { useUnits } from '../../hooks/useUnits'
import { useFarms } from '../../hooks/useFarms'
import { useSpecies } from '../../hooks/useSpecies'

vi.mock('../../hooks/useUnits', () => ({
  useUnits: vi.fn(),
}))
vi.mock('../../hooks/useFarms', () => ({
  useFarms: vi.fn(),
}))
vi.mock('../../hooks/useSpecies', () => ({
  useSpecies: vi.fn(),
}))

const mockedUseUnits = vi.mocked(useUnits)
const mockedUseFarms = vi.mocked(useFarms)
const mockedUseSpecies = vi.mocked(useSpecies)

describe('UnitsPage', () => {
  beforeEach(() => {
    mockedUseUnits.mockReset()
    mockedUseFarms.mockReset()
    mockedUseSpecies.mockReset()
  })

  it('affiche le chargement', () => {
    mockedUseUnits.mockReturnValue({ data: [], loading: true, error: '', create: vi.fn(), creating: false })
    mockedUseFarms.mockReturnValue({ data: [], loading: false, error: '' })
    mockedUseSpecies.mockReturnValue({ data: [], loading: false, error: '' })

    render(<UnitsPage />)

    expect(screen.getByText(/unités/i)).toBeInTheDocument()
    expect(screen.getByText(/chargement en cours/i)).toBeInTheDocument()
  })

  it('affiche une erreur', () => {
    mockedUseUnits.mockReturnValue({ data: [], loading: false, error: 'erreur unités', create: vi.fn(), creating: false })
    mockedUseFarms.mockReturnValue({ data: [], loading: false, error: '' })
    mockedUseSpecies.mockReturnValue({ data: [], loading: false, error: '' })

    render(<UnitsPage />)

    expect(screen.getByText(/erreur unités/i)).toBeInTheDocument()
  })

  it('affiche un état vide', () => {
    mockedUseUnits.mockReturnValue({ data: [], loading: false, error: '', create: vi.fn(), creating: false })
    mockedUseFarms.mockReturnValue({ data: [], loading: false, error: '' })
    mockedUseSpecies.mockReturnValue({ data: [], loading: false, error: '' })

    render(<UnitsPage />)

    expect(screen.getByText(/aucune unité/i)).toBeInTheDocument()
  })

  it('affiche la liste des unités', () => {
    mockedUseUnits.mockReturnValue({
      data: [
        { id: '1', farm: '10', species: 'sp1', name: 'Poulailler A', capacity: 1200 },
      ],
      loading: false,
      error: '',
      create: vi.fn(),
      creating: false,
    })
    mockedUseFarms.mockReturnValue({
      data: [{ id: '10', name: 'Ferme Nord', enterprise: 'ent', location: '' }],
      loading: false,
      error: '',
    })
    mockedUseSpecies.mockReturnValue({
      data: [{ id: 'sp1', code: 'PIG', name: 'Porcin' }],
      loading: false,
      error: '',
    })

    render(<UnitsPage />)

    expect(screen.getByText(/poulailler a/i)).toBeInTheDocument()
    expect(screen.getByText(/capacité: 1200/i)).toBeInTheDocument()
    expect(screen.getAllByText(/ferme nord/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/porcin \(pig\)/i)).toBeInTheDocument()
  })

  it('filtre par ferme sélectionnée', () => {
    mockedUseUnits.mockReturnValue({
      data: [
        { id: '1', farm: '10', species: 'sp1', name: 'Poulailler A', capacity: 1200 },
        { id: '2', farm: '20', species: 'sp1', name: 'Bergerie B', capacity: 300 },
      ],
      loading: false,
      error: '',
      create: vi.fn(),
      creating: false,
    })
    mockedUseFarms.mockReturnValue({
      data: [
        { id: '10', name: 'Ferme Nord', enterprise: 'ent', location: '' },
        { id: '20', name: 'Ferme Sud', enterprise: 'ent', location: '' },
      ],
      loading: false,
      error: '',
    })
    mockedUseSpecies.mockReturnValue({
      data: [{ id: 'sp1', code: 'PIG', name: 'Porcin' }],
      loading: false,
      error: '',
    })

    render(<UnitsPage />)

    expect(screen.getByText(/poulailler a/i)).toBeInTheDocument()
    expect(screen.getByText(/bergerie b/i)).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText(/filtrer par ferme/i), { target: { value: '20' } })

    expect(screen.queryByText(/poulailler a/i)).not.toBeInTheDocument()
    expect(screen.getByText(/bergerie b/i)).toBeInTheDocument()
  })
})
