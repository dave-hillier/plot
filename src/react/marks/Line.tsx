import {useMark, stampOptions} from "../useMark.js";
import {line, lineX, lineY} from "../../marks/line.js";

export interface LineProps {
  data?: any;
  [key: string]: any;
}

export function Line({data, ...options}: LineProps) {
  useMark({stamp: stampOptions("line", data, options), factory: () => line(data, options)});
  return null;
}

export function LineX({data, ...options}: LineProps) {
  useMark({stamp: stampOptions("lineX", data, options), factory: () => lineX(data, options)});
  return null;
}

export function LineY({data, ...options}: LineProps) {
  useMark({stamp: stampOptions("lineY", data, options), factory: () => lineY(data, options)});
  return null;
}
