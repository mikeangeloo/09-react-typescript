import SectionTitle from "../components/ui/SectionTitle";
import ConceptCard from "../components/ui/ConceptCard";
import CodeBlock from "../components/ui/CodeBlock";
import TypescriptPlayground from "../components/playground/TypescriptPlayground";
import PlaygroundSolucion from "../components/ui/PlaygroundSolucion";

const CODIGO_CONTEXTO_SIMPLE = `
import { createContext, useContext } from 'react';

// createContext infiere el tipo desde el valor por defecto
type Tema = 'claro' | 'oscuro' | 'sistema';

const ContextoTema = createContext<Tema>('sistema');

// En un componente hijo:
function BotonTema() {
  const tema = useContext(ContextoTema); // tipo: Tema
  return <button>Tema actual: {tema}</button>;
}
`;

const CODIGO_NULL_PROBLEMA = `
import { createContext, useContext } from 'react';

interface DatosUsuario {
  nombre: string;
  email: string;
}

// ❌ Problema: createContext(null) hace que el tipo sea null siempre
const ContextoUsuario = createContext(null);

function Perfil() {
  const usuario = useContext(ContextoUsuario); // tipo: null 😱
  // TypeScript se queja porque 'usuario' siempre es null
  return <div>{usuario.nombre}</div>; // ❌ Error
}
`;

const CODIGO_NULL_SOLUCION = `
import { createContext, useContext } from 'react';

interface DatosUsuario {
  nombre: string;
  email: string;
}

// ✅ Solución: declarar el genérico explícitamente
const ContextoUsuario = createContext<DatosUsuario | null>(null);

function Perfil() {
  const usuario = useContext(ContextoUsuario); // tipo: DatosUsuario | null

  // TypeScript obliga a verificar null antes de usar el valor
  if (!usuario) return <div>No hay sesión activa</div>;

  return <div>{usuario.nombre}</div>; // ✅ Aquí TypeScript sabe que no es null
}
`;

const CODIGO_CUSTOM_HOOK = `
import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface DatosAuth {
  usuario: string | null;
  iniciarSesion: (nombre: string) => void;
  cerrarSesion: () => void;
}

// Contexto con valor null por defecto (antes de montar el Provider)
const ContextoAuth = createContext<DatosAuth | null>(null);

// Custom hook con verificación en runtime — evita usar el contexto fuera del Provider
export function useAuth(): DatosAuth {
  const contexto = useContext(ContextoAuth);
  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  }
  return contexto;
}

// Provider que encapsula la lógica
export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<string | null>(null);

  const iniciarSesion = (nombre: string) => setUsuario(nombre);
  const cerrarSesion = () => setUsuario(null);

  return (
    <ContextoAuth.Provider value={{ usuario, iniciarSesion, cerrarSesion }}>
      {children}
    </ContextoAuth.Provider>
  );
}
`;

const CODIGO_PROVIDER_USO = `
// En App.tsx o el punto de entrada de tu app:
function App() {
  return (
    <AuthProvider>
      <Navegacion />
      <Perfil />
    </AuthProvider>
  );
}

// En cualquier componente hijo:
function Navegacion() {
  const { usuario, cerrarSesion } = useAuth(); // ✅ Tipos completamente inferidos

  if (!usuario) return <a href="/login">Iniciar sesión</a>;

  return (
    <nav>
      <span>Hola, {usuario}</span>
      <button onClick={cerrarSesion}>Salir</button>
    </nav>
  );
}
`;

const PLAYGROUND_SOLUCION = `
type Tema = 'claro' | 'oscuro';

interface ContextoTemaValor {
  tema: Tema;
  cambiarTema: () => void;
}

const ContextoTema = React.createContext<ContextoTemaValor | null>(null);

function useTema(): ContextoTemaValor {
  const ctx = React.useContext(ContextoTema);
  if (!ctx) throw new Error('useTema debe usarse dentro de <TemaProvider>');
  return ctx;
}

function BotonTema() {
  const { tema, cambiarTema } = useTema();
  return (
    <button onClick={cambiarTema}>
      Tema actual: {tema}
    </button>
  );
}
`;

const PLAYGROUND_INICIAL = `
// Ejercicio: implementa un contexto tipado de tema (claro/oscuro)

type Tema = 'claro' | 'oscuro';

interface ContextoTemaValor {
  tema: Tema;
  cambiarTema: () => void;
}

// Error: createContext(null) infiere 'null' — agrega el genérico correcto
const ContextoTema = React.createContext(null);

// Custom hook que protege contra uso fuera del Provider
function useTema(): ContextoTemaValor {
  const ctx = React.useContext(ContextoTema);
  if (!ctx) throw new Error('useTema debe usarse dentro de <TemaProvider>');
  return ctx;
}

// Componente que usa el contexto
function BotonTema() {
  const { tema, cambiarTema } = useTema();
  return (
    <button onClick={cambiarTema}>
      Tema actual: {tema}
    </button>
  );
}
`;

