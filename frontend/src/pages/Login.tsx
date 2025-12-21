import { useState } from 'react'
import type { FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname?: string } } | undefined)?.from?.pathname ?? '/'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string>('')

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      await login(email, password)
      setMessage('Connexion réussie')
      navigate(from, { replace: true })
    } catch (err) {
      if (err instanceof Error) {
        setMessage(err.message)
      } else {
        setMessage('Erreur de connexion')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-4">
      <div className="card-surface p-6 space-y-4">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-brand-700">Authentification</p>
          <h1 className="text-2xl font-semibold text-neutral-900">Connexion</h1>
          <p className="text-neutral-600">Utilise `/api/auth/login/` (email + mot de passe).</p>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="demo@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Mot de passe</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>

        {message && <Badge variant={message.includes('réussie') ? 'success' : 'danger'}>{message}</Badge>}
      </div>
    </div>
  )
}
