import { useState, useCallback } from 'react';
import Editor, { type BeforeMount } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import PlaygroundPreview from './PlaygroundPreview';
import './_playground.scss';

// Declaraciones de tipos de React inyectadas globalmente en el worker de Monaco.
// Permite usar JSX y los tipos de React sin necesidad de import en los ejemplos.
const REACT_TYPE_DEFS = `
declare namespace React {
  type ReactNode = string | number | boolean | null | undefined | ReactElement | ReactNode[];

  interface ReactElement { type: any; props: any; key: any; }

  type Dispatch<A> = (value: A) => void;
  type SetStateAction<S> = S | ((prevState: S) => S);
  type FC<P = {}> = (props: P & { children?: ReactNode }) => ReactElement | null;

  interface MutableRefObject<T> { current: T; }

  interface Context<T> {
    Provider: FC<{ value: T; children?: ReactNode }>;
    Consumer: FC<{ children: (value: T) => ReactNode }>;
  }

  // Hooks
  function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
  function useState<S = undefined>(): [S | undefined, Dispatch<SetStateAction<S | undefined>>];

  function useReducer<S, A>(reducer: (state: S, action: A) => S, initialState: S): [S, Dispatch<A>];

  function useContext<T>(context: Context<T>): T;
  function createContext<T>(defaultValue: T): Context<T>;

  function useMemo<T>(factory: () => T, deps: readonly unknown[]): T;
  function useCallback<T extends (...args: any[]) => any>(callback: T, deps: readonly unknown[]): T;

  function useRef<T>(initialValue: T): MutableRefObject<T>;
  function useRef<T = undefined>(): MutableRefObject<T | undefined>;

  function useEffect(effect: () => void | (() => void), deps?: readonly unknown[]): void;

  // Tipos de eventos del DOM en React
  interface SyntheticEvent<T = Element> {
    target: EventTarget & T;
    currentTarget: EventTarget & T;
    preventDefault(): void;
    stopPropagation(): void;
  }
  interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
    target: EventTarget & T & {
      value: string;
      checked?: boolean;
      files?: FileList | null;
      name: string;
    };
  }
  interface MouseEvent<T = Element> extends SyntheticEvent<T> {
    button: number;
    clientX: number;
    clientY: number;
  }
  interface FormEvent<T = Element> extends SyntheticEvent<T> {}
  interface KeyboardEvent<T = Element> extends SyntheticEvent<T> {
    key: string;
    code: string;
    keyCode: number;
  }

  type ChangeEventHandler<T = Element>  = (event: ChangeEvent<T>)  => void;
  type MouseEventHandler<T = Element>   = (event: MouseEvent<T>)   => void;
  type FormEventHandler<T = Element>    = (event: FormEvent<T>)    => void;
  type KeyboardEventHandler<T = Element>= (event: KeyboardEvent<T>)=> void;

  type CSSProperties = { [K in keyof CSSStyleDeclaration]?: string | number } & { [key: string]: any };

  // ComponentProps — extrae los atributos de un elemento HTML nativo
  type ComponentProps<T extends keyof JSX.IntrinsicElements> = JSX.IntrinsicElements[T];
}

// Soporte JSX — permite escribir <div>, <button>, etc. directamente
declare namespace JSX {
  interface Element extends React.ReactElement {}
  interface IntrinsicElements {
    [tag: string]: {
      children?: React.ReactNode;
      key?: string | number | null;
      className?: string;
      style?: React.CSSProperties;
      id?: string;
      onClick?: React.MouseEventHandler<any>;
      onChange?: React.ChangeEventHandler<any>;
      onSubmit?: React.FormEventHandler<any>;
      onKeyDown?: React.KeyboardEventHandler<any>;
      onKeyUp?: React.KeyboardEventHandler<any>;
      disabled?: boolean;
      type?: string;
      value?: string | number;
      defaultValue?: string | number;
      placeholder?: string;
      href?: string;
      src?: string;
      alt?: string;
      htmlFor?: string;
      name?: string;
      checked?: boolean;
      defaultChecked?: boolean;
      multiple?: boolean;
      rows?: number;
      cols?: number;
      autoFocus?: boolean;
      readOnly?: boolean;
      required?: boolean;
      min?: string | number;
      max?: string | number;
      step?: string | number;
      [attr: string]: any;
    };
  }
}
`;

