import {useMark} from "../useMark.js";
import {line, lineX, lineY} from "../../marks/line.js";

export interface LineProps {
  data?: any;
  [key: string]: any;
}

export function Line({data, ...options}: LineProps) {
  useMark({name: "line", data, options, create: line});
  return null;
}

export function LineX({data, ...options}: LineProps) {
  useMark({name: "lineX", data, options, create: lineX});
  return null;
}

export function LineY({data, ...options}: LineProps) {
  useMark({name: "lineY", data, options, create: lineY});
  return null;
}
