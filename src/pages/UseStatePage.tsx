import SectionTitle from "../components/ui/SectionTitle";
import ConceptCard from "../components/ui/ConceptCard";
import CodeBlock from "../components/ui/CodeBlock";
import TypescriptPlayground from "../components/playground/TypescriptPlayground";
import PlaygroundSolucion from "../components/ui/PlaygroundSolucion";

const CODIGO_INFERIDO = `
// TypeScript infiere el tipo desde el valor inicial
// No necesitas escribir el genérico en estos casos
const [conteo, setConteo] = useState(0);        // infiere: number
const [nombre, setNombre] = useState('React');   // infiere: string
const [activo, setActivo] = useState(false);     // infiere: boolean
const [items, setItems] = useState(['a', 'b']);  // infiere: string[]
`;

const CODIGO_EXPLICITO = `
// Necesitas el genérico cuando el valor inicial no refleja el tipo completo

// Caso 1: el estado puede ser null o undefined
const [usuario, setUsuario] = useState<string | null>(null);

// Caso 2: array que empieza vacío (TypeScript inferiría never[])
const [productos, setProductos] = useState<string[]>([]);

// Caso 3: objeto complejo que se cargará después
interface Perfil {
  id: number;
  nombre: string;
  email: string;
}
const [perfil, setPerfil] = useState<Perfil | undefined>(undefined);
`;

const CODIGO_UNION = `
// Union type: el estado solo puede ser uno de estos valores exactos
type EstadoCarga = 'inactivo' | 'cargando' | 'exito' | 'error';

const [estado, setEstado] = useState<EstadoCarga>('inactivo');

// TypeScript detectará este error en tiempo de compilación:
// setEstado('pendiente'); // ❌ Error: "pendiente" no es EstadoCarga

// Uso correcto:
setEstado('cargando');  // ✅
setEstado('exito');     // ✅
`;

const CODIGO_OBJETO = `
// Para objetos complejos, define la interface primero
interface Filtros {
  busqueda: string;
  categoria: string | null;
  ordenarPor: 'nombre' | 'precio' | 'fecha';
  pagina: number;
}

const [filtros, setFiltros] = useState<Filtros>({
  busqueda: '',
  categoria: null,
  ordenarPor: 'nombre',
  pagina: 1,
});

// Al actualizar, TypeScript verifica que la estructura sea correcta
setFiltros(prev => ({
  ...prev,
  busqueda: 'zapatillas',
  pagina: 1,
}));
`;

const PLAYGROUND_SOLUCION = `
type EstadoCarga = 'inactivo' | 'cargando' | 'exito' | 'error';

function BuscadorUsuarios() {
  const [resultados, setResultados] = React.useState<string[]>([]);
  const [seleccionado, setSeleccionado] = React.useState<string | null>(null);
  const [estado, setEstado] = React.useState<EstadoCarga>('inactivo');

  const buscar = () => {
    setEstado('cargando');
    setResultados(['Ana', 'Carlos']);
    setSeleccionado('Ana');
    setEstado('error');
  };

  return (
    <div>
      <button onClick={buscar}>Buscar</button>
      <p>Estado: {estado}</p>
    </div>
  );
}
`;

const PLAYGROUND_INICIAL = `
// Ejercicio: corrige los tipos del estado en este componente React

type EstadoCarga = 'inactivo' | 'cargando' | 'exito';

function BuscadorUsuarios() {
  // Error 1: el array se infiere como never[] — agrega el genérico <string>
  const [resultados, setResultados] = React.useState([]);

  // Error 2: puede ser string o null, pero TS no lo sabe desde null
  const [seleccionado, setSeleccionado] = React.useState(null);

  // Error 3: 'error' no existe en EstadoCarga
  const [estado, setEstado] = React.useState<EstadoCarga>('inactivo');

  const buscar = () => {
    setEstado('cargando');
    setResultados(['Ana', 'Carlos']);   // debería funcionar con un array de strings
    setSeleccionado('Ana');             // debería funcionar con string | null
    setEstado('error');                 // debería marcar error
  };

  return (
    <div>
      <button onClick={buscar}>Buscar</button>
      <p>Estado: {estado}</p>
    </div>
  );
}
`;

