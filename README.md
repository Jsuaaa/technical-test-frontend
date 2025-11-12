# Framecore Task Board

**Framecore Task Board** es una aplicación construida con Next.js 16 y TypeScript que centraliza la gestión de tareas sobre una base de datos de Supabase. El tablero ofrece visualización kanban y tabular, métricas en tiempo real, búsqueda debounced y acciones inline para crear, actualizar o eliminar tareas sin abandonar la vista principal.

## Demo

La aplicación se encuentra hosteada en Vercel, pueden acceder a una demo desde
[technical-test-frontend-ten.vercel.app](technical-test-frontend-ten.vercel.app)

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

- Alternar entre una vista kanban y una vista lista para organizar tareas según el estado o un listado tabular responsive que se adapta a escritorio y mobile.
- Crear nuevas tareas mediante un modal con validaciones de campos obligatorios y valores por defecto de estado/prioridad.
- Actualizar título, descripción, estado y prioridad desde un modal o mediante un menú contextual con controles inline.
- Eliminar tareas con confirmación y retroalimentación inmediata tras la mutación.
- Consultar métricas agregadas por estado alimentadas por una función RPC de Supabase.
- Filtrar tareas por ID, título o descripción empleando una búsqueda con debounce de 400 ms que evita consultas innecesarias.

## Características

- **Vistas intercambiables:** Un toggle permite mantener filtros y contexto al pasar de tablero a lista.
- **Búsqueda inteligente:** `SearchBar` normaliza el término y sincroniza el resultado con Supabase usando React Query.
- **Edición contextual:** `TaskActionsDropdown` habilita cambios inline de estado/prioridad y apertura rápida del modal de edición.
- **Métricas en tiempo real:** `StatusTasks` consume el RPC `get_tasks_status_count` para mostrar totales por columna.
- **Gestión completa de tareas:** Hook personalizados (`useTaskCreate`, `useTaskUpdate`, `useTaskDelete`) invalidan cachés y sincronizan UI tras cada mutación.
- **Diseño accesible:** Componentes de Carbon Design System combinados con utilidades de Tailwind CSS 4 y tipografías Geist.

## Tecnologías Utilizadas

- **Next.js 16** (App Router) con **React 19** y **TypeScript**
- **@tanstack/react-query 5** para data fetching, caché y sincronización de estado remoto
- **Supabase** (`@supabase/supabase-js`) como backend de datos y funciones RPC
- **Carbon Design System** (`@carbon/react`, `@carbon/styles`) para componentes UI accesibles
- **Tailwind CSS 4** para utilidades de estilo
- **Lucide React** para iconografía
- **Jest 30** + **React Testing Library** para pruebas unitarias
- **Husky** para configurar scripts de pre-commit para asegurar la integridad del proyecto a la hora de subir a producción

## Estructura del Proyecto

La organización sigue un enfoque modular que separa dominio, servicios, providers y presentación:

