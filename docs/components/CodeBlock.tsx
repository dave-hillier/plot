import {useEffect, useRef, useState, type HTMLAttributes} from "react";

// A <pre> block with a copy button, matching the upstream VitePress docs where
// every code block can be copied. Mapped over MDX's pre element app-wide and
// used by PlotExample for injected example source.
export function CodeBlock({children, ...rest}: HTMLAttributes<HTMLPreElement>) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  function handleCopy() {
    const text = preRef.current?.textContent;
    if (text == null) return;
    navigator.clipboard.writeText(text).then(() => setCopied(true));
  }

  return (
    <div className="code-block">
      <button type="button" className="code-copy" aria-label="Copy code to clipboard" onClick={handleCopy}>
        {copied ? "Copied!" : "Copy"}
      </button>
      <pre ref={preRef} {...rest}>
        {children}
      </pre>
    </div>
  );
}