export default function UseStatePage() {
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
          MÓDULO 3
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
          useState
        </h1>
        <p
          style={{
            fontSize: "17px",
            color: "var(--text-muted)",
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          Tipos inferidos y genéricos explícitos
        </p>
      </header>

      {/* 01 — CONCEPTO */}
      <section style={{ marginBottom: "44px" }}>
        <SectionTitle numero="01" etiqueta="CONCEPTO" />
        <p className="page-body" style={{ margin: 0 }}>
          <code>useState</code> acepta un{" "}
          <strong style={{ color: "var(--text-secondary)", fontWeight: 600 }}>
            genérico opcional
          </strong>{" "}
          para declarar el tipo del estado. En la mayoría de los casos,
          TypeScript puede inferir el tipo automáticamente desde el valor
          inicial. Solo necesitas el genérico cuando el tipo no se puede deducir
          del valor inicial.
        </p>
      </section>

      {/* 02 — INFERENCIA AUTOMÁTICA */}
      <section style={{ marginBottom: "44px" }}>
        <SectionTitle numero="02" etiqueta="INFERENCIA AUTOMÁTICA" />
        <p className="page-body" style={{ marginBottom: "16px" }}>
          Cuando el valor inicial deja claro el tipo, TypeScript lo infiere sin
          que tengas que escribirlo.
        </p>
        <CodeBlock codigo={CODIGO_INFERIDO} archivo="inferencia.tsx" />
        <ConceptCard tipo="nota">
          Escribir <code>useState&lt;number&gt;(0)</code> es equivalente a{" "}
          <code>useState(0)</code> — el genérico es redundante cuando el valor
          inicial basta.
        </ConceptCard>
      </section>

      {/* 03 — GENÉRICO EXPLÍCITO */}
      <section style={{ marginBottom: "44px" }}>
        <SectionTitle numero="03" etiqueta="GENÉRICO EXPLÍCITO" />
        <p className="page-body" style={{ marginBottom: "16px" }}>
          Usa el genérico cuando el valor inicial no refleja todos los valores
          posibles que tendrá el estado.
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
            <code>useState(null)</code> infiere el tipo <code>null</code>, lo
            que hace imposible asignar cualquier otro valor después.
          </ConceptCard>
          <ConceptCard tipo="exito">
            <code>useState&lt;string | null&gt;(null)</code> permite que el
            estado sea <code>string</code> o <code>null</code>.
          </ConceptCard>
        </div>
        <CodeBlock codigo={CODIGO_EXPLICITO} archivo="explicit.tsx" />
      </section>

      {/* 04 — UNION TYPES */}
      <section style={{ marginBottom: "44px" }}>
        <SectionTitle numero="04" etiqueta="UNION TYPES" />
        <p className="page-body" style={{ marginBottom: "16px" }}>
          Los union types son ideales para estados con un conjunto finito de
          valores posibles, como el estado de una petición HTTP.
        </p>
        <CodeBlock codigo={CODIGO_UNION} archivo="union.tsx" />
      </section>

      {/* 05 — OBJETOS COMPLEJOS */}
      <section style={{ marginBottom: "44px" }}>
        <SectionTitle numero="05" etiqueta="OBJETOS COMPLEJOS" />
        <p className="page-body" style={{ marginBottom: "16px" }}>
          Para objetos con múltiples propiedades, declara una{" "}
          <code>interface</code> o <code>type</code> y úsala como genérico.
          TypeScript verificará las actualizaciones de estado también.
        </p>
        <CodeBlock codigo={CODIGO_OBJETO} archivo="filtros.tsx" />
      </section>

      {/* 06 — PLAYGROUND */}
      <section>
        <SectionTitle numero="06" etiqueta="PLAYGROUND" />
        <p className="page-body" style={{ marginBottom: "16px" }}>
          Analiza cada comentario y corrige los problemas de tipos. En el último
          caso, piensa qué valor no está incluido en el union type.
        </p>
        <TypescriptPlayground
          codigoInicial={PLAYGROUND_INICIAL}
          archivo="ejercicio-03.tsx"
          altura={520}
        />
        <PlaygroundSolucion
          codigo={PLAYGROUND_SOLUCION}
          archivo="solucion-03.tsx"
        />
      </section>
    </>
  );
}
