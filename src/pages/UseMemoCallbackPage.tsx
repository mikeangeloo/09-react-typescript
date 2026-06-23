import SectionTitle from "../components/ui/SectionTitle";
import ConceptCard from "../components/ui/ConceptCard";
import CodeBlock from "../components/ui/CodeBlock";
import TypescriptPlayground from "../components/playground/TypescriptPlayground";
import PlaygroundSolucion from "../components/ui/PlaygroundSolucion";

const CODIGO_USEMEMO = `
import { useMemo } from 'react';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
}

function ListaProductos({ productos }: { productos: Producto[] }) {
  // TypeScript infiere el tipo de retorno automáticamente
  // total: number (inferido desde la operación de suma)
  const total = useMemo(
    () => productos.reduce((acc, p) => acc + p.precio, 0),
    [productos]
  );

  // productosCostosos: Producto[] (inferido desde .filter())
  const productosCostosos = useMemo(
    () => productos.filter(p => p.precio > 100),
    [productos]
  );

  return (
    <div>
      <p>Total: \${total}</p>
      <p>Productos caros: {productosCostosos.length}</p>
    </div>
  );
}
`;

const CODIGO_USECALLBACK = `
import { useCallback, useState } from 'react';

function Buscador() {
  const [termino, setTermino] = useState('');
  const [resultados, setResultados] = useState<string[]>([]);

  // useCallback también infiere el tipo desde la función
  // TypeScript sabe que 'evento' es React.ChangeEvent<HTMLInputElement>
  const handleChange = useCallback(
    (evento: React.ChangeEvent<HTMLInputElement>) => {
      setTermino(evento.target.value);
    },
    []
  );

  // Función async — TypeScript infiere Promise<void>
  const buscar = useCallback(async () => {
    const datos = await fetch('/api/buscar?q=' + termino);
    const json = await datos.json();
    setResultados(json);
  }, [termino]);

  return (
    <div>
      <input onChange={handleChange} value={termino} />
      <button onClick={buscar}>Buscar</button>
      <ul>{resultados.map(r => <li key={r}>{r}</li>)}</ul>
    </div>
  );
}
`;

const CODIGO_HANDLER_TYPE = `
import { useCallback } from 'react';

// React.ChangeEventHandler<T> es un alias de:
// (evento: React.ChangeEvent<T>) => void

// Forma 1: tipo en el parámetro
const handleInput = useCallback(
  (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  },
  []
);

// Forma 2: tipo en el callback completo (equivalente)
const handleSelect = useCallback<React.ChangeEventHandler<HTMLSelectElement>>(
  (e) => {
    console.log(e.target.value); // TypeScript sabe que e.target es HTMLSelectElement
  },
  []
);

// Para eventos de ratón:
const handleClick = useCallback<React.MouseEventHandler<HTMLButtonElement>>(
  (e) => {
    console.log(e.currentTarget.textContent);
  },
  []
);
`;

const CODIGO_FORMULARIO = `
import { useCallback, useMemo, useState } from 'react';

interface CampoFormulario {
  valor: string;
  tocado: boolean;
  error: string | null;
}

type EstadoFormulario = Record<string, CampoFormulario>;

function useFormulario(camposIniciales: Record<string, string>) {
  const [campos, setCampos] = useState<EstadoFormulario>(() =>
    Object.fromEntries(
      Object.entries(camposIniciales).map(([key, val]) => [
        key,
        { valor: val, tocado: false, error: null },
      ])
    )
  );

  // TypeScript infiere: boolean
  const esValido = useMemo(
    () => Object.values(campos).every(c => c.error === null),
    [campos]
  );

  // TypeScript infiere el tipo del evento desde HTMLInputElement
  const handleChange = useCallback(
    (campo: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setCampos(prev => ({
        ...prev,
        [campo]: { ...prev[campo], valor: e.target.value, tocado: true },
      }));
    },
    []
  );

  return { campos, esValido, handleChange };
}
`;

const PLAYGROUND_SOLUCION = `
function Formulario() {
  const [nombre, setNombre] = React.useState('');
  const [edad, setEdad] = React.useState(0);

  const handleNombre = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNombre(e.target.value);
  }, []);

  const handleSubmit = React.useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ nombre, edad });
  }, [nombre, edad]);

  // TypeScript infiere 'string' automáticamente
  const resumen = React.useMemo(
    () => \`\${nombre} tiene \${edad} años\`,
    [nombre, edad]
  );

  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleNombre} value={nombre} />
      <p>{resumen}</p>
    </form>
  );
}
`;

const PLAYGROUND_INICIAL = `
// Ejercicio: agrega los tipos correctos a los event handlers del componente

function Formulario() {
  const [nombre, setNombre] = React.useState('');
  const [edad, setEdad] = React.useState(0);

  // Error: 'e' tiene tipo 'any' implícito — agrega React.ChangeEvent<HTMLInputElement>
  const handleNombre = React.useCallback((e) => {
    setNombre(e.target.value);
  }, []);

  // Error: 'e' tiene tipo 'any' implícito — agrega el tipo de evento de formulario
  const handleSubmit = React.useCallback((e) => {
    e.preventDefault();
    console.log({ nombre, edad });
  }, [nombre, edad]);

  // useMemo: TypeScript infiere el tipo de retorno automáticamente
  // ¿Qué tipo infiere 'resumen'?
  const resumen = React.useMemo(
    () => \`\${nombre} tiene \${edad} años\`,
    [nombre, edad]
  );

  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleNombre} value={nombre} />
      <p>{resumen}</p>
    </form>
  );
}
`;

