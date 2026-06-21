import SectionTitle from '../components/ui/SectionTitle';
import ConceptCard from '../components/ui/ConceptCard';
import CodeBlock from '../components/ui/CodeBlock';
import TypescriptPlayground from '../components/playground/TypescriptPlayground';
import PlaygroundSolucion from '../components/ui/PlaygroundSolucion';

const CODIGO_INLINE = `
// Tipos inline: directo en los parámetros
// Útil para componentes pequeños con pocas props
function Boton({ texto, deshabilitado }: { texto: string; deshabilitado: boolean }) {
  return <button disabled={deshabilitado}>{texto}</button>;
}
`;

const CODIGO_INTERFACE = `
// Interface: define la forma del objeto de props
// Recomendado para componentes con varias props o que se reutilizan
interface BotonProps {
  texto: string;
  deshabilitado?: boolean;  // el ? hace la prop opcional
  onClick?: () => void;
}

function Boton({ texto, deshabilitado = false, onClick }: BotonProps) {
  return (
    <button disabled={deshabilitado} onClick={onClick}>
      {texto}
    </button>
  );
}
`;

const CODIGO_TYPE = `
// type: similar a interface, con algunas diferencias en usos avanzados
// Ambas funcionan igual para tipar props en la mayoría de los casos
type TarjetaProps = {
  titulo: string;
  descripcion: string;
  imagen?: string;
};

function Tarjeta({ titulo, descripcion, imagen }: TarjetaProps) {
  return (
    <div>
      {imagen && <img src={imagen} alt={titulo} />}
      <h2>{titulo}</h2>
      <p>{descripcion}</p>
    </div>
  );
}
`;

const CODIGO_CHILDREN = `
import type { ReactNode } from 'react';

// ReactNode acepta cualquier contenido válido en JSX:
// strings, números, elementos JSX, arrays, null, undefined
interface ContenedorProps {
  children: ReactNode;
  titulo: string;
}

function Contenedor({ children, titulo }: ContenedorProps) {
  return (
    <div>
      <h2>{titulo}</h2>
      {children}
    </div>
  );
}

// Uso:
// <Contenedor titulo="Mi sección">
//   <p>Cualquier contenido aquí</p>
// </Contenedor>
`;

const PLAYGROUND_SOLUCION = `
interface TarjetaUsuarioProps {
  nombre: string;
  email: string;
  edad: number;
  bio?: string;
}

function TarjetaUsuario({ nombre, email, edad, bio }: TarjetaUsuarioProps) {
  return (
    <div>
      <h2>{nombre} ({edad})</h2>
      <p>{email}</p>
      {bio && <p>{bio}</p>}
    </div>
  );
}

const test = <TarjetaUsuario nombre="Ana" email="ana@dev.io" edad={28} />;
`;

const PLAYGROUND_INICIAL = `
// Ejercicio: el componente tiene props sin tipar, corrígelas

// Crea una interface TarjetaUsuarioProps con:
//   - nombre: string (requerido)
//   - email: string (requerido)
//   - edad: number (requerido)
//   - bio: string (opcional)

function TarjetaUsuario({ nombre, email, edad, bio }) {
  return (
    <div>
      <h2>{nombre} ({edad})</h2>
      <p>{email}</p>
      {bio && <p>{bio}</p>}
    </div>
  );
}

// Error: 'edad' debería ser number, no string
const test = <TarjetaUsuario nombre="Ana" email="ana@dev.io" edad="28" />;
`;

