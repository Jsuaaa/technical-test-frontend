# Framecore Task Board

**Framecore Task Board** es una aplicación construida con Next.js 16 y TypeScript que permite gestionar tareas conectándose a una base de datos de Supabase. El tablero ofrece visualización en formato kanban y en lista, métricas por estado, búsqueda con debounce e interacciones inline para editar, cambiar estado, ajustar prioridad o eliminar tareas sin abandonar la vista.

## Demo

Actualmente no hay una demo pública desplegada. Puedes ejecutar el proyecto en local siguiendo los pasos de instalación.

## Tabla de Contenidos

- [Visión General](#visión-general)
- [Características](#características)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Uso](#uso)
- [Testing](#testing)
- [Despliegue](#despliegue)
- [Decisiones Técnicas](#decisiones-técnicas)
- [Limitaciones y Áreas de Mejora](#limitaciones-y-áreas-de-mejora)
- [Licencia](#licencia)

## Visión General

La aplicación **Framecore Task Board** permite:

- Visualizar tareas en un tablero kanban organizado por estado o en una lista tabular adaptable.
- Crear nuevas tareas mediante un modal con validaciones básicas.
- Actualizar título, descripción, estado y prioridad tanto desde un modal como desde un menú contextual inline.
- Eliminar tareas con confirmación y retroalimentación inmediata.
- Monitorear métricas agregadas por estado a través de tarjetas informativas.
- Filtrar tareas por ID, título o descripción con búsqueda debounced para consultas eficientes sobre Supabase.

## Características

- **Vistas intercambiables:** Alterna entre vista tablero y vista lista manteniendo contexto y filtros.
- **Búsqueda inteligente:** Campo con debounce de 400 ms que evita sobrecargar la API y permite limpiar resultados rápidamente.
- **Edición contextual:** Menú de acciones con cambios inline de prioridad/estado y acceso al modal de edición completa.
- **Métricas en tiempo real:** Tarjetas con totales por estado alimentadas por una función RPC en Supabase.
- **Gestión de tareas CRUD:** Creación, actualización y eliminación de tareas con manejo de estados de carga y error.
- **Interfaz accesible:** Componentes Carbon Design System + Tailwind CSS 4 para un diseño responsivo y consistente.

## Tecnologías Utilizadas

- **Next.js 16 (App Router)**
- **React 19** y **TypeScript**
- **@tanstack/react-query 5** para fetching, caché y sincronización de estado remoto
- **Supabase** (`@supabase/supabase-js`) como backend de datos
- **Carbon Design System** (`@carbon/react`, `@carbon/styles`) para componentes UI
- **Tailwind CSS 4** para utilidades de estilo
- **Lucide React** para iconografía

## Estructura del Proyecto

La organización sigue un enfoque modular que separa dominio, servicios y presentación:

```
└── src
    ├── app
    │   ├── layout.tsx
    │   └── page.tsx
    ├── core
    │   ├── common/                # Componentes reusables (modales, dropdowns, inputs)
    │   ├── components/home/       # Páginas y vistas específicas (tablero, lista, métricas)
    │   ├── data/                  # Constantes y mapeos de dominio
    │   ├── domain/                # Tipos y enums de negocio
    │   ├── hooks/                 # Hooks personalizados (React Query, debounce, contexto)
    │   ├── layouts/               # Layouts compartidos
    │   ├── providers/             # Providers de contexto y React Query
    │   ├── services/              # Integraciones con Supabase
    │   ├── styles/                # Estilos globales
    │   └── utils/                 # Helpers de formato y clientes externos
```

## Instalación

1. **Clona el repositorio:**

   ```bash
   git clone <url-del-repositorio>
   cd framecore-test
   ```

2. **Instala las dependencias** (se recomienda `pnpm`, aunque puedes usar `npm` o `yarn`):

   ```bash
   pnpm install
   ```

3. **Configura las variables de entorno:**

   Crea un archivo `.env.local` en la raíz con las claves de tu proyecto Supabase:

   ```
   NEXT_PUBLIC_SUPABASE_URL=<tu-url-de-supabase>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<tu-anon-key>
   ```

4. **Prepara tu base de datos Supabase:**

   - Crea una tabla `tasks` con las columnas mínimas:

     ```sql
     create table public.tasks (
       id bigint generated always as identity primary key,
       title text not null,
       description text not null,
       status text not null check (status in ('backlog', 'in-progress', 'done')),
       priority text not null check (priority in ('Alta', 'Media', 'Baja')),
       created_at timestamptz not null default now()
     );
     ```

   - Crea la función RPC `get_tasks_status_count` utilizada por la vista de métricas:

     ```sql
     create or replace function public.get_tasks_status_count()
     returns table (
       status text,
       total bigint
     ) language sql security definer set search_path = public as $$
       select status, count(*)::bigint as total
       from public.tasks
       group by status;
     $$;
     ```

   Ajusta permisos según tus políticas de seguridad (RLS).

## Uso

### Ejecución en Desarrollo

```bash
pnpm dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

### Compilación para Producción

```bash
pnpm build
```

Para previsualizar la build localmente:

```bash
pnpm start
```

## Testing

Actualmente el proyecto no incluye suites de pruebas automatizadas. Se recomienda incorporar en el futuro:

- Pruebas unitarias para hooks (`useTasksQuery`, `useTaskCreate`, `useTaskUpdate`, `useTaskDelete`, `useTaskBoardState`).
- Tests de integración para el flujo del modal y acciones inline (React Testing Library + MSW).
- Validaciones complementarias con Zod y pruebas de contratos (RPC Supabase).

## Despliegue

El proyecto está listo para desplegarse en **Vercel** u otra plataforma compatible con Next.js:

1. Configura las variables `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` en el panel de tu proveedor.
2. Ejecuta `pnpm build` durante el proceso de build.
3. Asegúrate de que las políticas RLS de Supabase permitan el acceso desde el frontend (JWT anónimo o políticas personalizadas).

Si deseas un despliegue autoalojado, puedes generar la build estática y servirla con `pnpm start` detrás de un proxy (Nginx, Caddy, etc.).

## Decisiones Técnicas

- **Arquitectura modular claramente acotada:** Se separan capas (dominio, servicios, UI) para facilitar pruebas y escalabilidad.
- **React Query para sincronización remota:** Maneja caché, estados de error y revalidación tras mutaciones (create/update/delete).
- **Supabase como BaaS:** Aprovecha Postgres, funciones RPC y autenticación nativa (si se requiere en el futuro).
- **Carbon Design System + Tailwind 4:** Combina componentes accesibles de IBM con utilidades modernas para estilos responsivos.
- **Búsqueda debounced en cliente:** Reduce llamadas innecesarias y mejora percepción de rendimiento.
- **Providers dedicados:** `ReactQueryProvider` y `TaskBoardProvider` encapsulan lógica compartida y evitan prop drilling.

## Limitaciones y Áreas de Mejora

- **Sin drag & drop:** La vista kanban no permite reorganizar tareas mediante arrastre.
- **Sin paginación ni carga incremental:** Todas las tareas se traen en una única consulta.
- **Validaciones básicas:** El modal solo valida campos requeridos; se podría incorporar Zod o `react-hook-form`.
- **Falta de autenticación/autorización:** Cualquier usuario con la clave anónima puede operar sobre la tabla.
- **Cobertura de pruebas pendiente:** No existen tests automatizados que aseguren regresiones mínimas.
- **Experiencia móvil mejorable:** Aunque responsive, la interacción puede optimizarse (gestos, atajos, feedback háptico).

## Licencia

Este proyecto aún no especifica una licencia formal. Antes de distribuirlo, añade un archivo `LICENSE` con los términos correspondientes (por ejemplo, MIT o Apache-2.0).
