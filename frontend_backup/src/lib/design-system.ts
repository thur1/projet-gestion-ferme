/**
 * Design System - Projet Gestion de Ferme
 * Charte graphique complète pour interface mobile-first
 */

export const colors = {
  // Couleurs principales
  farmGreen: '#2E7D32',      // Vert ferme - validations, titres, boutons primaires
  lightGreen: '#A5D6A7',     // Vert clair - création, statuts positifs
  earthBrown: '#6D4C41',     // Brun terre - titres secondaires, icônes animales
  skyBlue: '#03A9F4',        // Bleu clair - alertes douces, eau/alimentation
  lightGray: '#F5F5F5',      // Background
  textGray: '#616161',       // Textes
  white: '#FFFFFF',
  
  // Couleurs d'état
  success: '#2E7D32',
  warning: '#FF9800',
  danger: '#D32F2F',
  info: '#03A9F4',
} as const;

export const typography = {
  // Police principale
  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  
  // Tailles (mobile-first)
  mobile: {
    title: '20px',       // 1.25rem
    titleLarge: '24px',  // 1.5rem
    body: '14px',        // 0.875rem
    bodyLarge: '16px',   // 1rem
    small: '12px',       // 0.75rem
  },
  
  // Tailles (desktop)
  desktop: {
    title: '24px',       // 1.5rem
    titleLarge: '32px',  // 2rem
    body: '16px',        // 1rem
    bodyLarge: '18px',   // 1.125rem
    small: '14px',       // 0.875rem
  },
} as const;

export const spacing = {
  // Espacements standardisés
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
} as const;

export const borderRadius = {
  // Coins arrondis
  small: '8px',
  medium: '12px',
  large: '16px',
  full: '9999px',
} as const;

export const shadows = {
  // Ombres douces pour effet moderne
  card: '0 2px 8px rgba(0, 0, 0, 0.08)',
  cardHover: '0 4px 16px rgba(0, 0, 0, 0.12)',
  button: '0 2px 4px rgba(0, 0, 0, 0.1)',
  floating: '0 8px 24px rgba(0, 0, 0, 0.15)',
} as const;

export const components = {
  // Tailles minimales pour mobile
  minButtonHeight: '48px',
  minInputHeight: '48px',
  minTouchTarget: '44px',
  
  // Espacements internes
  buttonPadding: '12px 24px',
  cardPadding: '16px',
  inputPadding: '12px 16px',
} as const;

// Icônes parlantes pour la navigation
export const icons = {
  poultry: '🐔',
  pigs: '🐷',
  stock: '📦',
  dashboard: '📊',
  calendar: '📅',
  notes: '📝',
  camera: '📷',
  alert: '⚠️',
  success: '✅',
  growth: '📈',
  food: '🌾',
  water: '💧',
  medicine: '💊',
  building: '🏠',
} as const;

// Statuts des lots
export const batchStatus = {
  active: {
    label: 'Actif',
    color: colors.success,
    bgColor: colors.lightGreen,
  },
  warning: {
    label: 'Attention',
    color: colors.warning,
    bgColor: '#FFE0B2',
  },
  critical: {
    label: 'Critique',
    color: colors.danger,
    bgColor: '#FFCDD2',
  },
  completed: {
    label: 'Terminé',
    color: colors.textGray,
    bgColor: colors.lightGray,
  },
} as const;

// Messages UX
export const messages = {
  placeholders: {
    mortality: 'Mortalité du jour',
    food: 'Aliment distribué (kg)',
    water: 'Eau consommée (L)',
    notes: 'Notes du vétérinaire ou observations...',
    batchName: 'Ex: Lot Poulets - Bâtiment A',
    quantity: 'Effectif initial',
  },
  success: {
    saved: 'Enregistré avec succès',
    created: 'Créé avec succès',
    deleted: 'Supprimé avec succès',
  },
  errors: {
    required: 'Ce champ est obligatoire',
    network: 'Problème de connexion - vos données seront sauvegardées localement',
  },
} as const;

// Breakpoints responsive
export const breakpoints = {
  mobile: '320px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1280px',
} as const;

// Configuration grille dashboard
export const dashboardLayout = {
  mobile: {
    quickActionsGrid: 2, // 2 colonnes
    lotsGrid: 1,         // 1 colonne
  },
  tablet: {
    quickActionsGrid: 2,
    lotsGrid: 2,
  },
  desktop: {
    quickActionsGrid: 4, // 4 colonnes
    lotsGrid: 2,
    mainColumns: '2fr 1fr', // Layout 2 colonnes (graphiques | liste lots)
  },
} as const;

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  components,
  icons,
  batchStatus,
  messages,
  breakpoints,
  dashboardLayout,
};
