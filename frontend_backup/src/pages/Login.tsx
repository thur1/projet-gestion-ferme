import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sprout, TrendingUp, Shield, BarChart3 } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/dashboard');
    }
  };

  const features = [
    { icon: Sprout, label: 'Gestion intelligente' },
    { icon: TrendingUp, label: 'Suivi en temps réel' },
    { icon: Shield, label: 'Données sécurisées' },
    { icon: BarChart3, label: 'Analyses avancées' }
  ];

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '48px 48px'
        }} />
      </div>

      {/* Left Hero Section */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 relative z-10"
      >
        <div className="max-w-lg space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="space-y-4"
          >
            <div className="text-farm-green text-sm font-semibold tracking-wider uppercase">
              Gestion de ferme
            </div>
            <h1 className="text-5xl font-bold text-white leading-tight">
              Leader de la gestion agricole
            </h1>
            <p className="text-xl text-gray-300">
              Optimisez votre production avec une plateforme moderne et intuitive
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="grid grid-cols-2 gap-4 pt-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center space-x-3 text-gray-300"
              >
                <feature.icon className="w-5 h-5 text-farm-green" />
                <span className="text-sm font-medium">{feature.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Right Form Section */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10"
      >
        <div className="w-full max-w-md">
          {/* Mobile Title */}
          <div className="lg:hidden mb-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              Gestion de ferme
            </h1>
            <p className="text-gray-400">Leader de la gestion agricole</p>
          </div>

          {/* Glassmorphism Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Connexion</h2>
              <p className="text-gray-300">Accédez à votre tableau de bord</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg bg-red-500/20 border border-red-500/50 p-3 text-sm text-red-200"
                >
                  {error}
                </motion.div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="votre@email.com"
                  disabled={loading}
                  className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/10 focus:border-farm-green h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white font-medium">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  disabled={loading}
                  className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/10 focus:border-farm-green h-12 text-base"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-white text-gray-900 hover:bg-gray-100 font-semibold h-12 text-base rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={loading}
              >
                {loading ? 'Connexion...' : 'SE CONNECTER'}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-transparent text-gray-400">Nouveau sur la plateforme ?</span>
                </div>
              </div>

              <Link to="/register">
                <Button 
                  type="button"
                  variant="outline"
                  className="w-full border-white/30 text-white hover:bg-white/10 h-12 text-base rounded-lg"
                >
                  CRÉER UN COMPTE
                </Button>
              </Link>
            </form>
          </motion.div>

          {/* Footer Features - Mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="lg:hidden grid grid-cols-2 gap-3 mt-8"
          >
            {features.map((feature) => (
              <div key={feature.label} className="flex items-center space-x-2 text-gray-400">
                <feature.icon className="w-4 h-4 text-farm-green" />
                <span className="text-xs">{feature.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
