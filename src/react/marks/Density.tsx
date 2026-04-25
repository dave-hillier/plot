import {useMark, stampOptions} from "../useMark.js";
import {density} from "../../marks/density.js";

export interface DensityProps {
  data?: any;
  [key: string]: any;
}

export function Density({data, ...options}: DensityProps) {
  useMark({stamp: stampOptions("density", data, options), factory: () => density(data, options)});
  return null;
}
