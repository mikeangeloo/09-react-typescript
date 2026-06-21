import SectionTitle from '../components/ui/SectionTitle';
import ConceptCard from '../components/ui/ConceptCard';
import CodeBlock from '../components/ui/CodeBlock';
import TypescriptPlayground from '../components/playground/TypescriptPlayground';
import PlaygroundSolucion from '../components/ui/PlaygroundSolucion';

const CODIGO_DOM_EVENTS = `
// React define tipos para todos los eventos del DOM
// El genérico <T> es el elemento HTML que genera el evento

// Eventos de input y selects
const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
  const valor: string = e.target.value;
  const nombre: string = e.target.name;
};

const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const opcion: string = e.target.value;
};

// Eventos de ratón — e.currentTarget está tipado como el elemento
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  const boton: HTMLButtonElement = e.currentTarget;
  const texto = boton.textContent;
};

// Envío de formularios
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault(); // ✅ TypeScript sabe que preventDefault() existe
};

// Eventos de teclado
const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Enter') {
    console.log('Presionó Enter');
  }
};
`;

const CODIGO_REACTNODE = `
import type { ReactNode, ReactElement } from 'react';

// ReactNode: el tipo más amplio — acepta todo lo que React puede renderizar
// strings, números, booleanos, null, undefined, elementos JSX, arrays
interface TarjetaProps {
  children: ReactNode;    // ✅ Acepta cualquier contenido válido en JSX
  cabecera: ReactNode;    // También puede ser texto plano
}

// ReactElement: solo elementos JSX (no strings ni números)
interface SliderProps {
  diapositiva: ReactElement;  // Debe ser un componente, no texto crudo
}

// JSX.Element: alias de ReactElement — menos específico, evítalo
// en favor de ReactElement o ReactNode

// Ejemplo de diferencia:
const nodo1: ReactNode = "texto simple";     // ✅
const nodo2: ReactNode = <div>hola</div>;   // ✅
const nodo3: ReactNode = null;               // ✅

const elem1: ReactElement = "texto";         // ❌ Error: string no es ReactElement
const elem2: ReactElement = <div>hola</div>; // ✅
`;

const CODIGO_CSS_PROPERTIES = `
// React.CSSProperties tipea objetos de estilos inline
// con todas las propiedades CSS disponibles

interface ComponenteProps {
  estilos?: React.CSSProperties;
  colorFondo?: React.CSSProperties['backgroundColor']; // tipo: string | undefined
}

function Caja({ estilos, colorFondo }: ComponenteProps) {
  return (
    <div
      style={{
        backgroundColor: colorFondo,
        ...estilos,
      }}
    />
  );
}

// Uso:
// <Caja colorFondo="#3178c6" estilos={{ padding: '16px', borderRadius: '8px' }} />

// TypeScript detecta propiedades inválidas:
const miEstilo: React.CSSProperties = {
  backgroundColor: 'blue',   // ✅
  bordRadius: '8px',          // ❌ Error: typo — debería ser 'borderRadius'
};
`;

const CODIGO_COMPONENT_PROPS = `
import type { ComponentProps } from 'react';

// ComponentProps<'elemento'> extrae los props de un elemento HTML
// Útil para crear componentes que envuelven elementos nativos

// Opción 1: extender los props de un botón HTML
type BotonProps = ComponentProps<'button'> & {
  variante: 'primario' | 'secundario' | 'fantasma';
};

function Boton({ variante, className, children, ...resto }: BotonProps) {
  return (
    <button
      className={'btn btn-' + variante + (className ? ' ' + className : '')}
      {...resto}  // pasa onClick, disabled, type, etc.
    >
      {children}
    </button>
  );
}

// Ahora el componente acepta todos los atributos de <button>
// más la prop 'variante' que definimos nosotros
`;

const PLAYGROUND_SOLUCION = `
function CampoTexto() {
  const [valor, setValor] = React.useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setValor(e.target.value);

  return <input value={valor} onChange={handleChange} />;
}

interface TarjetaProps {
  titulo: string;
  children: React.ReactNode;
}

function Tarjeta({ titulo, children }: TarjetaProps) {
  return <div><h2>{titulo}</h2>{children}</div>;
}

const estilos: React.CSSProperties = {
  backgroundColor: '#3178c6',
  padding: '8px 16px',
  borderRadius: '6px',
};
`;

const PLAYGROUND_INICIAL = `
// Ejercicio: reemplaza los ??? con los tipos correctos de React

// 1. Handler de input: el evento viene de HTMLInputElement
function CampoTexto() {
  const [valor, setValor] = React.useState('');

  // Error: 'e' implícito — agrega React.ChangeEvent<HTMLInputElement>
  const handleChange = (e: ???) => setValor(e.target.value);

  return <input value={valor} onChange={handleChange} />;
}

// 2. children prop: acepta cualquier contenido renderizable
interface TarjetaProps {
  titulo: string;
  children: ???;  // ReactNode: strings, JSX, null, números...
}

function Tarjeta({ titulo, children }: TarjetaProps) {
  return <div><h2>{titulo}</h2>{children}</div>;
}

// 3. Estilos inline tipados — prueba escribir 'backgrondColor' (typo)
const estilos: ??? = {
  backgroundColor: '#3178c6',
  padding: '8px 16px',
  borderRadius: '6px',
};
`;

