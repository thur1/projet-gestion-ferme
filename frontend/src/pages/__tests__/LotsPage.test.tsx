import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
/* eslint-disable @typescript-eslint/no-explicit-any */
import LotsPage from '../Lots'
import { useLots } from '../../hooks/useLots'
import { useUnits } from '../../hooks/useUnits'
import { useFarms } from '../../hooks/useFarms'
import { useSpecies } from '../../hooks/useSpecies'
import { useBreedingTypes } from '../../hooks/useBreedingTypes'

vi.mock('../../hooks/useLots', () => ({
  useLots: vi.fn(),
}))
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

const mockedUseLots = vi.mocked(useLots)
const mockedUseUnits = vi.mocked(useUnits)
const mockedUseFarms = vi.mocked(useFarms) as unknown as { mockReturnValue: (value: any) => void; mockReset: () => void }
const mockedUseSpecies = vi.mocked(useSpecies)
const mockedUseBreedingTypes = vi.mocked(useBreedingTypes)

describe('LotsPage', () => {
  beforeEach(() => {
    mockedUseLots.mockReset()
    mockedUseUnits.mockReset()
    mockedUseFarms.mockReset()
    mockedUseSpecies.mockReset()
    mockedUseBreedingTypes.mockReset()
  })

  it('affiche le chargement', () => {
    mockedUseLots.mockReturnValue({ data: [], loading: true, error: '', create: vi.fn(), creating: false })
    mockedUseUnits.mockReturnValue({ data: [], loading: false, error: '', create: vi.fn(), creating: false })
    mockedUseFarms.mockReturnValue({ data: [], loading: false, error: '' })
    mockedUseSpecies.mockReturnValue({ data: [], loading: false, error: '', create: vi.fn(), creating: false })
    mockedUseBreedingTypes.mockReturnValue({ data: [], loading: false, error: '' })

    render(<LotsPage />)

    expect(screen.getByText(/lots/i)).toBeInTheDocument()
    expect(screen.getByText(/chargement en cours/i)).toBeInTheDocument()
  })

  it('affiche une erreur', () => {
    mockedUseLots.mockReturnValue({ data: [], loading: false, error: 'erreur lots', create: vi.fn(), creating: false })
    mockedUseUnits.mockReturnValue({ data: [], loading: false, error: '', create: vi.fn(), creating: false })
    mockedUseFarms.mockReturnValue({ data: [], loading: false, error: '' })
    mockedUseSpecies.mockReturnValue({ data: [], loading: false, error: '', create: vi.fn(), creating: false })
    mockedUseBreedingTypes.mockReturnValue({ data: [], loading: false, error: '' })

    render(<LotsPage />)

    expect(screen.getByText(/erreur lots/i)).toBeInTheDocument()
  })

  it('affiche un etat vide', () => {
    mockedUseLots.mockReturnValue({ data: [], loading: false, error: '', create: vi.fn(), creating: false })
    mockedUseUnits.mockReturnValue({ data: [], loading: false, error: '', create: vi.fn(), creating: false })
    mockedUseFarms.mockReturnValue({ data: [], loading: false, error: '' })
    mockedUseSpecies.mockReturnValue({ data: [], loading: false, error: '', create: vi.fn(), creating: false })
    mockedUseBreedingTypes.mockReturnValue({ data: [], loading: false, error: '' })

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
      data: [{ id: 'u1', farm: 'f1', species: 'sp1', breeding_type: 'bt1', name: 'Unit A', capacity: 100 }],
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
    mockedUseSpecies.mockReturnValue({
      data: [{ id: 'sp1', code: 'PIG', name: 'Porcin', breeding_type: 'bt1' }],
      loading: false,
      error: '',
      create: vi.fn(),
      creating: false,
    })
    mockedUseBreedingTypes.mockReturnValue({
      data: [{ id: 'bt1', code: 'BOV', name: 'Bovin' }],
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
        { id: 'u1', farm: 'f1', species: 'sp1', breeding_type: 'bt1', name: 'Unit A', capacity: 100 },
        { id: 'u2', farm: 'f2', species: 'sp1', breeding_type: 'bt1', name: 'Unit B', capacity: 80 },
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
    mockedUseSpecies.mockReturnValue({
      data: [{ id: 'sp1', code: 'PIG', name: 'Porcin', breeding_type: 'bt1' }],
      loading: false,
      error: '',
      create: vi.fn(),
      creating: false,
    })
    mockedUseBreedingTypes.mockReturnValue({
      data: [{ id: 'bt1', code: 'BOV', name: 'Bovin' }],
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

  it("permet de creer une espece quand aucune n'existe", async () => {
    const createSpecies = vi.fn().mockResolvedValue({
      success: true as const,
      species: { id: 'sp-new', code: 'BOV', name: 'Bovin' },
    })
    mockedUseLots.mockReturnValue({ data: [], loading: false, error: '', create: vi.fn(), creating: false })
    mockedUseUnits.mockReturnValue({ data: [], loading: false, error: '', create: vi.fn(), creating: false })
    mockedUseFarms.mockReturnValue({ data: [], loading: false, error: '' })
    mockedUseSpecies.mockReturnValue({ data: [], loading: false, error: '', create: createSpecies, creating: false })
    mockedUseBreedingTypes.mockReturnValue({ data: [{ id: 'bt1', code: 'BOV', name: 'Bovin' }], loading: false, error: '' })

    render(<LotsPage />)

    expect(screen.getByText(/aucune espèce disponible/i)).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText(/nom de l['’]espèce/i), { target: { value: 'Bovin' } })
    fireEvent.change(screen.getByLabelText(/code \(unique\)/i), { target: { value: 'bov' } })
    fireEvent.change(screen.getAllByLabelText(/type d['’]élevage/i)[0], { target: { value: 'bt1' } })
    fireEvent.click(screen.getByRole('button', { name: /créer une espèce/i }))

    expect(createSpecies).toHaveBeenCalledWith({ code: 'BOV', name: 'Bovin', breeding_type: 'bt1' })
    expect(await screen.findByText(/espèce créée/i)).toBeInTheDocument()
  })

  it('propose un code de lot et permet de le modifier', () => {
    mockedUseLots.mockReturnValue({ data: [], loading: false, error: '', create: vi.fn(), creating: false })
    mockedUseUnits.mockReturnValue({ data: [{ id: 'u1', farm: 'f1', species: 'sp1', breeding_type: 'bt1', name: 'Unit A', capacity: 100 }], loading: false, error: '', create: vi.fn(), creating: false })
    mockedUseFarms.mockReturnValue({ data: [{ id: 'f1', name: 'Ferme Nord', enterprise: 'ent', location: '' }], loading: false, error: '' })
    mockedUseSpecies.mockReturnValue({ data: [{ id: 'sp1', code: 'PIG', name: 'Porcin', breeding_type: 'bt1' }], loading: false, error: '', create: vi.fn(), creating: false })
    mockedUseBreedingTypes.mockReturnValue({ data: [{ id: 'bt1', code: 'BOV', name: 'Bovin' }], loading: false, error: '' })

    render(<LotsPage />)

    const codeInput = screen.getByLabelText(/code/i) as HTMLInputElement
    expect(codeInput.value).toMatch(/LOT-/)

    fireEvent.click(screen.getByRole('button', { name: /proposer un code/i }))
    expect(codeInput.value).toMatch(/LOT-/)

    fireEvent.change(codeInput, { target: { value: 'CUSTOM' } })
    expect(codeInput.value).toBe('CUSTOM')
  })
})
