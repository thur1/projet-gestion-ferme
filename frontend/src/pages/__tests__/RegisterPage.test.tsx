import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import RegisterPage from '../Register'
import { useAuth } from '../../context/AuthContext'

vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

const mockedUseAuth = vi.mocked(useAuth)

describe('RegisterPage', () => {
  const logout = vi.fn()

  beforeEach(() => {
    mockedUseAuth.mockReset()
    logout.mockReset()
  })

  it('crée un compte avec succès', async () => {
    const register = vi.fn().mockResolvedValue({ access: 'a', refresh: 'r' })
    mockedUseAuth.mockReturnValue({ tokens: {}, authenticated: false, login: vi.fn(), register, logout })

    render(
      <MemoryRouter initialEntries={['/register']}>
        <RegisterPage />
      </MemoryRouter>,
    )

    await userEvent.type(screen.getByPlaceholderText('demo@example.com'), 'demo@example.com')
    await userEvent.type(screen.getAllByPlaceholderText('••••••••')[0], 'secret')
    await userEvent.type(screen.getAllByPlaceholderText('••••••••')[1], 'secret')
    await userEvent.click(screen.getByRole('button', { name: /créer le compte/i }))

    await waitFor(() => expect(register).toHaveBeenCalledWith('demo@example.com', 'secret'))
    expect(screen.getByText(/compte créé/i)).toBeInTheDocument()
  })

  it('affiche une erreur si les mots de passe diffèrent', async () => {
    const register = vi.fn()
    mockedUseAuth.mockReturnValue({ tokens: {}, authenticated: false, login: vi.fn(), register, logout })

    render(
      <MemoryRouter initialEntries={['/register']}>
        <RegisterPage />
      </MemoryRouter>,
    )

    await userEvent.type(screen.getByPlaceholderText('demo@example.com'), 'demo@example.com')
    await userEvent.type(screen.getAllByPlaceholderText('••••••••')[0], 'secret')
    await userEvent.type(screen.getAllByPlaceholderText('••••••••')[1], 'wrong')
    await userEvent.click(screen.getByRole('button', { name: /créer le compte/i }))

    expect(screen.getByText(/doivent correspondre/i)).toBeInTheDocument()
    expect(register).not.toHaveBeenCalled()
  })

  it('affiche une erreur backend', async () => {
    const register = vi.fn().mockRejectedValue(new Error('email déjà utilisé'))
    mockedUseAuth.mockReturnValue({ tokens: {}, authenticated: false, login: vi.fn(), register, logout })

    render(
      <MemoryRouter initialEntries={['/register']}>
        <RegisterPage />
      </MemoryRouter>,
    )

    await userEvent.type(screen.getByPlaceholderText('demo@example.com'), 'demo@example.com')
    await userEvent.type(screen.getAllByPlaceholderText('••••••••')[0], 'secret')
    await userEvent.type(screen.getAllByPlaceholderText('••••••••')[1], 'secret')
    await userEvent.click(screen.getByRole('button', { name: /créer le compte/i }))

    await waitFor(() => expect(register).toHaveBeenCalled())
    expect(screen.getByText(/email déjà utilisé/i)).toBeInTheDocument()
  })
})
