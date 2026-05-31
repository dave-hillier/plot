import React, {useLayoutEffect, useRef, type ReactNode} from "react";

// Document-layout half of <Plot>: wraps the rendered plot in a <figure> with
// optional <h2> title, <h3> subtitle, legends, and a <figcaption>, mirroring
// the imperative plot()'s figure structure (figure > h2/h3 > div.plot-host >
// svg > figcaption). <Plot> owns the decision of WHETHER to render a figure
// (see its `figure` prop); this component owns the structure once that's
// decided, keeping document layout separate from scale computation.
export interface FigureLayoutProps {
  title?: string;
  subtitle?: string;
  caption?: string;
  autoLegends: ReactNode;
  explicitLegends: ReactNode;
  plotElement: ReactNode;
  hiddenChildren: ReactNode;
  // When the plot rendered as a JSX <svg>, wrap it in div.plot-host to match
  // the imperative structure; the imperatively-mounted host is already a div.
  isJsx: boolean;
}

export function FigureLayout({
  title,
  subtitle,
  caption,
  autoLegends,
  explicitLegends,
  plotElement,
  hiddenChildren,
  isJsx
}: FigureLayoutProps) {
  return (
    <figure style={{maxWidth: 640, margin: "0 auto"}}>
      {title != null && (
        <SlotHeader as="h2" content={title} style={{fontSize: "16px", fontWeight: "bold", margin: "0 0 4px"}} />
      )}
      {subtitle != null && (
        <SlotHeader
          as="h3"
          content={subtitle}
          style={{fontSize: "12px", fontWeight: "normal", color: "#666", margin: "0 0 8px"}}
        />
      )}
      {autoLegends}
      {explicitLegends}
      {isJsx ? <div className="plot-host">{plotElement}</div> : plotElement}
      {caption != null && (
        <SlotHeader as="figcaption" content={caption} style={{fontSize: "12px", color: "#666", marginTop: "4px"}} />
      )}
      {hiddenChildren}
    </figure>
  );
}

// Renders a title/subtitle/caption slot. Content is usually a string but may be
// a DOM Node (e.g. an HTML title built imperatively); in that case it's mounted
// via replaceChildren rather than as a React child.
function SlotHeader({as: Tag, content, style: styleProp}: {as: any; content: any; style?: any}) {
  const ref = useRef<HTMLElement | null>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (content && typeof (content as any).nodeType === "number") {
      el.replaceChildren(content as Node);
    } else {
      el.replaceChildren();
      if (content != null) el.appendChild(document.createTextNode(String(content)));
    }
  }, [content]);
  const isNode = content && typeof (content as any).nodeType === "number";
  return (
    <Tag ref={ref} style={styleProp}>
      {isNode ? null : content}
    </Tag>
  );
}
