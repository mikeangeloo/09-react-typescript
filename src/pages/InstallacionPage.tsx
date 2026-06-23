import SectionTitle from "../components/ui/SectionTitle";
import ConceptCard from "../components/ui/ConceptCard";
import CodeBlock from "../components/ui/CodeBlock";
import TypescriptPlayground from "../components/playground/TypescriptPlayground";
import PlaygroundSolucion from "../components/ui/PlaygroundSolucion";

const CODIGO_SETUP = `
# Crear un proyecto nuevo con TypeScript desde cero
npm create vite@latest mi-app -- --template react-ts

# Instalar dependencias
cd mi-app && npm install
`;

const CODIGO_TSCONFIG = `
// tsconfig.json — Configuración generada por Vite
{
  "compilerOptions": {
    // Versión de JavaScript de salida
    "target": "ES2020",

    // Incluir los tipos del DOM y ES modernos
    "lib": ["ES2020", "DOM", "DOM.Iterable"],

    // Formato de módulos para el bundler
    "module": "ESNext",
    "moduleResolution": "bundler",

    // Habilitar JSX con el nuevo transform de React 17+
    "jsx": "react-jsx",

    // Modo estricto: activa todas las verificaciones de tipos
    "strict": true,

    // Forzar la extensión .tsx para archivos con JSX
    "allowImportingTsExtensions": true,

    // No emitir archivos — Vite se encarga del bundling
    "noEmit": true
  },
  "include": ["src"]
}
`;

const CODIGO_STRICT = `
// Con "strict": true, TypeScript habilita varias reglas de seguridad:

// 1. strictNullChecks — null y undefined deben ser explícitos
let nombre: string = null; // ❌ Error: null no es string
let nombre2: string | null = null; // ✅ Correcto

// 2. noImplicitAny — no se permite 'any' implícito
function saludar(persona) { // ❌ Error: 'persona' tiene tipo 'any' implícito
  return persona.nombre;
}

function saludar2(persona: { nombre: string }) { // ✅ Correcto
  return persona.nombre;
}
`;

const CODIGO_EXTENSIONES = `
// Los archivos con JSX deben usar .tsx (no .ts)
// Los archivos TypeScript sin JSX usan .ts

// src/App.tsx     ← tiene JSX → extensión .tsx
// src/utils.ts    ← solo lógica → extensión .ts
// src/types.ts    ← solo tipos → extensión .ts
`;

const PLAYGROUND_SOLUCION = `
interface BotonProps {
  etiqueta: string;
  variante: 'primario' | 'peligro';
  onClick?: () => void;
}

function Boton({ etiqueta, variante, onClick }: BotonProps) {
  return (
    <button
      style={{ background: variante === 'peligro' ? 'red' : 'blue' }}
      onClick={onClick}
    >
      {etiqueta}
    </button>
  );
}

const example = <Boton etiqueta="Guardar" variante="primario" />;
`;

const PLAYGROUND_INICIAL = `// Ejercicio: corrige los errores de TypeScript en este componente React
// Pista: "strict": true activa strictNullChecks y prohíbe 'any' implícito

interface BotonProps {
  etiqueta: string;
  variante: 'primario' | 'peligro';
}

// Error 1: los parámetros no tienen tipo — úsalos con la interface correcta
function Boton({ etiqueta, variante, onClick }) {
  return (
    <button
      style={{ background: variante === 'peligro' ? 'red' : 'blue' }}
      onClick={onClick}
    >
      {etiqueta}
    </button>
  );
}

// Error 2: falta la prop requerida 'variante'
const example = <Boton etiqueta="Guardar" />;
`;

