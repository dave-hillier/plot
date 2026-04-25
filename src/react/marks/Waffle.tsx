import {useMark, stampOptions} from "../useMark.js";
// @ts-expect-error — JS module without .d.ts
import {waffleX, waffleY} from "../../marks/waffle.js";

export interface WaffleProps {
  data?: any;
  [key: string]: any;
}

export function WaffleX({data, ...options}: WaffleProps) {
  useMark({stamp: stampOptions("waffleX", data, options), factory: () => waffleX(data, options)});
  return null;
}

export function WaffleY({data, ...options}: WaffleProps) {
  useMark({stamp: stampOptions("waffleY", data, options), factory: () => waffleY(data, options)});
  return null;
}
