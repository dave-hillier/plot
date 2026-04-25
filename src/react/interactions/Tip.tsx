import {useMark, stampOptions} from "../useMark.js";
import {tip} from "../../marks/tip.js";
import {formatDefault} from "../../core/index.js";

export interface TipProps {
  data?: any;
  [key: string]: any;
}

export function Tip({data, ...options}: TipProps) {
  useMark({
    stamp: stampOptions("tip", data, options),
    factory: () => tip(data, options)
  });
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
