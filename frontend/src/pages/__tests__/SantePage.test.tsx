import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, expect, it, beforeEach, vi } from 'vitest'
import SantePage from '../Sante'
import { useHealthEvents } from '../../hooks/useHealthEvents'
import { useLots } from '../../hooks/useLots'
import { useUnits } from '../../hooks/useUnits'
import { useFarms } from '../../hooks/useFarms'

vi.mock('../../hooks/useHealthEvents', () => ({
  useHealthEvents: vi.fn(),
}))
vi.mock('../../hooks/useLots', () => ({
  useLots: vi.fn(),
}))
vi.mock('../../hooks/useUnits', () => ({
  useUnits: vi.fn(),
}))
vi.mock('../../hooks/useFarms', () => ({
  useFarms: vi.fn(),
}))

const mockedUseHealthEvents = vi.mocked(useHealthEvents)
const mockedUseLots = vi.mocked(useLots)
const mockedUseUnits = vi.mocked(useUnits)
const mockedUseFarms = vi.mocked(useFarms)

describe('SantePage', () => {
  beforeEach(() => {
    mockedUseHealthEvents.mockReset()
    mockedUseLots.mockReset()
    mockedUseUnits.mockReset()
    mockedUseFarms.mockReset()
  })

  it('affiche le chargement', () => {
    mockedUseHealthEvents.mockReturnValue({ data: [], loading: true, error: '', createEvent: vi.fn(), creating: false })
    mockedUseLots.mockReturnValue({ data: [], loading: false, error: '', create: vi.fn(), creating: false })
    mockedUseUnits.mockReturnValue({ data: [], loading: false, error: '', create: vi.fn(), creating: false })
    mockedUseFarms.mockReturnValue({ data: [], loading: false, error: '' })

    render(<SantePage />)

    expect(screen.getByText(/santé/i)).toBeInTheDocument()
    expect(screen.getByText(/chargement en cours/i)).toBeInTheDocument()
  })

  it('affiche une erreur', () => {
    mockedUseHealthEvents.mockReturnValue({ data: [], loading: false, error: 'oups', createEvent: vi.fn(), creating: false })
    mockedUseLots.mockReturnValue({ data: [], loading: false, error: '', create: vi.fn(), creating: false })
    mockedUseUnits.mockReturnValue({ data: [], loading: false, error: '', create: vi.fn(), creating: false })
    mockedUseFarms.mockReturnValue({ data: [], loading: false, error: '' })

    render(<SantePage />)

    expect(screen.getByText(/oups/i)).toBeInTheDocument()
  })

  it('affiche un état vide', () => {
    mockedUseHealthEvents.mockReturnValue({ data: [], loading: false, error: '', createEvent: vi.fn(), creating: false })
    mockedUseLots.mockReturnValue({ data: [], loading: false, error: '', create: vi.fn(), creating: false })
    mockedUseUnits.mockReturnValue({ data: [], loading: false, error: '', create: vi.fn(), creating: false })
    mockedUseFarms.mockReturnValue({ data: [], loading: false, error: '' })

    render(<SantePage />)

    expect(screen.getByText(/aucun événement/i)).toBeInTheDocument()
  })

  it('affiche la liste des évènements', () => {
    mockedUseHealthEvents.mockReturnValue({
      data: [
        {
          id: '1',
          lot: '3',
          event_type: 'vaccination',
          date: '2025-01-10',
          product: 'Vaccination grippe',
          notes: 'Phase 1',
        },
      ],
      loading: false,
      error: '',
      createEvent: vi.fn(),
      creating: false,
    })
    mockedUseLots.mockReturnValue({
      data: [{ id: '3', unit: 'u1', species: 'sp1', code: 'LOT-X', entry_date: '2025-01-01', initial_count: 50, status: 'active' }],
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

    render(<SantePage />)

    expect(screen.getByText(/vaccination grippe/i)).toBeInTheDocument()
    expect(screen.getByText(/lot #3/i)).toBeInTheDocument()
    expect(screen.getAllByText(/vaccination/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/ferme nord/i).length).toBeGreaterThanOrEqual(1)
  })

  it('filtre par ferme', () => {
    mockedUseHealthEvents.mockReturnValue({
      data: [
        { id: '1', lot: 'l1', product: 'Vaccin A', event_type: 'vaccination', date: '2025-01-01' },
        { id: '2', lot: 'l2', product: 'Traitement B', event_type: 'treatment', date: '2025-01-02' },
      ],
      loading: false,
      error: '',
      createEvent: vi.fn(),
      creating: false,
    })
    mockedUseLots.mockReturnValue({
      data: [
        { id: 'l1', unit: 'u1', species: 'sp1', code: 'LOT-1', entry_date: '2025-01-01', initial_count: 10, status: 'active' },
        { id: 'l2', unit: 'u2', species: 'sp1', code: 'LOT-2', entry_date: '2025-01-01', initial_count: 20, status: 'active' },
      ],
      loading: false,
      error: '',
      create: vi.fn(),
      creating: false,
    })
    mockedUseUnits.mockReturnValue({
      data: [
        { id: 'u1', farm: 'f1', species: 'sp1', name: 'Unit 1', capacity: 100 },
        { id: 'u2', farm: 'f2', species: 'sp1', name: 'Unit 2', capacity: 200 },
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

    render(<SantePage />)

    expect(screen.getByText(/vaccin a/i)).toBeInTheDocument()
    expect(screen.getByText(/traitement b/i)).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText(/filtrer par ferme/i), { target: { value: 'f2' } })

    expect(screen.queryByText(/vaccin a/i)).not.toBeInTheDocument()
    expect(screen.getByText(/traitement b/i)).toBeInTheDocument()
  })

  it('filtre par type et par date', () => {
    mockedUseHealthEvents.mockReturnValue({
      data: [
        { id: '1', lot: 'l1', product: 'Vaccin A', event_type: 'vaccination', date: '2025-01-01' },
        { id: '2', lot: 'l1', product: 'Traitement B', event_type: 'treatment', date: '2025-02-01' },
      ],
      loading: false,
      error: '',
      createEvent: vi.fn(),
      creating: false,
    })
    mockedUseLots.mockReturnValue({
      data: [{ id: 'l1', unit: 'u1', species: 'sp1', code: 'LOT-1', entry_date: '2025-01-01', initial_count: 10, status: 'active' }],
      loading: false,
      error: '',
      create: vi.fn(),
      creating: false,
    })
    mockedUseUnits.mockReturnValue({
      data: [{ id: 'u1', farm: 'f1', species: 'sp1', name: 'Unit 1', capacity: 100 }],
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

    render(<SantePage />)

    // Filtre par type
    fireEvent.change(screen.getAllByLabelText(/type/i)[0], { target: { value: 'treatment' } })
    expect(screen.queryByText(/vaccin a/i)).not.toBeInTheDocument()
    expect(screen.getByText(/traitement b/i)).toBeInTheDocument()

    // Filtre par date
    fireEvent.change(screen.getByLabelText(/^du$/i), { target: { value: '2025-01-15' } })
    expect(screen.queryByText(/traitement b/i)).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText(/^au$/i), { target: { value: '2025-01-20' } })
    expect(screen.queryByText(/traitement b/i)).not.toBeInTheDocument()
  })

  it('soumet un nouvel événement', async () => {
    const createEvent = vi.fn().mockResolvedValue({
      success: true,
      event: { id: 'n1', lot: 'l2', product: 'Nouveau', notes: 'RAS', event_type: 'treatment', date: '2025-03-01' },
    })

    mockedUseHealthEvents.mockReturnValue({
      data: [],
      loading: false,
      error: '',
      createEvent,
      creating: false,
    })
    mockedUseLots.mockReturnValue({
      data: [
        { id: 'l1', unit: 'u1', species: 'sp1', code: 'LOT-1', entry_date: '2025-01-01', initial_count: 10, status: 'active' },
        { id: 'l2', unit: 'u2', species: 'sp1', code: 'LOT-2', entry_date: '2025-01-01', initial_count: 20, status: 'active' },
      ],
      loading: false,
      error: '',
      create: vi.fn(),
      creating: false,
    })
    mockedUseUnits.mockReturnValue({
      data: [
        { id: 'u1', farm: 'f1', species: 'sp1', name: 'Unit 1', capacity: 100 },
        { id: 'u2', farm: 'f2', species: 'sp1', name: 'Unit 2', capacity: 200 },
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

    render(<SantePage />)

    // Choisir la ferme f2 restreint la liste des lots à l2
    fireEvent.change(screen.getByLabelText(/filtrer par ferme/i), { target: { value: 'f2' } })
    const lotSelect = screen.getByLabelText(/^lot/i)
    expect((lotSelect as HTMLSelectElement).value).toBe('l2')

    fireEvent.change(screen.getByLabelText(/notes/i), { target: { value: 'Nouveau' } })
    fireEvent.change(screen.getByLabelText(/produit/i), { target: { value: 'Antibiotique' } })
    fireEvent.change(screen.getByLabelText(/^date/i), { target: { value: '2025-03-01' } })
    fireEvent.change(screen.getAllByLabelText(/type/i)[1], { target: { value: 'treatment' } })

    fireEvent.click(screen.getByText(/ajouter un événement/i))

    await waitFor(() => expect(createEvent).toHaveBeenCalled())
    expect(createEvent).toHaveBeenCalledWith({
      notes: 'Nouveau',
      product: 'Antibiotique',
      date: '2025-03-01',
      event_type: 'treatment',
      lot: 'l2',
    })
    expect(screen.getByText(/événement ajouté/i)).toBeInTheDocument()
  })
})
