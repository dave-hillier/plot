import {useMark, stampOptions} from "../useMark.js";
import {auto} from "../../marks/auto.js";

export interface AutoProps {
  data?: any;
  [key: string]: any;
}

export function Auto({data, ...options}: AutoProps) {
  useMark({stamp: stampOptions("auto", data, options), factory: () => auto(data, options)});
  return null;
}
