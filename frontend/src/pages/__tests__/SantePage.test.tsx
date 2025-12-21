import { render, screen } from '@testing-library/react'
import { describe, expect, it, beforeEach, vi } from 'vitest'
import SantePage from '../Sante'
import { useHealthEvents } from '../../hooks/useHealthEvents'

vi.mock('../../hooks/useHealthEvents', () => ({
  useHealthEvents: vi.fn(),
}))

const mockedUseHealthEvents = vi.mocked(useHealthEvents)

describe('SantePage', () => {
  beforeEach(() => {
    mockedUseHealthEvents.mockReset()
  })

  it('affiche le chargement', () => {
    mockedUseHealthEvents.mockReturnValue({ data: [], loading: true, error: '' })

    render(<SantePage />)

    expect(screen.getByText(/santé/i)).toBeInTheDocument()
    expect(screen.getByText(/chargement en cours/i)).toBeInTheDocument()
  })

  it('affiche une erreur', () => {
    mockedUseHealthEvents.mockReturnValue({ data: [], loading: false, error: 'oups' })

    render(<SantePage />)

    expect(screen.getByText(/oups/i)).toBeInTheDocument()
  })

  it('affiche un état vide', () => {
    mockedUseHealthEvents.mockReturnValue({ data: [], loading: false, error: '' })

    render(<SantePage />)

    expect(screen.getByText(/aucun événement/i)).toBeInTheDocument()
  })

  it('affiche la liste des évènements', () => {
    mockedUseHealthEvents.mockReturnValue({
      data: [
        {
          id: 1,
          lot: 3,
          description: 'Vaccination grippe',
          event_type: 'vaccination',
          date: '2025-01-10',
        },
      ],
      loading: false,
      error: '',
    })

    render(<SantePage />)

    expect(screen.getByText(/vaccination grippe/i)).toBeInTheDocument()
    expect(screen.getByText(/lot #3/i)).toBeInTheDocument()
    const vaccinationTexts = screen.getAllByText(/vaccination/i)
    expect(vaccinationTexts.length).toBeGreaterThanOrEqual(1)
  })
})
