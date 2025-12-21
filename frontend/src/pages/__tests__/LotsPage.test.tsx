import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import LotsPage from '../Lots'
import { useLots } from '../../hooks/useLots'

vi.mock('../../hooks/useLots', () => ({
  useLots: vi.fn(),
}))

const mockedUseLots = vi.mocked(useLots)

describe('LotsPage', () => {
  beforeEach(() => {
    mockedUseLots.mockReset()
  })

  it('affiche le chargement', () => {
    mockedUseLots.mockReturnValue({ data: [], loading: true, error: '' })

    render(<LotsPage />)

    expect(screen.getByText(/lots/i)).toBeInTheDocument()
    expect(screen.getByText(/chargement en cours/i)).toBeInTheDocument()
  })

  it('affiche une erreur', () => {
    mockedUseLots.mockReturnValue({ data: [], loading: false, error: 'erreur lots' })

    render(<LotsPage />)

    expect(screen.getByText(/erreur lots/i)).toBeInTheDocument()
  })

  it('affiche un état vide', () => {
    mockedUseLots.mockReturnValue({ data: [], loading: false, error: '' })

    render(<LotsPage />)

    expect(screen.getByText(/aucun lot/i)).toBeInTheDocument()
  })

  it('affiche la liste des lots', () => {
    mockedUseLots.mockReturnValue({
      data: [
        { id: 1, name: 'Lot A', unit: 2, species: 1, headcount: 45 },
      ],
      loading: false,
      error: '',
    })

    render(<LotsPage />)

    expect(screen.getByText(/lot a/i)).toBeInTheDocument()
    expect(screen.getByText(/effectif: 45/i)).toBeInTheDocument()
    expect(screen.getByText(/unit #2/i)).toBeInTheDocument()
  })
})
