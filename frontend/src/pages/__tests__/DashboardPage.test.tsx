import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import DashboardPage from '../Dashboard'
import { useDashboardSummary } from '../../hooks/useDashboardSummary'
import { useFarms } from '../../hooks/useFarms'

vi.mock('../../hooks/useDashboardSummary', () => ({
  useDashboardSummary: vi.fn(),
}))
vi.mock('../../hooks/useFarms', () => ({
  useFarms: vi.fn(),
}))

const mockedUseDashboardSummary = vi.mocked(useDashboardSummary)
const mockedUseFarms = vi.mocked(useFarms)

describe('DashboardPage', () => {
  beforeEach(() => {
    mockedUseDashboardSummary.mockReset()
    mockedUseFarms.mockReset()
  })

  it('affiche le chargement', () => {
    mockedUseDashboardSummary.mockReturnValue({ data: null, farms: [], loading: true, error: '', selectedFarm: null })
    mockedUseFarms.mockReturnValue({ data: [], loading: true, error: '' })

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    )

    expect(screen.getByText(/tableau de bord élevage/i)).toBeInTheDocument()
    expect(screen.getAllByText('...').length).toBeGreaterThanOrEqual(1)
  })

  it('affiche une erreur', () => {
    mockedUseDashboardSummary.mockReturnValue({ data: null, farms: [], loading: false, error: 'api down', selectedFarm: null })
    mockedUseFarms.mockReturnValue({ data: [], loading: false, error: '' })

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    )

    expect(screen.getAllByText(/api down/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('—').length).toBeGreaterThanOrEqual(1)
  })

  it('affiche les données du tableau de bord', () => {
    mockedUseDashboardSummary.mockReturnValue({
      data: {
        total_lots: 4,
        active_lots: 3,
        mortality_7d: 2,
        mortality_rate_percent_7d: 1.5,
        feed_intake_kg_7d: 120,
        milk_production_l_7d: 0,
        eggs_count_7d: 800,
        eggs_per_hen_per_day: 0.3,
        avg_daily_gain_kg: 0.12,
        feed_conversion_ratio: 1.8,
        farm_margin_30d: 2500,
        lot_margins_30d: [{ lot_id: 'l1', lot_code: 'LOT-1', margin: 800 }],
        stock_alerts: [{ id: 's1', name: 'Maïs', quantity: 2, unit: 'kg', alert_threshold: 5 }],
      },
      farms: [
        {
          id: '1',
          name: 'Ferme A',
          location: 'Test',
          enterprise: '1',
        },
      ],
      loading: false,
      error: '',
      selectedFarm: '1',
    })
    mockedUseFarms.mockReturnValue({
      data: [
        { id: '1', name: 'Ferme A', enterprise: '1', location: '' },
        { id: '2', name: 'Ferme B', enterprise: '1', location: '' },
      ],
      loading: false,
      error: '',
    })

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    )

    expect(screen.getByText(/tableau de bord élevage/i)).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText(/total lots: 4/i)).toBeInTheDocument()
    expect(screen.getByText(/mortalité/i)).toBeInTheDocument()
    expect(screen.getByText(/alertes stock/i)).toBeInTheDocument()
  })
})
