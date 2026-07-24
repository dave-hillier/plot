import {useMark} from "../useMark.js";
import {arrow} from "../../marks/arrow.js";

export interface ArrowProps {
  data?: any;
  [key: string]: any;
}

export function Arrow({data, ...options}: ArrowProps) {
  useMark({name: "arrow", data, options, create: arrow});
  return null;
}
