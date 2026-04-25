import {useMark, stampOptions} from "../useMark.js";
import {tickX, tickY} from "../../marks/tick.js";

export interface TickProps {
  data?: any;
  [key: string]: any;
}

export function TickX({data, ...options}: TickProps) {
  useMark({
    stamp: stampOptions("tickX", data, options),
    factory: () => tickX(data, options)
  });
  return null;
}

export function TickY({data, ...options}: TickProps) {
  useMark({
    stamp: stampOptions("tickY", data, options),
    factory: () => tickY(data, options)
  });
  return null;
}
