import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import DashboardPage from '../Dashboard'
import { useDashboardSummary } from '../../hooks/useDashboardSummary'

vi.mock('../../hooks/useDashboardSummary', () => ({
  useDashboardSummary: vi.fn(),
}))

const mockedUseDashboardSummary = vi.mocked(useDashboardSummary)

describe('DashboardPage', () => {
  beforeEach(() => {
    mockedUseDashboardSummary.mockReset()
  })

  it('affiche le chargement', () => {
    mockedUseDashboardSummary.mockReturnValue({ data: null, loading: true, error: '' })

    render(<DashboardPage />)

    expect(screen.getByText(/dashboard élevage/i)).toBeInTheDocument()
    expect(screen.getAllByText('...').length).toBeGreaterThanOrEqual(1)
  })

  it('affiche une erreur', () => {
    mockedUseDashboardSummary.mockReturnValue({ data: null, loading: false, error: 'api down' })

    render(<DashboardPage />)

    expect(screen.getAllByText(/api down/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('—').length).toBeGreaterThanOrEqual(1)
  })

  it('affiche les données du tableau de bord', () => {
    mockedUseDashboardSummary.mockReturnValue({
      data: {
        farms_total: 2,
        units_total: 3,
        lots_total: 4,
        headcount_total: 120,
      },
      loading: false,
      error: '',
    })

    render(<DashboardPage />)

    expect(screen.getByText(/dashboard élevage/i)).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText(/têtes: 120/i)).toBeInTheDocument()
  })
})
