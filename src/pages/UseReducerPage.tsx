import SectionTitle from "../components/ui/SectionTitle";
import ConceptCard from "../components/ui/ConceptCard";
import CodeBlock from "../components/ui/CodeBlock";
import TypescriptPlayground from "../components/playground/TypescriptPlayground";
import PlaygroundSolucion from "../components/ui/PlaygroundSolucion";

const CODIGO_ESTADO = `
// Primero define el tipo del estado
interface EstadoContador {
  conteo: number;
  paso: number;
}

const estadoInicial: EstadoContador = {
  conteo: 0,
  paso: 1,
};
`;

const CODIGO_ACCIONES = `
// Discriminated union para las acciones
// La propiedad 'tipo' actúa como discriminador
type AccionContador =
  | { tipo: 'incrementar' }
  | { tipo: 'decrementar' }
  | { tipo: 'reiniciar' }
  | { tipo: 'cambiarPaso'; valor: number };

// ✅ TypeScript sabe que solo 'cambiarPaso' tiene la propiedad 'valor'
// Las demás acciones no pueden llevar datos adicionales
`;

const CODIGO_REDUCER = `
interface EstadoContador { conteo: number; paso: number; }
type AccionContador =
  | { tipo: 'incrementar' }
  | { tipo: 'decrementar' }
  | { tipo: 'reiniciar' }
  | { tipo: 'cambiarPaso'; valor: number };

// El reducer recibe el estado y una acción, y devuelve el nuevo estado
function reducerContador(
  estado: EstadoContador,
  accion: AccionContador
): EstadoContador {
  switch (accion.tipo) {
    case 'incrementar':
      return { ...estado, conteo: estado.conteo + estado.paso };

    case 'decrementar':
      return { ...estado, conteo: estado.conteo - estado.paso };

    case 'reiniciar':
      return { ...estado, conteo: 0 };

    case 'cambiarPaso':
      // TypeScript sabe que aquí 'accion.valor' existe (tipo: number)
      return { ...estado, paso: accion.valor };

    default:
      // Verificación exhaustiva: TypeScript marca error si falta un caso
      return estado;
  }
}
`;

const CODIGO_USO = `
import { useReducer } from 'react';

// TypeScript infiere el tipo del dispatch y el estado automáticamente
const [estado, dispatch] = useReducer(reducerContador, { conteo: 0, paso: 1 });

// El dispatch solo acepta acciones del tipo AccionContador
dispatch({ tipo: 'incrementar' });           // ✅
dispatch({ tipo: 'cambiarPaso', valor: 5 }); // ✅
dispatch({ tipo: 'duplicar' });               // ❌ Error: no existe ese tipo
dispatch({ tipo: 'cambiarPaso' });            // ❌ Error: falta 'valor'
`;

const PLAYGROUND_SOLUCION = `
interface EstadoContador {
  conteo: number;
  paso: number;
}

type AccionContador =
  | { tipo: 'incrementar' }
  | { tipo: 'decrementar' }
  | { tipo: 'cambiarPaso'; valor: number };

function reducer(estado: EstadoContador, accion: AccionContador): EstadoContador {
  switch (accion.tipo) {
    case 'incrementar':
      return { ...estado, conteo: estado.conteo + estado.paso };
    case 'decrementar':
      return { ...estado, conteo: estado.conteo - estado.paso };
    case 'cambiarPaso':
      return { ...estado, paso: accion.valor };
    default:
      return estado;
  }
}

function Contador() {
  const [estado, dispatch] = React.useReducer(reducer, { conteo: 0, paso: 1 });

  return (
    <div>
      <p>Conteo: {estado.conteo} (paso: {estado.paso})</p>
      <button onClick={() => dispatch({ tipo: 'incrementar' })}>+</button>
      <button onClick={() => dispatch({ tipo: 'decrementar' })}>-</button>
      {/* 'duplicar' no existe → TypeScript marca error */}
      <button onClick={() => dispatch({ tipo: 'duplicar' })}>×2</button>
    </div>
  );
}
`;

const PLAYGROUND_INICIAL = `
// Ejercicio: el componente usa useReducer pero las acciones no están tipadas
// Define el discriminated union para AccionContador

interface EstadoContador {
  conteo: number;
  paso: number;
}

// TODO: Define AccionContador como discriminated union con:
//   - { tipo: 'incrementar' }
//   - { tipo: 'decrementar' }
//   - { tipo: 'cambiarPaso'; valor: number }
type AccionContador = unknown; // ← reemplaza esto

function reducer(estado: EstadoContador, accion: AccionContador): EstadoContador {
  return estado; // ← implementa el switch aquí
}

function Contador() {
  const [estado, dispatch] = React.useReducer(reducer, { conteo: 0, paso: 1 });

  return (
    <div>
      <p>Conteo: {estado.conteo} (paso: {estado.paso})</p>
      <button onClick={() => dispatch({ tipo: 'incrementar' })}>+</button>
      <button onClick={() => dispatch({ tipo: 'decrementar' })}>-</button>
      {/* Error: 'duplicar' no existe en AccionContador (cuando lo definas bien) */}
      <button onClick={() => dispatch({ tipo: 'duplicar' })}>×2</button>
    </div>
  );
}

const example = <Contador />
`;

