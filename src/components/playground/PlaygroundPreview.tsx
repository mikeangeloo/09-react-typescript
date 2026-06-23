import * as Babel from "@babel/standalone";
import { Component, useEffect, useState } from "react";
import * as React from "react";

class ErrorBoundary extends Component<
  { children: React.ReactNode; onError: (e: Error) => void },
  { error: Error | null }
> {
  state = { error: null };
  static getDerivedStateFromError(e: Error) {
    return { error: e };
  }
  componentDidCatch(e: Error) {
    this.props.onError(e);
  }
  render() {
    return this.state.error ? null : this.props.children;
  }
}

function transpilarYExtraer(codigo: string): React.ComponentType {
  const { code: js } = Babel.transform(codigo, {
    presets: [
      // runtime: classic transforma JSX en React.createElement(...)
      // en lugar de importar react/jsx-runtime (que new Function no puede resolver)
      ["react", { runtime: "classic" }],
      "typescript", // filename .tsx hace que Babel detecte TSX automáticamente
    ],
    filename: "ejercicio.tsx",
  });

  // Estrategia de extracción del componente:
  // 1. export default function Foo → Foo
  // 2. export default Foo          → Foo
  // 3. Sin export default          → último nombre de función/const con Mayúscula
  const matchFn = codigo.match(/export\s+default\s+function\s+([A-Z]\w*)/);
  const matchId = codigo.match(/export\s+default\s+([A-Z]\w*)/);
  const allComps = [
    ...codigo.matchAll(/^(?:function|const)\s+([A-Z][a-zA-Z0-9]*)/gm),
  ];

  const nombre = matchFn?.[1] ?? matchId?.[1] ?? allComps.at(-1)?.[1] ?? null;

  if (!nombre) {
    throw new Error(
      "No se encontró un componente React.\n" +
        "Asegúrate de que haya una función que empiece con Mayúscula.",
    );
  }

  const codigoLimpio = (js ?? "")
    .replace(/export\s+default\s+function\s+(\w+)/, "function $1")
    .replace(/export\s+default\s+\w+\s*;?/, "");

  // Los ejercicios no tienen imports — React y sus hooks se inyectan como parámetros.
  // Al final se busca si existe una variable de demo (ej. `const test = <Comp prop="val" />`)
  // para renderizarla con sus props reales en lugar de `<Comp />` vacío.
  const fn = new Function(
    "React",
    "useState",
    "useReducer",
    "useContext",
    "createContext",
    "useMemo",
    "useCallback",
    "useRef",
    "useEffect",
    `"use strict";
${codigoLimpio}
// Solo renderizar si hay una variable de demo activa
var __demoVars = ['test', 'demo', 'ejemplo', 'example'];
for (var __i = 0; __i < __demoVars.length; __i++) {
  try {
    var __v = eval(__demoVars[__i]);
    if (__v !== null && __v !== undefined && typeof __v === 'object' && __v.$$typeof) {
      var __captured = __v;
      return function Preview() { return __captured; };
    }
  } catch(e) {}
}

// ← Sin demo encontrada: no renderizar nada
return function Empty() { return null; };`,
  );

  const comp = fn(
    React,
    React.useState,
    React.useReducer,
    React.useContext,
    React.createContext,
    React.useMemo,
    React.useCallback,
    React.useRef,
    React.useEffect,
  );

  if (!comp) throw new Error(`El componente "${nombre}" no está definido.`);
  return comp as React.ComponentType;
}

interface PlaygroundPreviewProps {
  codigo: string;
}

export default function PlaygroundPreview({ codigo }: PlaygroundPreviewProps) {
  // Guardamos el componente compilado en estado de React para renderizarlo directamente,
  // evitando la complejidad de gestionar un createRoot secundario.
  const [Comp, setComp] = useState<React.ComponentType | null>(null);
  const [boundaryKey, setBoundaryKey] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setErrorMsg(null);
    try {
      const c = transpilarYExtraer(codigo);
      // Forma de función para que React no trate el componente como un updater de estado
      setComp(() => c);
      setBoundaryKey((k) => k + 1);
    } catch (e) {
      setComp(null);
      setErrorMsg(e instanceof Error ? e.message : String(e));
    }
  }, [codigo]);

  return (
    <div className="pg-preview">
      <div className="pg-preview__label">RESULTADO</div>
      {errorMsg ? (
        <div className="pg-preview__error">
          <span className="pg-preview__error-title">ERROR DE PREVIEW</span>
          <pre className="pg-preview__error-msg">{errorMsg}</pre>
        </div>
      ) : Comp ? (
        <div className="pg-preview__sandbox">
          <ErrorBoundary
            key={boundaryKey}
            onError={(e) => setErrorMsg(`Error en ejecución:\n${e.message}`)}
          >
            <Comp />
          </ErrorBoundary>
        </div>
      ) : null}
    </div>
  );
}
