/**
 * Variables d'environnement typées
 */

// Types pour import.meta.env
declare global {
  interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string;
    readonly VITE_APP_ENV: 'development' | 'production' | 'test';
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export const env = {
  apiUrl: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/',
  isDevelopment: import.meta.env.VITE_APP_ENV === 'development',
  isProduction: import.meta.env.VITE_APP_ENV === 'production',
  isTest: import.meta.env.VITE_APP_ENV === 'test',
} as const;

// Validation des variables critiques
const requiredEnvVars = [
  // VITE_API_BASE_URL reste optionnel (fallback localhost)
] as const;

export function validateEnv(): void {
  const missing = requiredEnvVars.filter(
    (key) => !import.meta.env[key]
  );

  if (missing.length > 0) {
    throw new Error(
      `Variables d'environnement manquantes: ${missing.join(', ')}\n` +
      'Créez un fichier .env.local à la racine du frontend avec ces variables.'
    );
  }
}
