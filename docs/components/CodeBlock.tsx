import {Children, isValidElement, useEffect, useRef, useState, type HTMLAttributes} from "react";

// A <pre> block styled after the upstream VitePress docs: a language label in
// the corner and a copy button that appears on hover, switching to a check
// mark once the code is on the clipboard. Mapped over MDX's pre element
// app-wide, so every fenced code block (including example source injected by
// remark-plot-source) gets the same treatment.
export function CodeBlock({children, ...rest}: HTMLAttributes<HTMLPreElement>) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const code = Children.toArray(children).find(isValidElement);
  const language = /language-(\w+)/.exec((code?.props as {className?: string})?.className ?? "")?.[1];

  function handleCopy() {
    const text = preRef.current?.textContent;
    if (text == null) return;
    navigator.clipboard.writeText(text).then(() => setCopied(true));
  }

  return (
    <div className={`code-block${copied ? " copied" : ""}`}>
      <button
        type="button"
        className="code-copy"
        aria-label={copied ? "Copied" : "Copy code to clipboard"}
        onClick={handleCopy}
      >
        {copied ? (
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path fill="currentColor" d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path
              fill="currentColor"
              d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2m0 16H8V7h11z"
            />
          </svg>
        )}
      </button>
      {language && (
        <span className="code-lang" aria-hidden="true">
          {language}
        </span>
      )}
      <pre ref={preRef} {...rest}>
        {children}
      </pre>
    </div>
  );
}
