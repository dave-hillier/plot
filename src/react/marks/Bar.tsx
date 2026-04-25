import {useMark, stampOptions} from "../useMark.js";
import {barX, barY} from "../../marks/bar.js";

export interface BarProps {
  data?: any;
  [key: string]: any;
}

export function BarX({data, ...options}: BarProps) {
  useMark({stamp: stampOptions("barX", data, options), factory: () => barX(data, options)});
  return null;
}

export function BarY({data, ...options}: BarProps) {
  useMark({stamp: stampOptions("barY", data, options), factory: () => barY(data, options)});
  return null;
}
