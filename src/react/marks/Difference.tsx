import {useMark, stampOptions} from "../useMark.js";
import {differenceX, differenceY} from "../../marks/difference.js";

export interface DifferenceProps {
  data?: any;
  [key: string]: any;
}

export function DifferenceX({data, ...options}: DifferenceProps) {
  useMark({stamp: stampOptions("differenceX", data, options), factory: () => differenceX(data, options)});
  return null;
}

export function DifferenceY({data, ...options}: DifferenceProps) {
  useMark({stamp: stampOptions("differenceY", data, options), factory: () => differenceY(data, options)});
  return null;
}
