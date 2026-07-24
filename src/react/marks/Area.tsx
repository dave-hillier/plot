import {useMark} from "../useMark.js";
import {area, areaX, areaY} from "../../marks/area.js";

export interface AreaProps {
  data?: any;
  [key: string]: any;
}

export function Area({data, ...options}: AreaProps) {
  useMark({name: "area", data, options, create: (d, o) => (Object.keys(o).length > 0 ? area(d, o) : area(d))});
  return null;
}

export function AreaX({data, ...options}: AreaProps) {
  useMark({name: "areaX", data, options, create: areaX});
  return null;
}

export function AreaY({data, ...options}: AreaProps) {
  useMark({name: "areaY", data, options, create: areaY});
  return null;
}
