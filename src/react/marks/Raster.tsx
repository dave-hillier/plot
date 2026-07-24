import {useMark} from "../useMark.js";
import {raster} from "../../marks/raster.js";

export interface RasterProps {
  data?: any;
  [key: string]: any;
}

export function Raster({data, ...options}: RasterProps) {
  useMark({name: "raster", data, options, create: raster});
  return null;
}
