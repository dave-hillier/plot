import {useMark, stampOptions} from "../useMark.js";
import {crosshair, crosshairX, crosshairY} from "../../marks/crosshair.js";

export interface CrosshairProps {
  data?: any;
  [key: string]: any;
}

export function Crosshair({data, ...options}: CrosshairProps) {
  useMark({
    stamp: stampOptions("crosshair", data, options),
    factory: () => crosshair(data, options)
  });
  return null;
}

export function CrosshairX({data, ...options}: CrosshairProps) {
  useMark({
    stamp: stampOptions("crosshairX", data, options),
    factory: () => crosshairX(data, options)
  });
  return null;
}

export function CrosshairY({data, ...options}: CrosshairProps) {
  useMark({
    stamp: stampOptions("crosshairY", data, options),
    factory: () => crosshairY(data, options)
  });
  return null;
}
