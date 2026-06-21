interface SectionTitleProps {
  numero: string;
  etiqueta: string;
}

export default function SectionTitle({ numero, etiqueta }: SectionTitleProps) {
  return (
    <div
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '11.5px',
        fontWeight: 600,
        letterSpacing: '1.5px',
        color: 'var(--text-label)',
        marginBottom: '18px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      <span style={{ color: 'var(--accent)' }}>{numero}</span>
      <span>—</span>
      <span>{etiqueta}</span>
    </div>
  );
}
