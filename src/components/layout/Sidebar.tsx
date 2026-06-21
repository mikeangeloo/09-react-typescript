import { NavLink } from 'react-router-dom';

interface ModuloItem {
  num: string;
  titulo: string;
  sub: string;
  ruta: string;
}

const modulos: ModuloItem[] = [
  {
    num: '1',
    titulo: 'Instalación',
    sub: 'Setup con Vite, tsconfig.json',
    ruta: '/instalacion',
  },
  {
    num: '2',
    titulo: 'Componentes',
    sub: 'Props tipados: interface, type',
    ruta: '/componentes',
  },
  {
    num: '3',
    titulo: 'useState',
    sub: 'Inferencia, union types, genéricos',
    ruta: '/use-state',
  },
  {
    num: '4',
    titulo: 'useReducer',
    sub: 'State + Action types, discriminated unions',
    ruta: '/use-reducer',
  },
  {
    num: '5',
    titulo: 'useContext',
    sub: 'Contexto tipado, null safety',
    ruta: '/use-context',
  },
  {
    num: '6',
    titulo: 'useMemo / useCallback',
    sub: 'Tipos inferidos, EventHandler',
    ruta: '/use-memo-callback',
  },
  {
    num: '7',
    titulo: 'Tipos Útiles',
    sub: 'DOM Events, ReactNode, CSSProperties',
    ruta: '/tipos-utiles',
  },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      {/* Encabezado con logo TS */}
      <div className="sidebar__brand">
        <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
          <div className="sidebar__logo">TS</div>
          <div>
            <div
              style={{
                fontSize: '15px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                lineHeight: 1.15,
              }}
            >
              TypeScript
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-dimmer)' }}>
              con React · react.dev
            </div>
          </div>
        </div>
      </div>

      {/* Navegación de módulos */}
      <nav className="sidebar__nav">
        {modulos.map((m) => (
          <NavLink
            key={m.ruta}
            to={m.ruta}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            {({ isActive }) => (
              <>
                <div className={`nav-item__num${isActive ? ' active' : ''}`}>{m.num}</div>
                <div className="nav-item__info">
                  <div className={`nav-item__title${isActive ? ' active' : ''}`}>{m.titulo}</div>
                  <div className="nav-item__sub">{m.sub}</div>
                </div>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Enlace a docs oficiales */}
      <div className="sidebar__footer">
        <a
          href="https://react.dev/learn/typescript"
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12.5px',
            color: 'var(--text-dimmer)',
            textDecoration: 'none',
          }}
        >
          <span>📖</span>
          <span>Documentación oficial</span>
        </a>
      </div>
    </aside>
  );
}
