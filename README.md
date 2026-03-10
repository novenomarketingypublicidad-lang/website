# Noveno SPA - Marketing & Content Creator

Una Single Page Application (SPA) inmersiva, de ultra-alto rendimiento y estéticamente refinada, diseñada para la agencia **Noveno**.
Construida con arquitecturas modernas de renderizado y animación para ofrecer una experiencia de usuario fluida y corporativa.

## 🚀 Tecnologías Core
- **Framework:** Next.js 15 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS v4
- **Animaciones:** Framer Motion
- **Iconografía:** Lucide React

## 🧭 Arquitectura de Navegación Híbrida
El sitio utiliza un motor de scroll bidireccional avanzado:
* **Scroll Horizontal:** Permite la transición fluida a pantalla completa (sin recargas) a través de los 6 sectores principales: Inicio, Hotelero y Resorts, Gastronomía, Deportes, Náuticos y Aventura, y Eventos.
* **Scroll Vertical:** Cada sector independiente actúa como una "mini-página" de scroll profundo, revelando galerías expansivas, carruseles de clientes interactivos y equipo de trabajo sin perder el contexto del slide principal.

## 🎨 Componentes Visuales Críticos
- **Parallax Portfolio:** Swipe interactivo de medios (imágenes/videos) amarrado físicamente al desplazamiento vertical del usuario.
- **Client Marquee:** Animación de carrusel infinita para la exposición de logotipos de clientes.
- **Dynamic Custom Cursor:** Un cursor elástico personalizado que deletrea independientemente el acrónimo `N-O-V-E-N-O` dependiendo de en qué grupo horizontal esté navegando el visitante.
- **Universal Footer:** Un pie de página dinámico montado interactivamente al fondo del pozo (bottom) de todos y cada uno de los sectores navegables.

## ⚙️ Panel de Control Administrativo (CMS Local)
El proyecto incluye un Dashboard integrado en la ruta protegida `/admin` que permite gestionar en caliente el contenido de la web antes de la conexión oficial al Backend (Supabase).

**Acceso Local:**
- URL: `http://localhost:3000/admin`
- Email de prueba: `admin@test.com`
- Contraseña: `12345678`

**Capacidades del Dashboard:**
1. **Sectores:** Modificar títulos y alterar la carga de Imágenes Fotográficas o Videos Boop Loop MP4 de fondo en tiempo real mediante URL.
2. **Equipo Noveno:** Añada, edite o elimine las Cards de "Miembros del Equipo" con visualización previa en cuadrícula.
3. **Colaboradores:** Control sobre las marcas aliadas con el mismo motor de inyección del equipo.
4. **Configuración General:** Modificación directa de correos, números de teléfono, locación y links corporativos de LinkedIn e Instagram que se renderizan universalmente en el Footer de toda la aplicación.

## 📦 Despliegue en Desarrollo

1. Clona el repositorio e instala dependencias:
```bash
npm install
```

2. Arranca el servidor de validación local (con soporte de hot-reload):
```bash
npm run dev
```

3. Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la experiencia visual.
