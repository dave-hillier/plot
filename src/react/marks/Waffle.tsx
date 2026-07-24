import {useMark} from "../useMark.js";
import {waffleX, waffleY} from "../../marks/waffle.js";

export interface WaffleProps {
  data?: any;
  [key: string]: any;
}

export function WaffleX({data, ...options}: WaffleProps) {
  useMark({name: "waffleX", data, options, create: waffleX});
  return null;
}

export function WaffleY({data, ...options}: WaffleProps) {
  useMark({name: "waffleY", data, options, create: waffleY});
  return null;
}
