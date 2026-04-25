import {useMark, stampOptions} from "../useMark.js";
import {boxX, boxY} from "../../marks/box.js";

export interface BoxProps {
  data?: any;
  [key: string]: any;
}

export function BoxX({data, ...options}: BoxProps) {
  useMark({stamp: stampOptions("boxX", data, options), factory: () => boxX(data, options)});
  return null;
}

export function BoxY({data, ...options}: BoxProps) {
  useMark({stamp: stampOptions("boxY", data, options), factory: () => boxY(data, options)});
  return null;
}