export default function InstallacionPage() {
  return (
    <>
      {/* Encabezado del módulo */}
      <header style={{ marginBottom: "48px" }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            fontWeight: 600,
            letterSpacing: "2px",
            color: "var(--accent)",
            marginBottom: "16px",
          }}
        >
          MÓDULO 1
        </div>
        <h1
          style={{
            fontSize: "48px",
            fontWeight: 700,
            color: "var(--text-primary)",
            margin: "0 0 14px",
            letterSpacing: "-1.5px",
            lineHeight: 1,
          }}
        >
          Instalación
        </h1>
        <p
          style={{
            fontSize: "17px",
            color: "var(--text-muted)",
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          Agregar TypeScript a un proyecto React con Vite
        </p>
      </header>

      {/* 01 — CONCEPTO */}
      <section style={{ marginBottom: "44px" }}>
        <SectionTitle numero="01" etiqueta="CONCEPTO" />
        <p className="page-body" style={{ margin: 0 }}>
          TypeScript agrega{" "}
          <strong style={{ color: "var(--text-secondary)", fontWeight: 600 }}>
            definiciones de tipos estáticos
          </strong>{" "}
          a JavaScript. Esto permite al compilador detectar errores antes de
          ejecutar el código y mejora el autocompletado en el editor. Con Vite,
          la plantilla <code>react-ts</code> genera todo lo necesario para
          comenzar a trabajar de inmediato.
        </p>
      </section>

      {/* 02 — SETUP CON VITE */}
      <section style={{ marginBottom: "44px" }}>
        <SectionTitle numero="02" etiqueta="SETUP CON VITE" />
        <CodeBlock codigo={CODIGO_SETUP} lenguaje="bash" archivo="terminal" />
        <ConceptCard tipo="nota">
          La plantilla <code>react-ts</code> ya incluye{" "}
          <code>@types/react</code> y <code>@types/react-dom</code>, que son los
          tipos de React para TypeScript. No necesitas instalarlos por separado.
        </ConceptCard>
      </section>

      {/* 03 — TSCONFIG.JSON */}
      <section style={{ marginBottom: "44px" }}>
        <SectionTitle numero="03" etiqueta="TSCONFIG.JSON" />
        <p className="page-body" style={{ marginBottom: "16px" }}>
          El archivo <code>tsconfig.json</code> es la configuración del
          compilador de TypeScript. Vite genera una configuración sensible que
          puedes usar sin cambios.
        </p>
        <CodeBlock
          codigo={CODIGO_TSCONFIG}
          lenguaje="json"
          archivo="tsconfig.json"
        />
      </section>

      {/* 04 — MODO ESTRICTO */}
      <section style={{ marginBottom: "44px" }}>
        <SectionTitle numero="04" etiqueta="MODO ESTRICTO" />
        <p className="page-body" style={{ marginBottom: "16px" }}>
          La opción <code>"strict": true</code> es la más importante del{" "}
          <code>tsconfig.json</code>. Activa un conjunto de verificaciones que
          hacen que TypeScript detecte más errores potenciales.
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
          <ConceptCard tipo="error">
            Sin <code>strict</code>, TypeScript es más permisivo y puede dejar
            pasar errores que aparecerán en tiempo de ejecución.
          </ConceptCard>
          <ConceptCard tipo="exito">
            Con <code>"strict": true</code>, TypeScript verifica que{" "}
            <code>null</code> se use solo donde es explícitamente permitido y
            prohíbe variables sin tipo.
          </ConceptCard>
        </div>
        <CodeBlock codigo={CODIGO_STRICT} archivo="ejemplo-strict.ts" />
      </section>

      {/* 05 — EXTENSIONES DE ARCHIVO */}
      <section style={{ marginBottom: "44px" }}>
        <SectionTitle numero="05" etiqueta="EXTENSIONES DE ARCHIVO" />
        <CodeBlock codigo={CODIGO_EXTENSIONES} archivo="estructura.ts" />
      </section>

      {/* 06 — PLAYGROUND */}
      <section>
        <SectionTitle numero="06" etiqueta="PLAYGROUND" />
        <p className="page-body" style={{ marginBottom: "16px" }}>
          Corrige los tres errores de TypeScript que aparecen en el panel
          inferior. Haz clic en el código y edítalo directamente.
        </p>
        <TypescriptPlayground
          codigoInicial={PLAYGROUND_INICIAL}
          archivo="ejercicio-01.tsx"
          altura={520}
        />
        <PlaygroundSolucion
          codigo={PLAYGROUND_SOLUCION}
          archivo="solucion-01.tsx"
        />
      </section>
    </>
  );
}
