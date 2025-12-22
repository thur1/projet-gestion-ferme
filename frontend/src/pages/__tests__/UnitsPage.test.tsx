import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import UnitsPage from '../Units'
import { useUnits } from '../../hooks/useUnits'
import { useFarms } from '../../hooks/useFarms'
import { useSpecies } from '../../hooks/useSpecies'
import { useBreedingTypes } from '../../hooks/useBreedingTypes'

vi.mock('../../hooks/useUnits', () => ({
  useUnits: vi.fn(),
}))
vi.mock('../../hooks/useFarms', () => ({
  useFarms: vi.fn(),
}))
vi.mock('../../hooks/useSpecies', () => ({
  useSpecies: vi.fn(),
}))
vi.mock('../../hooks/useBreedingTypes', () => ({
  useBreedingTypes: vi.fn(),
}))

const mockedUseUnits = vi.mocked(useUnits)
const mockedUseFarms = vi.mocked(useFarms) as unknown as { mockReturnValue: (value: any) => void; mockReset: () => void }
const mockedUseSpecies = vi.mocked(useSpecies)
const mockedUseBreedingTypes = vi.mocked(useBreedingTypes)

describe('UnitsPage', () => {
  beforeEach(() => {
    mockedUseUnits.mockReset()
    mockedUseFarms.mockReset()
    mockedUseSpecies.mockReset()
  })

  it('affiche le chargement', () => {
    mockedUseUnits.mockReturnValue({ data: [], loading: true, error: '', create: vi.fn(), creating: false })
    mockedUseFarms.mockReturnValue({
      data: [],
      loading: false,
      error: '',
      create: vi.fn(),
      creating: false,
      enterprises: [],
      createEnterprise: vi.fn(),
      creatingEnterprise: false,
    })
    mockedUseBreedingTypes.mockReturnValue({ data: [], loading: false, error: '' })
    mockedUseSpecies.mockReturnValue({ data: [], loading: false, error: '' })

    render(<UnitsPage />)

    expect(screen.getByText(/unités/i)).toBeInTheDocument()
    expect(screen.getByText(/chargement en cours/i)).toBeInTheDocument()
  })

  it('affiche une erreur', () => {
    mockedUseUnits.mockReturnValue({ data: [], loading: false, error: 'erreur unités', create: vi.fn(), creating: false })
    mockedUseFarms.mockReturnValue({
      data: [],
      loading: false,
      error: '',
      create: vi.fn(),
      creating: false,
      enterprises: [],
      createEnterprise: vi.fn(),
      creatingEnterprise: false,
    })
    mockedUseBreedingTypes.mockReturnValue({ data: [], loading: false, error: '' })
    mockedUseSpecies.mockReturnValue({ data: [], loading: false, error: '' })

    render(<UnitsPage />)

    expect(screen.getByText(/erreur unités/i)).toBeInTheDocument()
  })

  it('affiche un état vide', () => {
    mockedUseUnits.mockReturnValue({ data: [], loading: false, error: '', create: vi.fn(), creating: false })
    mockedUseFarms.mockReturnValue({
      data: [],
      loading: false,
      error: '',
      create: vi.fn(),
      creating: false,
      enterprises: [],
      createEnterprise: vi.fn(),
      creatingEnterprise: false,
    })
    mockedUseBreedingTypes.mockReturnValue({ data: [], loading: false, error: '' })
    mockedUseSpecies.mockReturnValue({ data: [], loading: false, error: '' })

    render(<UnitsPage />)

    expect(screen.getByText(/aucune unité/i)).toBeInTheDocument()
  })

  it('permet de créer une entreprise quand aucune n’existe', async () => {
    const createEnterprise = vi.fn().mockResolvedValue({
      success: true as const,
      enterprise: { id: 'ent-1', name: 'Entreprise Test', owner: 'user-1' },
    })
    mockedUseUnits.mockReturnValue({ data: [], loading: false, error: '', create: vi.fn(), creating: false })
    mockedUseFarms.mockReturnValue({
      data: [],
      loading: false,
      error: '',
      create: vi.fn(),
      creating: false,
      enterprises: [],
      createEnterprise,
      creatingEnterprise: false,
    })
    mockedUseSpecies.mockReturnValue({ data: [], loading: false, error: '' })

    render(<UnitsPage />)

    expect(screen.getByText(/aucune entreprise disponible/i)).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText(/nom de l’entreprise/i), { target: { value: 'Entreprise Test' } })
    fireEvent.click(screen.getByRole('button', { name: /créer une entreprise/i }))

    expect(createEnterprise).toHaveBeenCalledWith({ name: 'Entreprise Test' })
    expect(await screen.findByText(/entreprise créée/i)).toBeInTheDocument()
  })

  it('permet de créer une ferme depuis la page unités', async () => {
    const createFarm = vi.fn().mockResolvedValue({
      success: true as const,
      farm: { id: 'farm-1', name: 'Ferme Test', enterprise: 'ent', location: 'Paris' },
    })
    mockedUseUnits.mockReturnValue({ data: [], loading: false, error: '', create: vi.fn(), creating: false })
    mockedUseFarms.mockReturnValue({
      data: [],
      loading: false,
      error: '',
      create: createFarm,
      creating: false,
      enterprises: [{ id: 'ent', name: 'Ent', owner: 'user' }],
      createEnterprise: vi.fn(),
      creatingEnterprise: false,
    })
    mockedUseBreedingTypes.mockReturnValue({ data: [{ id: 'bt1', code: 'BOV', name: 'Bovin' }], loading: false, error: '' })
    mockedUseSpecies.mockReturnValue({ data: [{ id: 'sp1', code: 'COW', name: 'Bovin', breeding_type: 'bt1' }], loading: false, error: '' })

    render(<UnitsPage />)

    expect(screen.getByText(/aucune ferme disponible/i)).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText(/nom de la ferme/i), { target: { value: 'Ferme Test' } })
    fireEvent.click(screen.getByRole('button', { name: /créer une ferme/i }))

    expect(createFarm).toHaveBeenCalledWith({ name: 'Ferme Test', location: '' })
    expect(await screen.findByText(/ferme créée/i)).toBeInTheDocument()
  })

  it('affiche la liste des unités', () => {
    mockedUseUnits.mockReturnValue({
      data: [
        { id: '1', farm: '10', breeding_type: 'bt1', species: 'sp1', name: 'Poulailler A', capacity: 1200 },
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
      create: vi.fn(),
      creating: false,
      enterprises: [{ id: 'ent', name: 'Ent', owner: 'user' }],
      createEnterprise: vi.fn(),
      creatingEnterprise: false,
    })
    mockedUseBreedingTypes.mockReturnValue({ data: [{ id: 'bt1', code: 'PIG', name: 'Porcin' }], loading: false, error: '' })
    mockedUseSpecies.mockReturnValue({ data: [{ id: 'sp1', code: 'PIG', name: 'Porcin', breeding_type: 'bt1' }], loading: false, error: '' })

    render(<UnitsPage />)

    expect(screen.getByText(/poulailler a/i)).toBeInTheDocument()
    expect(screen.getByText(/capacité: 1200/i)).toBeInTheDocument()
    expect(screen.getAllByText(/ferme nord/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/porcin/i).length).toBeGreaterThanOrEqual(1)
  })

  it('filtre par ferme sélectionnée', () => {
    mockedUseUnits.mockReturnValue({
      data: [
        { id: '1', farm: '10', breeding_type: 'bt1', species: 'sp1', name: 'Poulailler A', capacity: 1200 },
        { id: '2', farm: '20', breeding_type: 'bt1', species: 'sp1', name: 'Bergerie B', capacity: 300 },
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
      create: vi.fn(),
      creating: false,
      enterprises: [{ id: 'ent', name: 'Ent', owner: 'user' }],
      createEnterprise: vi.fn(),
      creatingEnterprise: false,
    })
    mockedUseBreedingTypes.mockReturnValue({ data: [{ id: 'bt1', code: 'PIG', name: 'Porcin' }], loading: false, error: '' })
    mockedUseSpecies.mockReturnValue({ data: [{ id: 'sp1', code: 'PIG', name: 'Porcin', breeding_type: 'bt1' }], loading: false, error: '' })

    render(<UnitsPage />)

    expect(screen.getByText(/poulailler a/i)).toBeInTheDocument()
    expect(screen.getByText(/bergerie b/i)).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText(/filtrer par ferme/i), { target: { value: '20' } })

    expect(screen.queryByText(/poulailler a/i)).not.toBeInTheDocument()
    expect(screen.getByText(/bergerie b/i)).toBeInTheDocument()
  })
})
