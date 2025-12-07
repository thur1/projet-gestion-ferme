-- =====================================================
-- SCHEMA SQL POUR GESTION DE FERME - SUPABASE/POSTGRESQL
-- =====================================================
-- Description: Base de données complète pour la gestion de ferme
-- Auteur: Auto-généré
-- Date: 2025-12-07
-- =====================================================

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE: users (profils utilisateurs)
-- =====================================================
-- Note: Supabase Auth gère auth.users automatiquement
-- Cette table étend les profils utilisateurs

CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'manager')),
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Index pour recherche par email
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);

-- =====================================================
-- TABLE: farms (fermes)
-- =====================================================

CREATE TABLE public.farms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    location TEXT,
    address TEXT,
    city TEXT,
    postal_code TEXT,
    country TEXT DEFAULT 'France',
    area_hectares DECIMAL(10, 2),
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER farms_updated_at
    BEFORE UPDATE ON public.farms
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Index
CREATE INDEX idx_farms_user_id ON public.farms(user_id);
CREATE INDEX idx_farms_is_active ON public.farms(is_active);
CREATE INDEX idx_farms_name ON public.farms(name);

-- =====================================================
-- TABLE: buildings (bâtiments)
-- =====================================================

CREATE TABLE public.buildings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    building_type TEXT NOT NULL CHECK (building_type IN ('barn', 'stable', 'silo', 'greenhouse', 'storage', 'other')),
    capacity INTEGER,
    area_sqm DECIMAL(10, 2),
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER buildings_updated_at
    BEFORE UPDATE ON public.buildings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Index
CREATE INDEX idx_buildings_farm_id ON public.buildings(farm_id);
CREATE INDEX idx_buildings_type ON public.buildings(building_type);
CREATE INDEX idx_buildings_is_active ON public.buildings(is_active);

-- =====================================================
-- TABLE: batches (lots d'animaux ou cultures)
-- =====================================================

CREATE TABLE public.batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
    building_id UUID REFERENCES public.buildings(id) ON DELETE SET NULL,
    batch_number TEXT NOT NULL,
    batch_type TEXT NOT NULL CHECK (batch_type IN ('livestock', 'poultry', 'crop', 'other')),
    species TEXT, -- Ex: poule, vache, blé, maïs
    breed TEXT, -- Race ou variété
    initial_quantity INTEGER NOT NULL,
    current_quantity INTEGER NOT NULL,
    unit TEXT DEFAULT 'head' CHECK (unit IN ('head', 'kg', 'ton', 'unit')),
    start_date DATE NOT NULL,
    end_date DATE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_batch_number_per_farm UNIQUE(farm_id, batch_number)
);

CREATE TRIGGER batches_updated_at
    BEFORE UPDATE ON public.batches
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Index
CREATE INDEX idx_batches_farm_id ON public.batches(farm_id);
CREATE INDEX idx_batches_building_id ON public.batches(building_id);
CREATE INDEX idx_batches_batch_number ON public.batches(batch_number);
CREATE INDEX idx_batches_status ON public.batches(status);
CREATE INDEX idx_batches_type ON public.batches(batch_type);
CREATE INDEX idx_batches_start_date ON public.batches(start_date);

-- =====================================================
-- TABLE: batch_daily_logs (suivi journalier des lots)
-- =====================================================

CREATE TABLE public.batch_daily_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID NOT NULL REFERENCES public.batches(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    quantity INTEGER, -- Quantité du jour
    deaths INTEGER DEFAULT 0, -- Nombre de morts (animaux)
    births INTEGER DEFAULT 0, -- Nombre de naissances
    weight_avg DECIMAL(10, 2), -- Poids moyen
    feed_consumed DECIMAL(10, 2), -- Aliments consommés (kg)
    water_consumed DECIMAL(10, 2), -- Eau consommée (litres)
    temperature DECIMAL(5, 2), -- Température (°C)
    humidity DECIMAL(5, 2), -- Humidité (%)
    health_status TEXT, -- État sanitaire général
    observations TEXT,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_batch_log_per_day UNIQUE(batch_id, log_date)
);

CREATE TRIGGER batch_daily_logs_updated_at
    BEFORE UPDATE ON public.batch_daily_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Index
CREATE INDEX idx_batch_daily_logs_batch_id ON public.batch_daily_logs(batch_id);
CREATE INDEX idx_batch_daily_logs_log_date ON public.batch_daily_logs(log_date);
CREATE INDEX idx_batch_daily_logs_created_by ON public.batch_daily_logs(created_by);

-- =====================================================
-- TABLE: stock_items (articles en stock)
-- =====================================================

