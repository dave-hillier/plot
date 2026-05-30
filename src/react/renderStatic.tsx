import {createElement as h, Fragment, type ReactNode} from "react";
import {renderMarksWith, isPointerConsumer} from "./Plot.js";

// Builds the <svg> React element for a computed plot without any hooks, so it
// can be serialized via renderToStaticMarkup for the imperative plot() entry
// point. Pointer-consumer marks (Tip, crosshair) render empty (no hover in a
// static render), matching <MarkSlot>'s default.
export function buildStaticPlotSvg(computed: any, warnings: number, classNameProp?: string): ReactNode {
  const {className, ariaLabel, ariaDescription, dimensions} = computed;
  const {width, height} = dimensions;
  const styleText = `:where(.${className}) {
  --plot-background: white;
  display: block;
  height: auto;
  height: intrinsic;
  max-width: 100%;
}
:where(.${className} text),
:where(.${className} tspan) {
  white-space: pre;
}`;
  const marks = renderMarksWith(computed, staticRenderOne);
  const warningIndicator =
    warnings > 0
      ? h(
          "text",
          {x: width, y: 20, dy: "-1em", textAnchor: "end", fontFamily: "initial"},
          "⚠️",
          h(
            "title",
            null,
            `${warnings.toLocaleString("en-US")} warning${warnings === 1 ? "" : "s"}. Please check the console.`
          )
        )
      : null;
  return h(
    "svg",
    {
      className: [className, classNameProp].filter(Boolean).join(" ") || undefined,
      fill: "currentColor",
      fontFamily: "system-ui, sans-serif",
      fontSize: 10,
      textAnchor: "middle",
      width,
      height,
      viewBox: `0 0 ${width} ${height}`,
      "aria-label": ariaLabel ?? undefined,
      "aria-description": ariaDescription ?? undefined
    },
    h("style", null, styleText),
    ...marks,
    warningIndicator
  );
}

function staticRenderOne(
  mark: any,
  index: any,
  values: any,
  dims: any,
  scales: any,
  context: any,
  key: string
): ReactNode {
  if (typeof mark.renderJSX !== "function") return null;
  let renderIndex = index;
  if (isPointerConsumer(mark) && index != null) {
    const empty: any = [];
    if ((index as any).fx !== undefined)
      (empty.fx = (index as any).fx), (empty.fy = (index as any).fy), (empty.fi = (index as any).fi);
    renderIndex = empty;
  }
  // Coerce TypedArray indexes to a plain Array (their .map() coerces returned
  // React elements back to numbers); preserve facet markers.
  const arrayIndex =
    renderIndex == null || !ArrayBuffer.isView(renderIndex)
      ? renderIndex
      : Object.assign(Array.from(renderIndex as any), {
          fx: (renderIndex as any).fx,
          fy: (renderIndex as any).fy,
          fi: (renderIndex as any).fi
        });
  return h(Fragment, {key}, mark.renderJSX(arrayIndex, scales, values, dims, context));
}
