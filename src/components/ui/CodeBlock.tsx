import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps {
  codigo: string;
  lenguaje?: string;
  archivo?: string;
}

export default function CodeBlock({
  codigo,
  lenguaje = "typescript",
  archivo,
}: CodeBlockProps) {
  return (
    <div
      style={{
        borderRadius: "10px",
        overflow: "hidden",
        border: "1px solid var(--border-dim)",
        marginBottom: "16px",
      }}
    >
      {archivo && (
        <div
          style={{
            padding: "8px 14px",
            background: "var(--bg-chrome)",
            borderBottom: "1px solid var(--border-dim)",
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            color: "var(--text-muted)",
          }}
        >
          {archivo}
        </div>
      )}
      <SyntaxHighlighter
        language={lenguaje}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          background: "var(--bg-card)",
          fontSize: "13.5px",
          lineHeight: "1.75",
          padding: "18px 20px",
        }}
        showLineNumbers={false}
      >
        {codigo.trim()}
      </SyntaxHighlighter>
    </div>
  );
}
