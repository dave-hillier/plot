import {useMark} from "../useMark.js";
import {tickX, tickY} from "../../marks/tick.js";

export interface TickProps {
  data?: any;
  [key: string]: any;
}

export function TickX({data, ...options}: TickProps) {
  useMark({name: "tickX", data, options, create: tickX});
  return null;
}

export function TickY({data, ...options}: TickProps) {
  useMark({name: "tickY", data, options, create: tickY});
  return null;
}
