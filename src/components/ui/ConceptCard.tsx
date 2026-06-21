import type { ReactNode } from 'react';

interface ConceptCardProps {
  tipo: 'error' | 'exito' | 'nota';
  titulo?: string;
  children: ReactNode;
}

export default function ConceptCard({ tipo, titulo, children }: ConceptCardProps) {
  if (tipo === 'nota') {
    return (
      <div className="note-card">
        <div className="note-card__title">📌 Nota</div>
        <div className="note-card__body">{children}</div>
      </div>
    );
  }

  const esError = tipo === 'error';

  return (
    <div className={`concept-card concept-card--${esError ? 'error' : 'success'}`}>
      <div className={`concept-card__header concept-card__header--${esError ? 'error' : 'success'}`}>
        <span>{esError ? '❌' : '✅'}</span>
        <span>{titulo ?? (esError ? 'Problema' : 'Solución')}</span>
      </div>
      <div className="concept-card__body">{children}</div>
    </div>
  );
}
