import {useMark} from "../useMark.js";
import {barX, barY} from "../../marks/bar.js";

export interface BarProps {
  data?: any;
  [key: string]: any;
}

export function BarX({data, ...options}: BarProps) {
  useMark({name: "barX", data, options, create: barX});
  return null;
}

export function BarY({data, ...options}: BarProps) {
  useMark({name: "barY", data, options, create: barY});
  return null;
}
