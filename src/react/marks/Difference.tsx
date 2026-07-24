import {useMark} from "../useMark.js";
import {differenceX, differenceY} from "../../marks/difference.js";

export interface DifferenceProps {
  data?: any;
  [key: string]: any;
}

export function DifferenceX({data, ...options}: DifferenceProps) {
  useMark({name: "differenceX", data, options, create: differenceX});
  return null;
}

export function DifferenceY({data, ...options}: DifferenceProps) {
  useMark({name: "differenceY", data, options, create: differenceY});
  return null;
}
