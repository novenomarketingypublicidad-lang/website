-- Database Schema para Noveno v3 CRM
-- Copia y ejecuta este script en la consola SQL de tu Dashboard de Supabase.

-- 1. Tabla de Sectores
CREATE TABLE IF NOT EXISTS sectors (
  id text PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  media_url text,
  media_type text CHECK (media_type IN ('image', 'video')),
  team_members jsonb,
  collaborators jsonb,
  clients jsonb,
  portfolio jsonb, -- Expected structure: [{ id: "...", mediaUrl: "...", mediaType: "image"|"video", title: "...", projectName: "..." }]
  about_text text,
  updated_at timestamp with time zone DEFAULT now()
);

-- RLS (Row Level Security) para Sectores
ALTER TABLE sectors ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read access for sectors" ON sectors;
CREATE POLICY "Public read access for sectors" ON sectors FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin full access for sectors" ON sectors;
CREATE POLICY "Admin full access for sectors" ON sectors FOR ALL USING (true); -- Permitir todo anon/public temporalmente para Admin (luego restringir con Auth)

-- 2. Tabla de Servicios Cotizables
CREATE TABLE IF NOT EXISTS quote_services (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- RLS para Servicios
ALTER TABLE quote_services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read access for quote_services" ON quote_services;
CREATE POLICY "Public read access for quote_services" ON quote_services FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin full access for quote_services" ON quote_services;
CREATE POLICY "Admin full access for quote_services" ON quote_services FOR ALL USING (true);

-- 3. Tabla de Cotizaciones/Leads (CRM)
CREATE TABLE IF NOT EXISTS leads (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text,
  services text[] DEFAULT '{}'::text[], -- Array de IDs de quote_services
  status text CHECK (status IN ('nuevo', 'revisado', 'contactado', 'cerrado', 'cancelado')) DEFAULT 'nuevo',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- RLS para Leads
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
-- Insert público (formulario Footer)
DROP POLICY IF EXISTS "Public insert access for leads" ON leads;
CREATE POLICY "Public insert access for leads" ON leads FOR INSERT WITH CHECK (true);
-- Leer y Actualizar (Panel Admin Kanban)
DROP POLICY IF EXISTS "Admin full access for leads" ON leads;
CREATE POLICY "Admin full access for leads" ON leads FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin update access for leads" ON leads;
CREATE POLICY "Admin update access for leads" ON leads FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Admin delete access for leads" ON leads;
CREATE POLICY "Admin delete access for leads" ON leads FOR DELETE USING (true);

-- 4. Tabla de Configuración Footer
CREATE TABLE IF NOT EXISTS footer_config (
  id integer PRIMARY KEY DEFAULT 1,
  email text,
  phone text,
  address text,
  instagram text,
  linkedin text,
  updated_at timestamp with time zone DEFAULT now()
);
-- Solo debe haber 1 fila, forzamos con un Constraint
ALTER TABLE footer_config DROP CONSTRAINT IF EXISTS one_row_only;
ALTER TABLE footer_config ADD CONSTRAINT one_row_only CHECK (id = 1);

-- RLS para Footer
ALTER TABLE footer_config ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read access for footer_config" ON footer_config;
CREATE POLICY "Public read access for footer_config" ON footer_config FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin full access for footer_config" ON footer_config;
CREATE POLICY "Admin full access for footer_config" ON footer_config FOR ALL USING (true);

-- ==============================================================================
-- 5. SEMILLA DE DATOS INICIALES (MOCK DATA)
-- Extraído del estado local de useAgencyData.ts
-- Ejecutar estas instrucciones insertará los datos de prueba base idénticos al frontend actual.
-- ==============================================================================

-- 5.1 Insertar Rutas Base de Sectores
INSERT INTO sectors (id, slug, title, description, media_url, media_type, team_members, collaborators, clients, portfolio) VALUES
(
  'inicio', 
  'inicio', 
  'Noveno', 
  'Marketing & Content Creator', 
  'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2000', 
  'image',
  '[{"id": "1", "name": "Grecia Robles", "role": "Co-Founder / Creativa", "imageUrl": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600"}, {"id": "2", "name": "Alex V.", "role": "Creative Director", "imageUrl": "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=600"}]'::jsonb,
  '[{"id": "collab1", "name": "Resort Lux", "role": "Partner", "imageUrl": "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=600&q=80"}, {"id": "collab2", "name": "Gastro Elite", "role": "Brand", "imageUrl": "https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=600&q=80"}]'::jsonb,
  '[]'::jsonb,
  '[]'::jsonb
),
(
  'hotelero', 
  'hotelero', 
  'Hotelero y Resorts', 
  'Creando inmersión y deseo para destinos de alta gama.', 
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=2000', 
  'image',
  '[]'::jsonb,
  '[]'::jsonb,
  '[{"id": "h1", "logoUrl": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?auto=format&fit=crop&w=200&q=80", "brandName": "Marriott"}, {"id": "h2", "logoUrl": "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=200&q=80", "brandName": "Hilton"}, {"id": "h3", "logoUrl": "https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=200&q=80", "brandName": "Four Seasons"}, {"id": "h4", "logoUrl": "https://images.unsplash.com/photo-1614680376408-1122bf577607?auto=format&fit=crop&w=200&q=80", "brandName": "Ritz"}]'::jsonb,
  '[{"id": "p1", "title": "Campaña Verano", "mediaUrl": "https://images.unsplash.com/photo-1542314831-c6a4d14d88e4?auto=format&fit=crop&q=80&w=800", "mediaType": "image", "projectName": "Four Seasons"}, {"id": "p2", "title": "Tour Virtual", "mediaUrl": "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800", "mediaType": "image", "projectName": "Hilton"}, {"id": "p3", "title": "Experiencia 360", "mediaUrl": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800", "mediaType": "image", "projectName": "Four Seasons"}]'::jsonb
),
(
  'gastronomia', 
  'gastronomia', 
  'Gastronomía', 
  'Visuales que desatan el apetito.', 
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=2000', 
  'image',
  '[]'::jsonb,
  '[]'::jsonb,
  '[{"id": "g1", "logoUrl": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?auto=format&fit=crop&w=200&q=80", "brandName": "Nobu"}, {"id": "g2", "logoUrl": "https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=200&q=80", "brandName": "Pujol"}]'::jsonb,
  '[{"id": "g_p1", "title": "Menú Lanzamiento", "mediaUrl": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800", "mediaType": "image", "projectName": "Pujol"}, {"id": "g_p2", "title": "Recetario Visual", "mediaUrl": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800", "mediaType": "image", "projectName": "Nobu"}]'::jsonb
),
(
  'deportes', 
  'deportes', 
  'Deportes', 
  'Capturando la intensidad y la adrenalina del momento.', 
  'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=2000', 
  'image',
  '[]'::jsonb,
  '[]'::jsonb,
  '[{"id": "d1", "logoUrl": "https://images.unsplash.com/photo-1614680376408-1122bf577607?auto=format&fit=crop&w=200&q=80", "brandName": "Crossfit"}]'::jsonb,
  '[{"id": "d_p1", "title": "Atleta Profile", "mediaUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800", "mediaType": "image", "projectName": "Crossfit"}, {"id": "d_p2", "title": "Torneo Anual", "mediaUrl": "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?auto=format&fit=crop&q=80&w=800", "mediaType": "image", "projectName": "Crossfit"}]'::jsonb
),
(
  'nauticos', 
  'nauticos', 
  'Náuticos y aventura', 
  'La pureza del aire libre llevada a la excelencia.', 
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=2000', 
  'image',
  '[]'::jsonb,
  '[]'::jsonb,
  '[]'::jsonb,
  '[{"id": "n_p1", "mediaUrl": "https://images.unsplash.com/photo-1520208422220-d12a3c588e6c?auto=format&fit=crop&q=80&w=800", "mediaType": "image"}, {"id": "n_p2", "mediaUrl": "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?auto=format&fit=crop&q=80&w=800", "mediaType": "image"}]'::jsonb
),
(
  'eventos', 
  'eventos', 
  'Eventos', 
  'Experiencias transformadas en legados visuales.', 
  'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=2000', 
  'image',
  '[]'::jsonb,
  '[]'::jsonb,
  '[]'::jsonb,
  '[{"id": "e_p1", "mediaUrl": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800", "mediaType": "image"}, {"id": "e_p2", "mediaUrl": "https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&q=80&w=800", "mediaType": "image"}]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  media_url = EXCLUDED.media_url,
  media_type = EXCLUDED.media_type,
  team_members = EXCLUDED.team_members,
  collaborators = EXCLUDED.collaborators,
  clients = EXCLUDED.clients,
  portfolio = EXCLUDED.portfolio;

-- 5.2 Insertar Config Footer Fija
INSERT INTO footer_config (id, email, phone, address, instagram, linkedin)
VALUES (
  1, 
  'hello@noveno.com', 
  '+52 1 55 1234 5678', 
  'Ciudad de México, México', 
  'https://instagram.com/noveno', 
  'https://linkedin.com/company/noveno'
) ON CONFLICT (id) DO UPDATE SET 
  email = EXCLUDED.email, 
  phone = EXCLUDED.phone, 
  address = EXCLUDED.address, 
  instagram = EXCLUDED.instagram, 
  linkedin = EXCLUDED.linkedin;

-- 5.3 Insertar Servicios Estáticos de Cotización
INSERT INTO quote_services (id, name) VALUES 
  ('s1', 'Estrategia de Marca'),
  ('s2', 'Creación de Contenido'),
  ('s3', 'Campañas Digitales'),
  ('s4', 'Diseño Web'),
  ('s5', 'Producción Audiovisual')
ON CONFLICT (id) DO NOTHING;

-- 5.4 Insertar Leads de Muestra
INSERT INTO leads (id, full_name, email, phone, message, services, status, created_at) VALUES 
  ('l1', 'Arturo C.', 'arturo@empresa.com', '555-0192', 'Necesito un rediseño de marca urgente para nuestra cadena de hoteles.', '{"s1", "s4"}', 'nuevo', now()),
  ('l2', 'Diana M.', 'diana@restaurant.com', null, 'Cotización para fotos de menú nuevo.', '{"s5", "s2"}', 'revisado', now() - interval '1 day'),
  ('l3', 'Carlos T.', 'carlos@startup.tech', '555-8822', 'Lanzamiento digital esperado para Junio.', '{"s3", "s1"}', 'contactado', now() - interval '2 days')
ON CONFLICT (id) DO NOTHING;

-- Habilitar Realtime para las tablas clave
ALTER PUBLICATION supabase_realtime ADD TABLE sectors;
ALTER PUBLICATION supabase_realtime ADD TABLE leads;
ALTER PUBLICATION supabase_realtime ADD TABLE footer_config;
ALTER PUBLICATION supabase_realtime ADD TABLE quote_services;