export default function UseContextPage() {
  return (
    <>
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
          MÓDULO 5
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
          useContext
        </h1>
        <p
          style={{
            fontSize: "17px",
            color: "var(--text-muted)",
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          Contexto tipado y patrón null safety
        </p>
      </header>

      {/* 01 — CONCEPTO */}
      <section style={{ marginBottom: "44px" }}>
        <SectionTitle numero="01" etiqueta="CONCEPTO" />
        <p className="page-body" style={{ margin: 0 }}>
          <code>useContext</code> infiere el tipo automáticamente desde el tipo
          del contexto creado con <code>createContext</code>. El reto es decidir
          qué valor usar al crear el contexto: si usas <code>null</code>,
          TypeScript fuerza a verificar <code>null</code> antes de usar el
          valor, lo que es más seguro.
        </p>
      </section>

      {/* 02 — CONTEXTO SIMPLE */}
      <section style={{ marginBottom: "44px" }}>
        <SectionTitle numero="02" etiqueta="CONTEXTO SIMPLE" />
        <p className="page-body" style={{ marginBottom: "16px" }}>
          Cuando el contexto tiene un valor por defecto sensato (siempre
          disponible), puedes crearlo directamente con ese valor y TypeScript
          infiere el tipo.
        </p>
        <CodeBlock codigo={CODIGO_CONTEXTO_SIMPLE} archivo="ContextoTema.tsx" />
      </section>

      {/* 03 — EL PROBLEMA DE NULL */}
      <section style={{ marginBottom: "44px" }}>
        <SectionTitle numero="03" etiqueta="EL PROBLEMA DE NULL" />
        <p className="page-body" style={{ marginBottom: "16px" }}>
          Muchos contextos no tienen un valor "vacío" que sea lógico. La
          tentación es pasar <code>null</code> como valor inicial, pero sin el
          genérico explícito esto causa un tipo incorrecto.
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
            <code>createContext(null)</code> infiere el tipo <code>null</code>,
            haciendo que el contexto siempre sea <code>null</code> para
            TypeScript aunque el Provider pase un valor real.
          </ConceptCard>
          <ConceptCard tipo="exito">
            <code>createContext&lt;DatosUsuario | null&gt;(null)</code> informa
            a TypeScript que el contexto puede ser <code>DatosUsuario</code> o{" "}
            <code>null</code>, y obliga a hacer la verificación.
          </ConceptCard>
        </div>
        <CodeBlock codigo={CODIGO_NULL_PROBLEMA} archivo="❌ problema.tsx" />
        <CodeBlock codigo={CODIGO_NULL_SOLUCION} archivo="✅ solucion.tsx" />
      </section>

      {/* 04 — CUSTOM HOOK */}
      <section style={{ marginBottom: "44px" }}>
        <SectionTitle numero="04" etiqueta="PATRÓN CUSTOM HOOK" />
        <p className="page-body" style={{ marginBottom: "16px" }}>
          El patrón más robusto: un custom hook que encapsula el contexto,
          verifica que no sea <code>null</code> en runtime y devuelve un tipo
          no-nullable. Así los componentes hijos nunca tienen que verificar{" "}
          <code>null</code>.
        </p>
        <CodeBlock codigo={CODIGO_CUSTOM_HOOK} archivo="auth-context.tsx" />
        <CodeBlock codigo={CODIGO_PROVIDER_USO} archivo="uso.tsx" />
        <ConceptCard tipo="nota">
          El error que lanza <code>useAuth</code> cuando se usa fuera del
          Provider es deliberado: es mucho mejor fallar rápido con un mensaje
          claro que tener un bug silencioso en producción.
        </ConceptCard>
      </section>

      {/* 05 — PLAYGROUND */}
      <section>
        <SectionTitle numero="05" etiqueta="PLAYGROUND" />
        <p className="page-body" style={{ marginBottom: "16px" }}>
          Implementa el contexto de preferencias siguiendo el patrón del custom
          hook con null safety.
        </p>
        <TypescriptPlayground
          codigoInicial={PLAYGROUND_INICIAL}
          archivo="ejercicio-05.tsx"
          altura={520}
        />
        <PlaygroundSolucion
          codigo={PLAYGROUND_SOLUCION}
          archivo="solucion-05.tsx"
        />
      </section>
    </>
  );
}