```
└── src
    ├── app/
    │   ├── layout.tsx              # Root layout con React Query Provider y estilos globales
    │   └── page.tsx                # Entrada principal con el TaskBoard
    └── core/
        ├── common/                 # Componentes compartidos (botones, modales, dropdowns, selects)
        ├── components/
        │   └── home/
        │       └── taskBoard/
        │           ├── TaskBoard.tsx
        │           ├── board/
        │           │   ├── BoardView.tsx
        │           │   └── __tests__/BoardView.test.tsx
        │           ├── list/
        │           │   ├── ListView.tsx
        │           │   └── __tests__/ListView.test.tsx
        │           └── tasksCounts/
        │               ├── StatusTasks.tsx
        │               ├── StatusTaskCard.tsx
        │               └── __tests__/StatusTasks.test.tsx
        ├── data/                   # Constantes y mapeos de dominio ↔ UI
        ├── domain/                 # Tipos de negocio (Task, enums, contratos)
        ├── hooks/                  # Hooks de React Query y utilidades (debounce, fetch, mutaciones)
        │   └── __tests__/          # Pruebas unitarias de hooks (React Query, debounce)
        ├── layouts/                # Layouts compartidos de la aplicación
        ├── providers/              # Contextos (TaskBoard) y proveedor de React Query
        ├── services/               # Integración con Supabase (CRUD y RPC)
        ├── styles/                 # Estilos globales
        └── utils/                  # Helpers de formato y cliente de Supabase
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

3. **Configura las variables de entorno** creando un archivo `.env.local` en la raíz:

   ```
   NEXT_PUBLIC_SUPABASE_URL=<tu-url-de-supabase>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<tu-anon-key>
   ```

4. **Prepara tu base de datos Supabase:**

   - Crea la tabla `tasks`:

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

   - Implementa la función RPC `get_tasks_status_count` consumida por el tablero:

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

   Ajusta las políticas RLS para permitir las operaciones necesarias desde el cliente.

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

Para previsualizar la build local:

```bash
pnpm start
```

### Linter

```bash
pnpm lint
```

### Ejecución de Tests

```bash
pnpm test
```

Las suites actuales cubren los hooks de React Query (`useTaskCreate`, `useTaskUpdate`, `useTaskDelete`, `useTasksQuery`, `useTasksCountByStatusQuery`, `useTaskFetch`), el hook utilitario `useDebounce` y componentes clave del tablero (`BoardView`, `ListView`, `StatusTasks`), garantizando el flujo principal de lectura y mutación de tareas.

## Despliegue

El proyecto está listo para desplegarse en **Vercel** u otra plataforma compatible con Next.js:

1. Define `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` en el panel de variables de entorno.
2. Ejecuta `pnpm build` durante el paso de build.
3. Verifica que las políticas RLS de Supabase permitan el acceso requerido (lectura/escritura sobre `tasks` y uso del RPC).

Para un despliegue autoalojado, genera la build y sirve la aplicación con `pnpm start` detrás de tu servidor preferido (Nginx, Caddy, etc.).

## Decisiones Técnicas

- **Arquitectura modular:** Separación explícita entre dominio, UI, servicios y providers para facilitar escalabilidad. Se consideró usar una arquitectura hexagonal simplificada por features, pero se optó por una estructura modular más directa, alineada con el alcance y la simplicidad del proyecto.
- **React Query como capa de datos:** Gestiona caché, estados transitorios y revalidación tras operaciones CRUD.
- **Supabase como BaaS:** Uso de Postgres, funciones RPC y cliente JS oficial (`@supabase/supabase-js`).
- **Búsqueda normalizada y debounced:** `useTasksQuery` limpia el término y `useDebounce` evita saturar la API.
- **UI híbrida Carbon + Tailwind:** Carbon aporta accesibilidad y consistencia; Tailwind permite ajustes finos rápidos.
- **Contexto especializado (`TaskBoardProvider`):** Expone estado compartido de tareas, métricas y mutaciones a toda la UI.

## Limitaciones y Áreas de Mejora

- **Sin drag & drop:** La vista kanban no admite reorganización mediante arrastre, podría ser una buena implementación para mejorar la experiencia de usuario.
- **Sin paginación ni carga incremental:** Todas las tareas se consultan en bloque; podría añadirse paginado o infinite scroll.
- **Validaciones sencillas:** Se validan los campos del formulario de creación/edición usando un modal, pero hubiese sido mejor práctica integrar Zod o `react-hook-form` para hacer validaciones más organizadas y robustas.
- **Cobertura de pruebas ampliable:** Existen tests unitarios clave, pero faltan escenarios end-to-end y pruebas sobre servicios reales.
- **Optimización móvil:** La vista lista es responsive, aunque se pueden mejorar gestos y atajos en dispositivos táctiles.

## Licencia

Este proyecto está bajo la [MIT License](LICENSE).
