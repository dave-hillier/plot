import {useMark, stampOptions} from "../useMark.js";
import {arrow} from "../../marks/arrow.js";

export interface ArrowProps {
  data?: any;
  [key: string]: any;
}

export function Arrow({data, ...options}: ArrowProps) {
  useMark({stamp: stampOptions("arrow", data, options), factory: () => arrow(data, options)});
  return null;
}
