# Design System - Gestion de Ferme

Design System mobile-first optimisé pour les zones rurales africaines avec connexions faibles.

## 🎨 Philosophie

### Principes Clés
1. **Mobile-First** - Optimisé pour smartphones Android bas de gamme
2. **Léger** - Minimiser l'utilisation des données
3. **Accessible** - Touch targets de 44-48px minimum
4. **Performant** - Animations légères, CSS optimisé
5. **Lisible** - Contrastes élevés, tailles de police généreuses

## 🌈 Couleurs

### Palette Principale

#### Primaire - Vert Agriculture
```css
--color-primary-500: oklch(0.56 0.18 145)  /* #2E8B57 */
```
- **Usage:** Actions principales, navigation active, boutons CTA
- **Symbolique:** Croissance, nature, agriculture

#### Secondaire - Orange Chaleureux
```css
--color-secondary-500: oklch(0.65 0.16 65)  /* #FFB74D */
```
- **Usage:** Alertes, accents, badges
- **Symbolique:** Énergie, chaleur, optimisme

### Couleurs Sémantiques

| Couleur | Variable | Usage |
|---------|----------|-------|
| ✅ Succès | `--color-success` | Validation, état positif |
| ⚠️ Warning | `--color-warning` | Alertes, attention requise |
| ❌ Danger | `--color-danger` | Erreurs, actions destructives |
| ℹ️ Info | `--color-info` | Informations, conseils |

### Neutrals (Gris)

```css
--color-neutral-50   /* Backgrounds */
--color-neutral-100  /* Borders light */
--color-neutral-500  /* Text secondary */
--color-neutral-900  /* Text primary */
```

## 📝 Typographie

### Font Family
```css
--font-sans: 'Inter', -apple-system, sans-serif
```

**Pourquoi Inter ?**
- Excellent rendu sur tous les devices
- Hauteur x généreuse → lisibilité mobile
- Gratuit et open-source
- Chargement rapide

### Échelle Typographique

| Taille | Variable | Pixels | Usage |
|--------|----------|--------|-------|
| XS | `--text-xs` | 12px | Labels, badges, métadonnées |
| SM | `--text-sm` | 14px | Corps secondaire, helper text |
| Base | `--text-base` | **16px** | **Corps principal mobile** |
| LG | `--text-lg` | 18px | Sous-titres |
| XL | `--text-xl` | 20px | Titres de cards |
| 2XL | `--text-2xl` | 24px | Titres de pages |
| 3XL | `--text-3xl` | 30px | Hero sections |

**Base mobile: 16px minimum** pour lisibilité optimale sans zoom.

### Font Weights

```css
--font-normal: 400    /* Corps de texte */
--font-medium: 500    /* Labels, nav items */
--font-semibold: 600  /* Titres de cards */
--font-bold: 700      /* Headings, CTA */
```

### Line Heights

```css
--leading-tight: 1.25     /* Titres */
--leading-normal: 1.5     /* Corps de texte */
--leading-relaxed: 1.625  /* Paragraphes longs */
```

## 📏 Spacing

Système basé sur **4px** (base unit).

| Variable | Valeur | Usage |
|----------|--------|-------|
| `--space-1` | 4px | Marges internes très petites |
| `--space-2` | 8px | Espaces compacts |
| `--space-3` | 12px | Padding inputs/buttons |
| `--space-4` | **16px** | **Spacing standard** |
| `--space-6` | 24px | Padding cards |
| `--space-8` | 32px | Sections spacing |
| `--space-12` | 48px | Large spacing |

## 🔘 Composants

### Buttons

#### Variantes
```tsx
<button className="btn btn-primary">Action Principale</button>
<button className="btn btn-secondary">Secondaire</button>
<button className="btn btn-ghost">Tertiaire</button>
<button className="btn btn-danger">Supprimer</button>
```

#### Tailles
```tsx
<button className="btn btn-sm">Petit (36px)</button>
<button className="btn">Normal (48px)</button>
<button className="btn btn-lg">Grand (56px)</button>
```

#### Règles
- ✅ Hauteur minimale: **48px** (Material Design)
- ✅ Padding horizontal: minimum 24px
- ✅ Font weight: medium (500)
- ✅ Border radius: 12px
- ✅ Transitions: 150ms

### Cards

```tsx
<div className="card">
  <div className="card-header">
    <h3>Titre de la Card</h3>
  </div>
  <div className="card-body">
    Contenu principal
  </div>
  <div className="card-footer">
    Actions
  </div>
</div>
```

#### Règles
- ✅ Border radius: 16px
- ✅ Padding: 24px (16px sur mobile compact)
- ✅ Shadow: subtile (éviter heavy shadows)
- ✅ Hover: légère élévation

