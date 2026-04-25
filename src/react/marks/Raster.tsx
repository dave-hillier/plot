import {useMark, stampOptions} from "../useMark.js";
import {raster} from "../../marks/raster.js";

export interface RasterProps {
  data?: any;
  [key: string]: any;
}

export function Raster({data, ...options}: RasterProps) {
  useMark({stamp: stampOptions("raster", data, options), factory: () => raster(data, options)});
  return null;
}
