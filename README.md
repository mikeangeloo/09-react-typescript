# React + TypeScript — Guía interactiva

Aplicación educativa tipo curso que explica React con TypeScript mediante módulos con ejemplos de código y playgrounds interactivos basados en Monaco Editor.

## Stack

- **React 19** + **TypeScript 6** via Vite (`react-ts` template)
- **React Router v7** con `createHashRouter` (hash routing para compatibilidad con `file://`)
- **Monaco Editor** (`@monaco-editor/react`) para los playgrounds interactivos
- **react-syntax-highlighter** con tema `vscDarkPlus` para bloques de código estáticos
- **SCSS** con tokens de diseño en `src/styles/_variables.scss`
- **Bootstrap 5** (solo grid/utilidades, estilos visuales sobreescritos)

## Estructura

```
src/
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx        # Shell con sidebar + área de contenido
│   │   └── Sidebar.tsx          # Navegación lateral con módulos
│   ├── playground/
│   │   ├── TypescriptPlayground.tsx  # Editor Monaco con validación TS en tiempo real
│   │   └── _playground.scss
│   └── ui/
│       ├── CodeBlock.tsx         # Bloque de código estático con syntax highlight
│       ├── ConceptCard.tsx       # Tarjeta de concepto (error / éxito / nota)
│       ├── PlaygroundSolucion.tsx # Colapsable <details> con la solución del ejercicio
│       └── SectionTitle.tsx      # Título de sección numerado
├── pages/
│   ├── InstallacionPage.tsx      # Módulo 1
│   ├── ComponentesPage.tsx       # Módulo 2
│   ├── UseStatePage.tsx          # Módulo 3
│   ├── UseReducerPage.tsx        # Módulo 4
│   ├── UseContextPage.tsx        # Módulo 5
│   ├── UseMemoCallbackPage.tsx   # Módulo 6
│   └── TiposUtilesPage.tsx       # Módulo 7
├── router/index.tsx
└── styles/
    ├── main.scss
    ├── _variables.scss           # Tokens CSS (colores, fuentes)
    ├── _cards.scss
    └── _sidebar.scss
```

## Comandos

```bash
npm run dev      # servidor de desarrollo
npm run build    # build de producción (tsc + vite)
npm run preview  # previsualizar el build
```

## Patrón de páginas

Cada página sigue la misma estructura:

1. **Constantes de código** (`CODIGO_*`) — snippets de ejemplo, strings de template literal
2. **`PLAYGROUND_INICIAL`** — código con errores intencionales para que el alumno corrija
3. **`PLAYGROUND_SOLUCION`** — código corregido, mostrado en un `<PlaygroundSolucion>` colapsable
4. **JSX de la página** — secciones numeradas con `<SectionTitle>`, `<CodeBlock>`, `<ConceptCard>` y al final `<TypescriptPlayground>` + `<PlaygroundSolucion>`

## TypescriptPlayground

El playground inyecta declaraciones de tipos de React directamente en el worker de Monaco (`REACT_TYPE_DEFS` en `TypescriptPlayground.tsx`). Esto permite usar JSX y los tipos de React en los ejercicios sin `import`. Los errores de tipo aparecen en tiempo real en el panel inferior del editor.

## Convenciones

- Las constantes de código son strings de template literal definidas fuera del componente.
- Los archivos con JSX usan `.tsx`; la lógica pura usa `.ts`.
- Los estilos usan variables CSS (`var(--accent)`, `var(--bg-card)`, etc.) definidas en `_variables.scss`.
- Sin tests unitarios — la verificación es visual/interactiva.
