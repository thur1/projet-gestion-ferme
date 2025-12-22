import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Wifi, Bell, UserRound } from 'lucide-react'
import { cn } from '../lib/utils'
import { useHealth } from '../hooks/useHealth'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/units', label: 'Unités' },
  { to: '/lots', label: 'Lots', translate: 'no' as const },
  { to: '/sante', label: 'Santé' },
  { to: '/alimentation', label: 'Alimentation' },
  { to: '/reproduction', label: 'Reproduction' },
  { to: '/finances', label: 'Finances' },
  { to: '/stock', label: 'Stock' },
]

export function ShellLayout() {
  const health = useHealth()
  const { logout } = useAuth()
  const navigate = useNavigate()

  const healthBadge = (() => {
    if (health.status === 'ok') {
      return (
        <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
          <span className="h-2 w-2 rounded-full bg-green-500" aria-hidden />
          API ok
        </span>
      )
    }
    if (health.status === 'error') {
      return (
        <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
          <span className="h-2 w-2 rounded-full bg-red-500" aria-hidden />
          API indisponible
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700">
        <span className="h-2 w-2 rounded-full bg-neutral-400 animate-pulse" aria-hidden />
        Vérification...
      </span>
    )
  })()

  return (
    <div className="app-shell min-h-screen text-neutral-900">
      <header className="border-b border-neutral-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight bg-gradient-to-br from-green-600 via-green-500 to-green-700 bg-clip-text text-transparent">
                  AgriTrack
                </span>
                <span className="rounded-lg bg-gradient-to-br from-green-600 to-green-700 px-2 py-1 text-xs font-semibold uppercase text-white shadow-sm ring-1 ring-green-500/40">
                  Pro
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {healthBadge}
              <button className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-sm hover:bg-neutral-50">
                <Wifi className="h-4 w-4" />
              </button>
              <button className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-sm hover:bg-neutral-50">
                <Bell className="h-4 w-4" />
              </button>
              <button
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-3 text-neutral-800 shadow-sm hover:bg-neutral-50"
                onClick={() => {
                  logout()
                  navigate('/login')
                }}
              >
                <UserRound className="h-4 w-4" />
                <span className="text-sm font-medium">Déconnexion</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <nav className="flex flex-wrap items-center gap-2 rounded-full bg-neutral-100 px-2 py-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'rounded-full px-3 py-2 text-sm font-medium text-neutral-700 transition',
                      isActive
                        ? 'bg-white text-neutral-900 shadow-sm'
                        : 'hover:text-neutral-900'
                    )
                  }
                  translate={item.translate}
                >
                  <span translate={item.translate}>{item.label}</span>
                </NavLink>
              ))}
            </nav>
            <p className="text-sm font-medium text-neutral-800">Élevage multi-fermes / multi-espèces</p>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
