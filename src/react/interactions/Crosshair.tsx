import {useMark} from "../useMark.js";
import {crosshair, crosshairX, crosshairY} from "../../marks/crosshair.js";

export interface CrosshairProps {
  data?: any;
  [key: string]: any;
}

export function Crosshair({data, ...options}: CrosshairProps) {
  useMark({name: "crosshair", data, options, create: crosshair});
  return null;
}

export function CrosshairX({data, ...options}: CrosshairProps) {
  useMark({name: "crosshairX", data, options, create: crosshairX});
  return null;
}

export function CrosshairY({data, ...options}: CrosshairProps) {
  useMark({name: "crosshairY", data, options, create: crosshairY});
  return null;
}
