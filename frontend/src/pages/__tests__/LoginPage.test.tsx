import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import LoginPage from '../Login'
import { useAuth } from '../../context/AuthContext'

vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

const mockedUseAuth = vi.mocked(useAuth)

describe('LoginPage', () => {
  const logout = vi.fn()

  beforeEach(() => {
    mockedUseAuth.mockReset()
    logout.mockReset()
  })

  it('soumet et affiche un succès', async () => {
    const login = vi.fn().mockResolvedValue({ access: 'a', refresh: 'r' })
    mockedUseAuth.mockReturnValue({ tokens: {}, authenticated: false, login, logout })

    render(<LoginPage />)

    await userEvent.type(screen.getByPlaceholderText('demo@example.com'), 'demo@example.com')
    await userEvent.type(screen.getByPlaceholderText('••••••••'), 'secret')
    await userEvent.click(screen.getByRole('button', { name: /se connecter/i }))

    await waitFor(() => expect(login).toHaveBeenCalledWith('demo@example.com', 'secret'))
    expect(screen.getByText(/connexion réussie/i)).toBeInTheDocument()
  })

  it('affiche une erreur si le login échoue', async () => {
    const login = vi.fn().mockRejectedValue(new Error('mauvais identifiants'))
    mockedUseAuth.mockReturnValue({ tokens: {}, authenticated: false, login, logout })

    render(<LoginPage />)

    await userEvent.type(screen.getByPlaceholderText('demo@example.com'), 'demo@example.com')
    await userEvent.type(screen.getByPlaceholderText('••••••••'), 'wrong')
    await userEvent.click(screen.getByRole('button', { name: /se connecter/i }))

    await waitFor(() => expect(login).toHaveBeenCalled())
    expect(screen.getByText(/mauvais identifiants/i)).toBeInTheDocument()
  })
})
