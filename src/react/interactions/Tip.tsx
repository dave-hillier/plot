import {useMark} from "../useMark.js";
import type {MarkProps} from "../markProps.js";
import {tip} from "../../marks/tip.js";
import type {TipOptions} from "../../marks/tip.js";
import {formatDefault} from "../../core/index.js";

// Mark-specific options come from the imperative options interface; the
// shared MarkProps base contributes data and keeps the surface open (see
// markProps.ts for the openness rationale).
export interface TipProps extends MarkProps, TipOptions {}

// Registers the imperative Tip mark with the enclosing <Plot>; Plot's
// MarkSlot detects pointer-consumer marks and routes their rendering
// through PointerContext (see ./PointerContext.tsx). With no pointer hover,
// Tip renders an empty `<g aria-label="tip">` group; on hover, MarkSlot
// substitutes the selected datum's index and tip.renderJSX produces the
// tooltip content.
export function Tip({data, ...options}: TipProps) {
  useMark({name: "tip", data, options, create: tip});
  return null;
}

// Utility: format a tooltip's content from a datum
export function formatTip(datum: any, channels?: string[]): string[] {
  if (datum == null) return [];
  const lines: string[] = [];
  if (typeof datum === "object") {
    const keys = channels ?? Object.keys(datum);
    for (const key of keys) {
      const value = datum[key];
      if (value != null) {
        lines.push(`${key}: ${formatDefault(value)}`);
      }
    }
  } else {
    lines.push(`${formatDefault(datum)}`);
  }
  return lines;
}