export default function TiposUtilesPage() {
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
          MÓDULO 7
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
          Tipos Útiles
        </h1>
        <p style={{ fontSize: '17px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
          DOM Events, ReactNode, CSSProperties y más
        </p>
      </header>

      {/* 01 — CONCEPTO */}
      <section style={{ marginBottom: '44px' }}>
        <SectionTitle numero="01" etiqueta="CONCEPTO" />
        <p className="page-body" style={{ margin: 0 }}>
          El paquete <code>@types/react</code> incluye tipos predefinidos para los casos más comunes: eventos del DOM, contenido JSX, estilos inline y props de elementos HTML. Conocerlos evita tener que definir tipos a mano y garantiza compatibilidad con React.
        </p>
      </section>

      {/* 02 — DOM EVENTS */}
      <section style={{ marginBottom: '44px' }}>
        <SectionTitle numero="02" etiqueta="DOM EVENTS" />
        <p className="page-body" style={{ marginBottom: '16px' }}>
          React exporta tipos para todos los eventos estándar del DOM. El genérico <code>&lt;T&gt;</code> especifica el elemento HTML que origina el evento, lo que da acceso tipado a sus propiedades específicas (<code>e.target.value</code>, <code>e.target.files</code>, etc.).
        </p>
        <CodeBlock codigo={CODIGO_DOM_EVENTS} archivo="eventos.tsx" />
        <ConceptCard tipo="nota">
          La diferencia entre <code>e.target</code> y <code>e.currentTarget</code>: <code>currentTarget</code> siempre es el elemento con el event listener (el elemento del genérico), mientras que <code>target</code> puede ser un hijo. Usa <code>currentTarget</code> cuando necesites el tipo exacto.
        </ConceptCard>
      </section>

      {/* 03 — REACTNODE Y REACTELEMENT */}
      <section style={{ marginBottom: '44px' }}>
        <SectionTitle numero="03" etiqueta="REACTNODE Y REACTELEMENT" />
        <p className="page-body" style={{ marginBottom: '16px' }}>
          Para tipar la prop <code>children</code> o cualquier prop que reciba contenido JSX, tienes dos opciones principales con comportamientos distintos.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
          <ConceptCard tipo="exito" titulo="ReactNode (más flexible)">
            Acepta cualquier cosa que React pueda renderizar: JSX, strings, números, arrays, <code>null</code> o <code>undefined</code>. Úsalo para <code>children</code> en componentes de layout.
          </ConceptCard>
          <ConceptCard tipo="nota" titulo="ReactElement (más restrictivo)">
            Solo acepta elementos JSX (el resultado de llamar a <code>React.createElement</code>). Úsalo cuando el componente necesita clonar o inspeccionar sus hijos.
          </ConceptCard>
        </div>
        <CodeBlock codigo={CODIGO_REACTNODE} archivo="tipos-contenido.ts" />
      </section>

      {/* 04 — CSS PROPERTIES */}
      <section style={{ marginBottom: '44px' }}>
        <SectionTitle numero="04" etiqueta="CSSPROPERTIES" />
        <p className="page-body" style={{ marginBottom: '16px' }}>
          <code>React.CSSProperties</code> tipea objetos de estilos inline. Detecta errores de tipeo en los nombres de propiedades CSS y verifica que los valores sean del tipo correcto.
        </p>
        <CodeBlock codigo={CODIGO_CSS_PROPERTIES} archivo="estilos.tsx" />
      </section>

      {/* 05 — COMPONENT PROPS */}
      <section style={{ marginBottom: '44px' }}>
        <SectionTitle numero="05" etiqueta="COMPONENTPROPS" />
        <p className="page-body" style={{ marginBottom: '16px' }}>
          <code>ComponentProps&lt;'elemento'&gt;</code> extrae todos los atributos de un elemento HTML nativo. Es la forma más limpia de crear componentes wrapper que respetan la API nativa.
        </p>
        <CodeBlock codigo={CODIGO_COMPONENT_PROPS} archivo="Boton.tsx" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <ConceptCard tipo="error">
            Definir manualmente <code>onClick</code>, <code>disabled</code>, <code>type</code>, etc. es tedioso y puede quedar desactualizado. Si el elemento nativo agrega atributos, tu componente no los heredará.
          </ConceptCard>
          <ConceptCard tipo="exito">
            Con <code>ComponentProps&lt;'button'&gt;</code>, el componente hereda automáticamente todos los atributos del botón y solo tienes que agregar las props propias.
          </ConceptCard>
        </div>
      </section>

      {/* 06 — PLAYGROUND */}
      <section>
        <SectionTitle numero="06" etiqueta="PLAYGROUND" />
        <p className="page-body" style={{ marginBottom: '16px' }}>
          Reemplaza los <code>???</code> con los tipos correctos de React. Pista: <code>React.ChangeEvent</code>, <code>ReactElement</code>, <code>ReactNode</code>, <code>React.CSSProperties</code>.
        </p>
        <TypescriptPlayground
          codigoInicial={PLAYGROUND_INICIAL}
          archivo="ejercicio-07.tsx"
          altura={240}
        />
        <PlaygroundSolucion codigo={PLAYGROUND_SOLUCION} archivo="solucion-07.tsx" />
      </section>
    </>
  );
}
