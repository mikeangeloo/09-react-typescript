import CodeBlock from './CodeBlock';

interface PlaygroundSolucionProps {
  codigo: string;
  archivo?: string;
}

export default function PlaygroundSolucion({ codigo, archivo }: PlaygroundSolucionProps) {
  return (
    <details
      style={{
        marginTop: '12px',
        border: '1px solid var(--border-dim)',
        borderRadius: '10px',
        overflow: 'hidden',
      }}
    >
      <summary
        style={{
          padding: '10px 16px',
          background: 'var(--bg-chrome)',
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          fontWeight: 600,
          letterSpacing: '1px',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          listStyle: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          userSelect: 'none',
        }}
      >
        <span style={{ color: 'var(--accent-light)', fontSize: '10px' }}>▶</span>
        VER SOLUCIÓN
      </summary>
      <div style={{ marginBottom: 0 }}>
        <CodeBlock codigo={codigo} archivo={archivo} />
      </div>
    </details>
  );
}
