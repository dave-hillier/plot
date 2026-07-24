import {useMark} from "../useMark.js";
import type {MarkProps} from "../markProps.js";
import {tickX, tickY} from "../../marks/tick.js";
import type {TickXOptions, TickYOptions} from "../../marks/tick.js";

// Mark-specific options come from the imperative options interface; the
// shared MarkProps base contributes data and keeps the surface open (see
// markProps.ts for the openness rationale).
export interface TickXProps extends MarkProps, TickXOptions {}

export interface TickYProps extends MarkProps, TickYOptions {}

export function TickX({data, ...options}: TickXProps) {
  useMark({name: "tickX", data, options, create: tickX});
  return null;
}

export function TickY({data, ...options}: TickYProps) {
  useMark({name: "tickY", data, options, create: tickY});
  return null;
}
