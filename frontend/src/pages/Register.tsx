import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string>('')

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      setMessage('Les mots de passe doivent correspondre')
      return
    }
    setLoading(true)
    setMessage('')
    try {
      await register(email, password)
      setMessage('Compte créé, vous êtes connecté')
      navigate('/', { replace: true })
    } catch (err) {
      if (err instanceof Error) {
        setMessage(err.message)
      } else {
        setMessage('Erreur lors de la création du compte')
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
          <h1 className="text-2xl font-semibold text-neutral-900">Créer un compte</h1>
          <p className="text-neutral-600">Inscription via `/api/auth/register/`.</p>
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
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Confirmer le mot de passe</label>
            <Input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? 'Création...' : 'Créer le compte'}
          </Button>
        </form>

        {message && <Badge variant={message.includes('créé') ? 'success' : 'danger'}>{message}</Badge>}
      </div>
    </div>
  )
}