export default function ComponentesPage() {
  return (
    <>
      <header style={{ marginBottom: '48px' }}>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '2px',
            color: 'var(--accent)',
            marginBottom: '16px',
          }}
        >
          MÓDULO 2
        </div>
        <h1
          style={{
            fontSize: '48px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            margin: '0 0 14px',
            letterSpacing: '-1.5px',
            lineHeight: 1,
          }}
        >
          Componentes
        </h1>
        <p style={{ fontSize: '17px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
          Tipando props con interfaces y types
        </p>
      </header>

      {/* 01 — CONCEPTO */}
      <section style={{ marginBottom: '44px' }}>
        <SectionTitle numero="01" etiqueta="CONCEPTO" />
        <p className="page-body" style={{ margin: 0 }}>
          Los componentes de React reciben datos mediante <strong style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>props</strong>. TypeScript nos permite declarar el tipo exacto de cada prop, lo que hace imposible pasar un valor incorrecto y nos da autocompletado en el editor.
        </p>
      </section>

      {/* 02 — TIPOS INLINE */}
      <section style={{ marginBottom: '44px' }}>
        <SectionTitle numero="02" etiqueta="TIPOS INLINE" />
        <p className="page-body" style={{ marginBottom: '16px' }}>
          La forma más simple: escribir los tipos directamente en el parámetro del componente. Funciona bien para componentes pequeños con pocas props.
        </p>
        <CodeBlock codigo={CODIGO_INLINE} archivo="Boton.tsx" />
        <ConceptCard tipo="nota">
          Los tipos inline pueden volverse difíciles de leer cuando hay muchas props. En ese caso es mejor usar una <code>interface</code> o un <code>type</code> separado.
        </ConceptCard>
      </section>

      {/* 03 — INTERFACE */}
      <section style={{ marginBottom: '44px' }}>
        <SectionTitle numero="03" etiqueta="INTERFACE" />
        <p className="page-body" style={{ marginBottom: '16px' }}>
          La convención más extendida en React con TypeScript. Define el contrato de props fuera del componente usando la palabra clave <code>interface</code>.
        </p>
        <CodeBlock codigo={CODIGO_INTERFACE} archivo="Boton.tsx" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <ConceptCard tipo="error">
            Sin tipar las props, TypeScript no sabe qué valores son válidos. Cualquier error al usar el componente solo aparecerá en tiempo de ejecución.
          </ConceptCard>
          <ConceptCard tipo="exito">
            Con la <code>interface</code> definida, el editor marca inmediatamente si falta una prop requerida o si se pasa un valor del tipo incorrecto.
          </ConceptCard>
        </div>
      </section>

      {/* 04 — TYPE */}
      <section style={{ marginBottom: '44px' }}>
        <SectionTitle numero="04" etiqueta="TYPE" />
        <p className="page-body" style={{ marginBottom: '16px' }}>
          <code>type</code> e <code>interface</code> son intercambiables para la mayoría de los casos de props en React. La diferencia relevante es que <code>interface</code> puede extenderse con <code>extends</code>, mientras que <code>type</code> usa intersección (<code>&</code>).
        </p>
        <CodeBlock codigo={CODIGO_TYPE} archivo="Tarjeta.tsx" />
      </section>

      {/* 05 — CHILDREN */}
      <section style={{ marginBottom: '44px' }}>
        <SectionTitle numero="05" etiqueta="PROP CHILDREN" />
        <p className="page-body" style={{ marginBottom: '16px' }}>
          Para componentes que envuelven contenido, se tipan las <code>children</code> con <code>ReactNode</code>, que acepta cualquier valor que React pueda renderizar.
        </p>
        <CodeBlock codigo={CODIGO_CHILDREN} archivo="Contenedor.tsx" />
      </section>

      {/* 06 — PLAYGROUND */}
      <section>
        <SectionTitle numero="06" etiqueta="PLAYGROUND" />
        <p className="page-body" style={{ marginBottom: '16px' }}>
          Agrega una <code>interface</code> para las props del componente <code>Perfil</code> y úsala para corregir los errores.
        </p>
        <TypescriptPlayground
          codigoInicial={PLAYGROUND_INICIAL}
          archivo="ejercicio-02.tsx"
          altura={240}
        />
        <PlaygroundSolucion codigo={PLAYGROUND_SOLUCION} archivo="solucion-02.tsx" />
      </section>
    </>
  );
}
