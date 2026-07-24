import {useMark} from "../useMark.js";
import {boxX, boxY} from "../../marks/box.js";

export interface BoxProps {
  data?: any;
  [key: string]: any;
}

export function BoxX({data, ...options}: BoxProps) {
  useMark({name: "boxX", data, options, create: boxX});
  return null;
}

export function BoxY({data, ...options}: BoxProps) {
  useMark({name: "boxY", data, options, create: boxY});
  return null;
}