CREATE TABLE public.stock_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
    item_name TEXT NOT NULL,
    item_category TEXT NOT NULL CHECK (item_category IN ('feed', 'medication', 'equipment', 'seed', 'fertilizer', 'other')),
    sku TEXT, -- Code article
    unit TEXT NOT NULL CHECK (unit IN ('kg', 'liter', 'unit', 'bag', 'ton')),
    current_stock DECIMAL(10, 2) DEFAULT 0,
    min_stock DECIMAL(10, 2) DEFAULT 0, -- Stock minimum (alerte)
    unit_price DECIMAL(10, 2),
    supplier TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_sku_per_farm UNIQUE(farm_id, sku)
);

CREATE TRIGGER stock_items_updated_at
    BEFORE UPDATE ON public.stock_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Index
CREATE INDEX idx_stock_items_farm_id ON public.stock_items(farm_id);
CREATE INDEX idx_stock_items_category ON public.stock_items(item_category);
CREATE INDEX idx_stock_items_sku ON public.stock_items(sku);
CREATE INDEX idx_stock_items_is_active ON public.stock_items(is_active);

-- =====================================================
-- TABLE: stock_movements (mouvements de stock)
-- =====================================================

CREATE TABLE public.stock_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stock_item_id UUID NOT NULL REFERENCES public.stock_items(id) ON DELETE CASCADE,
    movement_type TEXT NOT NULL CHECK (movement_type IN ('in', 'out', 'adjustment')),
    quantity DECIMAL(10, 2) NOT NULL,
    unit_price DECIMAL(10, 2),
    total_price DECIMAL(10, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    batch_id UUID REFERENCES public.batches(id) ON DELETE SET NULL, -- Si lié à un lot
    movement_date TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    reason TEXT, -- Achat, vente, consommation, perte, etc.
    notes TEXT,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index
CREATE INDEX idx_stock_movements_stock_item_id ON public.stock_movements(stock_item_id);
CREATE INDEX idx_stock_movements_batch_id ON public.stock_movements(batch_id);
CREATE INDEX idx_stock_movements_type ON public.stock_movements(movement_type);
CREATE INDEX idx_stock_movements_date ON public.stock_movements(movement_date);
CREATE INDEX idx_stock_movements_created_by ON public.stock_movements(created_by);

-- =====================================================
-- TRIGGER: Mise à jour automatique du stock
-- =====================================================

CREATE OR REPLACE FUNCTION update_stock_on_movement()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.movement_type = 'in' THEN
        UPDATE public.stock_items
        SET current_stock = current_stock + NEW.quantity
        WHERE id = NEW.stock_item_id;
    ELSIF NEW.movement_type = 'out' THEN
        UPDATE public.stock_items
        SET current_stock = current_stock - NEW.quantity
        WHERE id = NEW.stock_item_id;
    ELSIF NEW.movement_type = 'adjustment' THEN
        UPDATE public.stock_items
        SET current_stock = NEW.quantity
        WHERE id = NEW.stock_item_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER stock_movements_update_stock
    AFTER INSERT ON public.stock_movements
    FOR EACH ROW
    EXECUTE FUNCTION update_stock_on_movement();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Activer RLS sur toutes les tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batch_daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;

-- Politique: Les utilisateurs peuvent voir leur propre profil
CREATE POLICY users_select_own
    ON public.users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY users_update_own
    ON public.users FOR UPDATE
    USING (auth.uid() = id);

-- Politique: Les utilisateurs peuvent gérer leurs propres fermes
CREATE POLICY farms_select_own
    ON public.farms FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY farms_insert_own
    ON public.farms FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY farms_update_own
    ON public.farms FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY farms_delete_own
    ON public.farms FOR DELETE
    USING (auth.uid() = user_id);

-- Politique: Accès aux bâtiments via les fermes possédées
CREATE POLICY buildings_select_via_farm
    ON public.buildings FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.farms
        WHERE farms.id = buildings.farm_id
        AND farms.user_id = auth.uid()
    ));

CREATE POLICY buildings_insert_via_farm
    ON public.buildings FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.farms
        WHERE farms.id = buildings.farm_id
        AND farms.user_id = auth.uid()
    ));

CREATE POLICY buildings_update_via_farm
    ON public.buildings FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.farms
        WHERE farms.id = buildings.farm_id
        AND farms.user_id = auth.uid()
    ));

CREATE POLICY buildings_delete_via_farm
    ON public.buildings FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM public.farms
        WHERE farms.id = buildings.farm_id
        AND farms.user_id = auth.uid()
    ));

-- Politique: Accès aux lots via les fermes possédées
CREATE POLICY batches_select_via_farm
    ON public.batches FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.farms
        WHERE farms.id = batches.farm_id
        AND farms.user_id = auth.uid()
    ));

CREATE POLICY batches_insert_via_farm
    ON public.batches FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.farms
        WHERE farms.id = batches.farm_id
        AND farms.user_id = auth.uid()
    ));

CREATE POLICY batches_update_via_farm
    ON public.batches FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.farms
        WHERE farms.id = batches.farm_id
        AND farms.user_id = auth.uid()
    ));