### Inputs

```tsx
<div>
  <label className="label">Nom du lot</label>
  <input 
    className="input" 
    type="text" 
    placeholder="Ex: Lot A-2024"
  />
  <span className="helper-text">Minimum 3 caractères</span>
</div>
```

#### Règles
- ✅ Hauteur: **48px** minimum
- ✅ Padding: 12px 16px
- ✅ Font size: 16px (évite zoom iOS)
- ✅ Border: 1px solid
- ✅ Focus ring: 2px outline

### Badges

```tsx
<span className="badge badge-success">Actif</span>
<span className="badge badge-warning">Attention</span>
<span className="badge badge-danger">Critique</span>
```

#### Règles
- ✅ Uppercase + letter-spacing
- ✅ Petit (12px)
- ✅ Bold (600)
- ✅ Border radius: full

## 🎯 Touch Targets

### Tailles Minimales

```css
--touch-target-min: 44px    /* Apple HIG */
--touch-target-ideal: 48px  /* Material Design */
```

**Recommandation:** Toujours utiliser **48px minimum** pour:
- Boutons
- Liens dans listes
- Icons cliquables
- Items de navigation

### Espacement

Entre deux touch targets: **minimum 8px**.

## 🌓 Dark Mode

```tsx
// Toggle dark mode
document.documentElement.classList.toggle('dark');
```

Les couleurs s'adaptent automatiquement via les CSS variables.

### Règles Dark Mode
- Backgrounds: oklch(0.15-0.25)
- Text: oklch(0.98-0.58)
- Contraste minimum: 7:1 (WCAG AAA)

## 📱 Responsive Breakpoints

| Breakpoint | Valeur | Device |
|------------|--------|--------|
| Mobile | < 640px | Smartphones |
| Tablet | 640px - 1024px | Tablettes |
| Desktop | > 1024px | Ordinateurs |

### Classes Utilitaires

```tsx
<div className="show-mobile">Visible mobile seulement</div>
<div className="hide-mobile">Caché sur mobile</div>
<div className="show-tablet">Visible tablet+</div>
<div className="show-desktop">Visible desktop seulement</div>
```

## ⚡ Performance

### Règles d'Optimisation

1. **Animations légères**
   - Privilégier `transform` et `opacity`
   - Éviter `width`, `height`, `top`, `left`
   - Max 300ms de durée

2. **Shadows subtiles**
   - Éviter multiples box-shadows
   - Utiliser tokens prédéfinis

3. **Images optimisées**
   - WebP avec fallback
   - Lazy loading
   - Responsive images

4. **Fonts**
   - Subset Inter (latin uniquement)
   - Preload critical fonts
   - Font-display: swap

## 🎨 Exemples Complets

### StatCard Component

```tsx
<div className="card">
  <div className="card-body">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-secondary mb-1">Lots Actifs</p>
        <p className="text-3xl font-bold">12</p>
        <p className="text-sm text-success mt-2">
          ↑ 8% vs mois dernier
        </p>
      </div>
      <div className="p-3 rounded-lg bg-primary-100">
        <Bird className="h-6 w-6 text-primary-600" />
      </div>
    </div>
  </div>
</div>
```

### Form Group

```tsx
<div className="space-y-4">
  <div>
    <label className="label">Email</label>
    <input 
      className="input" 
      type="email"
      placeholder="exemple@farm.com"
    />
  </div>
  
  <div>
    <label className="label">Type d'élevage</label>
    <select className="select">
      <option>Aviculture</option>
      <option>Porcin</option>
    </select>
  </div>
  
  <button className="btn btn-primary w-full">
    Créer le compte
  </button>
</div>
```

## 📦 Imports

### Dans vos composants

```tsx
// Styles déjà inclus via index.css
import '@/index.css';

// Utiliser les classes directement
<button className="btn btn-primary">Click</button>
```

### Variables CSS en JS

```tsx
const primaryColor = 'var(--color-primary-500)';
const spacing = 'var(--space-4)';
```

## ✅ Checklist Design

Avant de créer un nouveau composant:

- [ ] Touch target ≥ 48px
- [ ] Font size ≥ 16px sur mobile
- [ ] Contraste ≥ 4.5:1 (WCAG AA)
- [ ] Focus visible (outline)
- [ ] Hover states (desktop only)
- [ ] Transitions ≤ 300ms
- [ ] Responsive (mobile-first)
- [ ] Dark mode supporté

---

**Maintenu par:** Équipe Frontend  
**Dernière mise à jour:** Décembre 2025
