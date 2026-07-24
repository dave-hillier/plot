import {useMark} from "../useMark.js";
import {density} from "../../marks/density.js";

export interface DensityProps {
  data?: any;
  [key: string]: any;
}

export function Density({data, ...options}: DensityProps) {
  useMark({name: "density", data, options, create: density});
  return null;
}