CREATE POLICY batches_delete_via_farm
    ON public.batches FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM public.farms
        WHERE farms.id = batches.farm_id
        AND farms.user_id = auth.uid()
    ));

-- Politique: Accès aux logs journaliers via les lots
CREATE POLICY batch_daily_logs_select_via_batch
    ON public.batch_daily_logs FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.batches
        JOIN public.farms ON farms.id = batches.farm_id
        WHERE batches.id = batch_daily_logs.batch_id
        AND farms.user_id = auth.uid()
    ));

CREATE POLICY batch_daily_logs_insert_via_batch
    ON public.batch_daily_logs FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.batches
        JOIN public.farms ON farms.id = batches.farm_id
        WHERE batches.id = batch_daily_logs.batch_id
        AND farms.user_id = auth.uid()
    ));

CREATE POLICY batch_daily_logs_update_via_batch
    ON public.batch_daily_logs FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.batches
        JOIN public.farms ON farms.id = batches.farm_id
        WHERE batches.id = batch_daily_logs.batch_id
        AND farms.user_id = auth.uid()
    ));

CREATE POLICY batch_daily_logs_delete_via_batch
    ON public.batch_daily_logs FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM public.batches
        JOIN public.farms ON farms.id = batches.farm_id
        WHERE batches.id = batch_daily_logs.batch_id
        AND farms.user_id = auth.uid()
    ));

-- Politique: Accès aux articles de stock via les fermes
CREATE POLICY stock_items_select_via_farm
    ON public.stock_items FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.farms
        WHERE farms.id = stock_items.farm_id
        AND farms.user_id = auth.uid()
    ));

CREATE POLICY stock_items_insert_via_farm
    ON public.stock_items FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.farms
        WHERE farms.id = stock_items.farm_id
        AND farms.user_id = auth.uid()
    ));

CREATE POLICY stock_items_update_via_farm
    ON public.stock_items FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.farms
        WHERE farms.id = stock_items.farm_id
        AND farms.user_id = auth.uid()
    ));

CREATE POLICY stock_items_delete_via_farm
    ON public.stock_items FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM public.farms
        WHERE farms.id = stock_items.farm_id
        AND farms.user_id = auth.uid()
    ));

-- Politique: Accès aux mouvements de stock via les articles
CREATE POLICY stock_movements_select_via_item
    ON public.stock_movements FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.stock_items
        JOIN public.farms ON farms.id = stock_items.farm_id
        WHERE stock_items.id = stock_movements.stock_item_id
        AND farms.user_id = auth.uid()
    ));

CREATE POLICY stock_movements_insert_via_item
    ON public.stock_movements FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.stock_items
        JOIN public.farms ON farms.id = stock_items.farm_id
        WHERE stock_items.id = stock_movements.stock_item_id
        AND farms.user_id = auth.uid()
    ));

-- =====================================================
-- FONCTION: Créer automatiquement un profil utilisateur
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger sur auth.users (géré par Supabase)
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- VUES UTILES
-- =====================================================

-- Vue: Stock avec alertes de niveau bas
CREATE OR REPLACE VIEW public.stock_alerts AS
SELECT 
    si.*,
    f.name AS farm_name,
    (si.current_stock <= si.min_stock) AS is_low_stock,
    (si.min_stock - si.current_stock) AS shortage_quantity
FROM public.stock_items si
JOIN public.farms f ON f.id = si.farm_id
WHERE si.current_stock <= si.min_stock
AND si.is_active = true;

-- Vue: Résumé des lots actifs
CREATE OR REPLACE VIEW public.active_batches_summary AS
SELECT 
    b.*,
    f.name AS farm_name,
    bld.name AS building_name,
    (b.initial_quantity - b.current_quantity) AS quantity_lost,
    ROUND(((b.initial_quantity - b.current_quantity)::DECIMAL / b.initial_quantity * 100), 2) AS loss_percentage
FROM public.batches b
JOIN public.farms f ON f.id = b.farm_id
LEFT JOIN public.buildings bld ON bld.id = b.building_id
WHERE b.status = 'active';

-- =====================================================
-- DONNÉES DE TEST (OPTIONNEL)
-- =====================================================

-- Vous pouvez ajouter des données de test ici si nécessaire
-- INSERT INTO public.farms (user_id, name, location) VALUES ...

-- =====================================================
-- FIN DU SCRIPT
-- =====================================================

-- Commentaires:
-- 1. Toutes les tables ont des timestamps (created_at, updated_at)
-- 2. Les clés étrangères ont des actions ON DELETE appropriées
-- 3. Les index sont créés pour optimiser les requêtes courantes
-- 4. RLS est activé pour sécuriser l'accès aux données
-- 5. Un trigger met à jour automatiquement le stock lors des mouvements
-- 6. Les profils utilisateurs sont créés automatiquement lors de l'inscription