export default function UseMemoCallbackPage() {
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
          MÓDULO 6
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
          useMemo / useCallback
        </h1>
        <p
          style={{
            fontSize: "17px",
            color: "var(--text-muted)",
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          Tipos inferidos y event handlers tipados
        </p>
      </header>

      {/* 01 — CONCEPTO */}
      <section style={{ marginBottom: "44px" }}>
        <SectionTitle numero="01" etiqueta="CONCEPTO" />
        <p className="page-body" style={{ margin: 0 }}>
          <code>useMemo</code> y <code>useCallback</code> infieren sus tipos
          automáticamente desde la función que reciben. Rara vez necesitas
          anotar el tipo de retorno o el tipo del callback explícitamente. La
          excepción son los{" "}
          <strong style={{ color: "var(--text-secondary)", fontWeight: 600 }}>
            event handlers
          </strong>
          , donde TypeScript no puede inferir el tipo del evento sin información
          adicional.
        </p>
      </section>

      {/* 02 — USEMEMO */}
      <section style={{ marginBottom: "44px" }}>
        <SectionTitle numero="02" etiqueta="USEMEMO" />
        <p className="page-body" style={{ marginBottom: "16px" }}>
          El tipo del valor memoizado se infiere del tipo de retorno de la
          función que recibe <code>useMemo</code>.
        </p>
        <CodeBlock codigo={CODIGO_USEMEMO} archivo="ListaProductos.tsx" />
        <ConceptCard tipo="nota">
          React Compiler (experimental) puede eliminar la necesidad de{" "}
          <code>useMemo</code> y <code>useCallback</code> en muchos casos, pero
          entender su tipado sigue siendo relevante para proyectos sin el
          compiler.
        </ConceptCard>
      </section>

      {/* 03 — USECALLBACK */}
      <section style={{ marginBottom: "44px" }}>
        <SectionTitle numero="03" etiqueta="USECALLBACK" />
        <p className="page-body" style={{ marginBottom: "16px" }}>
          <code>useCallback</code> también infiere el tipo. Cuando el parámetro
          es un evento del DOM, debes anotarlo explícitamente.
        </p>
        <CodeBlock codigo={CODIGO_USECALLBACK} archivo="Buscador.tsx" />
      </section>

      {/* 04 — EVENT HANDLER TYPES */}
      <section style={{ marginBottom: "44px" }}>
        <SectionTitle numero="04" etiqueta="EVENT HANDLER TYPES" />
        <p className="page-body" style={{ marginBottom: "16px" }}>
          React exporta tipos de conveniencia para event handlers. El genérico{" "}
          <code>&lt;T&gt;</code> es el elemento HTML que origina el evento.
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
            Sin tipo en el parámetro <code>e</code>, TypeScript infiere{" "}
            <code>any</code> o da un error de "implicitly has any type". Pierdes
            el tipado del evento.
          </ConceptCard>
          <ConceptCard tipo="exito">
            Con <code>React.ChangeEvent&lt;HTMLInputElement&gt;</code>,
            TypeScript conoce todos los campos del evento:{" "}
            <code>e.target.value</code>, <code>e.target.checked</code>,{" "}
            <code>e.currentTarget</code>, etc.
          </ConceptCard>
        </div>
        <CodeBlock codigo={CODIGO_HANDLER_TYPE} archivo="handlers.tsx" />
      </section>

      {/* 05 — EJEMPLO AVANZADO */}
      <section style={{ marginBottom: "44px" }}>
        <SectionTitle numero="05" etiqueta="EJEMPLO: HOOK DE FORMULARIO" />
        <p className="page-body" style={{ marginBottom: "16px" }}>
          Un custom hook que combina <code>useState</code>, <code>useMemo</code>{" "}
          y <code>useCallback</code> con tipos completamente inferidos.
        </p>
        <CodeBlock codigo={CODIGO_FORMULARIO} archivo="useFormulario.ts" />
      </section>

      {/* 06 — PLAYGROUND */}
      <section>
        <SectionTitle numero="06" etiqueta="PLAYGROUND" />
        <p className="page-body" style={{ marginBottom: "16px" }}>
          Agrega los tipos correctos a los event handlers. Pista: usa{" "}
          <code>React.ChangeEvent</code> y <code>React.FormEvent</code> con los
          elementos HTML correspondientes.
        </p>
        <TypescriptPlayground
          codigoInicial={PLAYGROUND_INICIAL}
          archivo="ejercicio-06.tsx"
          altura={520}
        />
        <PlaygroundSolucion
          codigo={PLAYGROUND_SOLUCION}
          archivo="solucion-06.tsx"
        />
      </section>
    </>
  );
}
