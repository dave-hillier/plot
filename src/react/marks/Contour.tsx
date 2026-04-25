import {useMark, stampOptions} from "../useMark.js";
import {contour} from "../../marks/contour.js";

export interface ContourProps {
  data?: any;
  [key: string]: any;
}

export function Contour({data, ...options}: ContourProps) {
  useMark({stamp: stampOptions("contour", data, options), factory: () => contour(data, options)});
  return null;
}
