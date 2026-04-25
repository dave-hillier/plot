import {useMark, stampOptions} from "../useMark.js";
import {area, areaX, areaY} from "../../marks/area.js";

export interface AreaProps {
  data?: any;
  [key: string]: any;
}

export function Area({data, ...options}: AreaProps) {
  useMark({stamp: stampOptions("area", data, options), factory: () => area(data, options)});
  return null;
}

export function AreaX({data, ...options}: AreaProps) {
  useMark({stamp: stampOptions("areaX", data, options), factory: () => areaX(data, options)});
  return null;
}

export function AreaY({data, ...options}: AreaProps) {
  useMark({stamp: stampOptions("areaY", data, options), factory: () => areaY(data, options)});
  return null;
}