export default function UseReducerPage() {
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
          MÓDULO 4
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
          useReducer
        </h1>
        <p
          style={{
            fontSize: "17px",
            color: "var(--text-muted)",
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          Tipando estado y acciones con discriminated unions
        </p>
      </header>

      {/* 01 — CONCEPTO */}
      <section style={{ marginBottom: "44px" }}>
        <SectionTitle numero="01" etiqueta="CONCEPTO" />
        <p className="page-body" style={{ margin: 0 }}>
          <code>useReducer</code> es ideal para estados complejos con múltiples
          transiciones. TypeScript se beneficia especialmente aquí porque los{" "}
          <strong style={{ color: "var(--text-secondary)", fontWeight: 600 }}>
            discriminated unions
          </strong>{" "}
          para las acciones permiten al compilador saber exactamente qué
          propiedades tiene cada acción.
        </p>
      </section>

      {/* 02 — TIPO DEL ESTADO */}
      <section style={{ marginBottom: "44px" }}>
        <SectionTitle numero="02" etiqueta="TIPO DEL ESTADO" />
        <p className="page-body" style={{ marginBottom: "16px" }}>
          Define el tipo del estado con una <code>interface</code> antes del
          reducer. Esto documenta claramente qué datos maneja el componente.
        </p>
        <CodeBlock codigo={CODIGO_ESTADO} archivo="contador.tsx" />
      </section>

      {/* 03 — DISCRIMINATED UNIONS */}
      <section style={{ marginBottom: "44px" }}>
        <SectionTitle numero="03" etiqueta="DISCRIMINATED UNIONS" />
        <p className="page-body" style={{ marginBottom: "16px" }}>
          El patrón más poderoso para tipar acciones. Cada variante tiene una
          propiedad <code>tipo</code> única que TypeScript usa para{" "}
          <em>estrechar</em> el tipo dentro de cada rama del <code>switch</code>
          .
        </p>
        <CodeBlock codigo={CODIGO_ACCIONES} archivo="contador-acciones.ts" />
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <ConceptCard tipo="error">
            Sin tipar las acciones, el <code>dispatch</code> acepta cualquier
            objeto y los errores de lógica solo aparecen en tiempo de ejecución.
          </ConceptCard>
          <ConceptCard tipo="exito">
            Con el discriminated union, TypeScript garantiza que solo se
            despachen acciones válidas y que cada acción tenga exactamente las
            propiedades que necesita.
          </ConceptCard>
        </div>
      </section>

      {/* 04 — EL REDUCER */}
      <section style={{ marginBottom: "44px" }}>
        <SectionTitle numero="04" etiqueta="EL REDUCER" />
        <p className="page-body" style={{ marginBottom: "16px" }}>
          Dentro de cada caso del <code>switch</code>, TypeScript estrecha el
          tipo de la acción automáticamente. En <code>case 'cambiarPaso'</code>,
          sabe que <code>accion.valor</code> existe.
        </p>
        <CodeBlock codigo={CODIGO_REDUCER} archivo="reducer.ts" />
      </section>

      {/* 05 — USO CON useReducer */}
      <section style={{ marginBottom: "44px" }}>
        <SectionTitle numero="05" etiqueta="USO CON useReducer" />
        <p className="page-body" style={{ marginBottom: "16px" }}>
          TypeScript infiere el tipo del <code>estado</code> y del{" "}
          <code>dispatch</code> automáticamente desde la función reducer y el
          estado inicial. No necesitas anotar nada más.
        </p>
        <CodeBlock codigo={CODIGO_USO} archivo="Contador.tsx" />
        <ConceptCard tipo="nota">
          El tipo del <code>dispatch</code> es{" "}
          <code>Dispatch&lt;AccionContador&gt;</code> — TypeScript lo infiere
          del reducer. Si pasas el dispatch como prop a un hijo, puedes usarlo
          como tipo.
        </ConceptCard>
      </section>

      {/* 06 — PLAYGROUND */}
      <section>
        <SectionTitle numero="06" etiqueta="PLAYGROUND" />
        <p className="page-body" style={{ marginBottom: "16px" }}>
          Reemplaza <code>unknown</code> con el discriminated union correcto
          para <code>AccionTarea</code>. Luego implementa el <code>switch</code>{" "}
          dentro del reducer.
        </p>
        <TypescriptPlayground
          codigoInicial={PLAYGROUND_INICIAL}
          archivo="ejercicio-04.tsx"
          altura={520}
        />
        <PlaygroundSolucion
          codigo={PLAYGROUND_SOLUCION}
          archivo="solucion-04.tsx"
        />
      </section>
    </>
  );
}
