import {useMark} from "../useMark.js";
import {contour} from "../../marks/contour.js";

export interface ContourProps {
  data?: any;
  [key: string]: any;
}

export function Contour({data, ...options}: ContourProps) {
  useMark({name: "contour", data, options, create: contour});
  return null;
}
