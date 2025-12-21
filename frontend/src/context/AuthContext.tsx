/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'
import { clearTokens, getTokens, login as apiLogin, storeTokens, type LoginResponse } from '../lib/api-client'

interface AuthContextValue {
  tokens: { access?: string; refresh?: string }
  authenticated: boolean
  login: (email: string, password: string) => Promise<LoginResponse>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [tokens, setTokens] = useState<{ access?: string; refresh?: string }>(() => getTokens())

  const value = useMemo<AuthContextValue>(() => ({
    tokens,
    authenticated: Boolean(tokens.access),
    login: async (email: string, password: string) => {
      const res = await apiLogin(email, password)
      storeTokens(res)
      setTokens({ access: res.access, refresh: res.refresh })
      return res
    },
    logout: () => {
      clearTokens()
      setTokens({ access: undefined, refresh: undefined })
    },
  }), [tokens])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