interface ErrorTS {
  mensaje: string;
  linea: number;
  columna: number;
}

interface TypescriptPlaygroundProps {
  codigoInicial: string;
  archivo?: string;
  altura?: number;
}

export default function TypescriptPlayground({
  codigoInicial,
  archivo = 'ejercicio.tsx',
  altura = 260,
}: TypescriptPlaygroundProps) {
  const [codigo, setCodigo] = useState<string>(codigoInicial);
  const [errores, setErrores] = useState<ErrorTS[]>([]);

  const handleBeforeMount: BeforeMount = useCallback((monaco) => {
    // Habilitar JSX (new transform de React 17+) y modo estricto
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      jsx: monaco.languages.typescript.JsxEmit.ReactJSX,
      strict: true,
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
      noUnusedLocals: false,
      noUnusedParameters: false,
    });

    // Inyectar los tipos de React como librería global del worker.
    // Nota: NO llamamos setDiagnosticsOptions aquí porque en beforeMount Monaco
    // todavía tiene el modelo interno inmemory://model/1 sin definiciones,
    // lo que causaría "Could not find source file".
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      REACT_TYPE_DEFS,
      'file:///node_modules/@types/react/index.d.ts'
    );

    // El transform jsx: ReactJSX requiere que exista el módulo 'react/jsx-runtime'.
    // Lo declaramos manualmente para que el worker no lance el error de módulo no encontrado.
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      `declare module 'react/jsx-runtime' {
        export function jsx(type: any, props: any, key?: string): JSX.Element;
        export function jsxs(type: any, props: any, key?: string): JSX.Element;
        export const Fragment: any;
      }`,
      'file:///node_modules/react/jsx-runtime.d.ts'
    );
  }, []);

  // onValidate se ejecuta cada vez que el worker de TS revalida el archivo
  const handleValidate = useCallback((markers: editor.IMarker[]) => {
    const erroresTS = markers
      // severity 8 = Error (no warnings ni info)
      .filter((m) => m.severity === 8)
      .map((m) => ({
        mensaje: m.message,
        linea: m.startLineNumber,
        columna: m.startColumn,
      }));

    setErrores(erroresTS);
  }, []);

  const handleReset = useCallback(() => {
    setCodigo(codigoInicial);
    setErrores([]);
  }, [codigoInicial]);

  return (
    <div className="playground">
      {/* Barra superior estilo ventana macOS */}
      <div className="playground__chrome">
        <div className="playground__dots">
          <div className="playground__dot playground__dot--red" />
          <div className="playground__dot playground__dot--yellow" />
          <div className="playground__dot playground__dot--green" />
        </div>
        <div className="playground__filename">
          {archivo}
          <span className="playground__ts-badge">TS</span>
        </div>
        <button className="playground__reset-btn" onClick={handleReset}>
          reset
        </button>
      </div>

      {/* path usa file:/// para que el worker de TS pueda resolver el modelo.
          Monaco crea modelos con inmemory:// por defecto, que el language service
          no puede encontrar al validar. Un URI file:/// lo soluciona. */}
      <Editor
        path={`file:///${archivo}`}
        height={altura}
        language="typescript"
        value={codigo}
        theme="vs-dark"
        onChange={(valor) => setCodigo(valor ?? '')}
        beforeMount={handleBeforeMount}
        onValidate={handleValidate}
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          lineHeight: 22,
          fontFamily: "'JetBrains Mono', monospace",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: 'on',
          padding: { top: 16, bottom: 16 },
          scrollbar: { vertical: 'auto', horizontal: 'hidden' },
          renderLineHighlight: 'none',
          overviewRulerLanes: 0,
        }}
      />

      {/* Panel inferior: errores cuando hay problemas, preview cuando el código es válido */}
      {errores.length > 0 ? (
        <div className="playground__errors-panel playground__errors-panel--con-errores">
          <div className="playground__errors-label">ERRORES TYPESCRIPT</div>
          {errores.map((err, i) => (
            <div key={i} className="playground__error-item">
              <span className="playground__error-pos">
                L{err.linea}:{err.columna}
              </span>
              <span>{err.mensaje}</span>
            </div>
          ))}
        </div>
      ) : (
        <PlaygroundPreview codigo={codigo} />
      )}
    </div>
  );
}
