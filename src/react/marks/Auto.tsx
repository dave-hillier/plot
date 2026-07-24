import {useMark} from "../useMark.js";
import {auto} from "../../marks/auto.js";

export interface AutoProps {
  data?: any;
  [key: string]: any;
}

export function Auto({data, ...options}: AutoProps) {
  useMark({name: "auto", data, options, create: auto});
  return null;
}
