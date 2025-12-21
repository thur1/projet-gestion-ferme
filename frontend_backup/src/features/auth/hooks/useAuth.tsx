/**
 * Hook d'authentification aligné sur le backend Django (JWT)
 * - Login / Register via /api/auth/
 * - Persistance access/refresh token en localStorage
 * - Refresh automatique sur demande
 */

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api } from '@/lib/apiClient';
import { STORAGE_KEYS } from '@/config/constants';

type AuthUser = {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
};

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
};

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (payload: { email: string; password: string; first_name?: string; last_name?: string }) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function readStorage(): AuthState {
  try {
    const accessToken = localStorage.getItem(STORAGE_KEYS.auth.token);
    const refreshToken = localStorage.getItem(STORAGE_KEYS.auth.session);
    const userRaw = localStorage.getItem(STORAGE_KEYS.auth.user);
    const user = userRaw ? (JSON.parse(userRaw) as AuthUser) : null;
    return { accessToken, refreshToken, user };
  } catch (error) {
    console.error('Auth storage read error', error);
    return { accessToken: null, refreshToken: null, user: null };
  }
}

function writeStorage(state: AuthState): void {
  try {
    if (state.accessToken) {
      localStorage.setItem(STORAGE_KEYS.auth.token, state.accessToken);
    } else {
      localStorage.removeItem(STORAGE_KEYS.auth.token);
    }

    if (state.refreshToken) {
      localStorage.setItem(STORAGE_KEYS.auth.session, state.refreshToken);
    } else {
      localStorage.removeItem(STORAGE_KEYS.auth.session);
    }

    if (state.user) {
      localStorage.setItem(STORAGE_KEYS.auth.user, JSON.stringify(state.user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.auth.user);
    }
  } catch (error) {
    console.error('Auth storage write error', error);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [{ accessToken, refreshToken, user }, setAuth] = useState<AuthState>(() => readStorage());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fin de l'état de chargement une fois les valeurs locales chargées
    setLoading(false);
  }, []);

  useEffect(() => {
    writeStorage({ accessToken, refreshToken, user });
  }, [accessToken, refreshToken, user]);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await api.post<{ access: string; refresh: string; user: AuthUser }>('/auth/login/', {
        email,
        password,
      });

      setAuth({
        accessToken: response.access,
        refreshToken: response.refresh,
        user: response.user,
      });

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async (payload: { email: string; password: string; first_name?: string; last_name?: string }) => {
    try {
      await api.post('/auth/register/', payload);
      // Enchaîner avec un login pour récupérer les tokens
      return await signIn(payload.email, payload.password);
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    setAuth({ accessToken: null, refreshToken: null, user: null });
  };

  const refreshSession = async () => {
    if (!refreshToken) return;

    try {
      const response = await api.post<{ access: string }>('/auth/refresh/', {
        refresh: refreshToken,
      });

      setAuth((prev) => ({
        ...prev,
        accessToken: response.access,
      }));
    } catch (error) {
      console.error('Refresh error:', error);
      // Session invalide : on purge
      setAuth({ accessToken: null, refreshToken: null, user: null });
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default useAuth;
