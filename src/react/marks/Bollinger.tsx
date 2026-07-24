import {useMark} from "../useMark.js";
import type {MarkProps} from "../markProps.js";
import {bollingerX, bollingerY} from "../../marks/bollinger.js";
import type {BollingerXOptions, BollingerYOptions} from "../../marks/bollinger.js";

// Mark-specific options come from the imperative options interface; the
// shared MarkProps base contributes data and keeps the surface open (see
// markProps.ts for the openness rationale).
export interface BollingerXProps extends MarkProps, BollingerXOptions {}

export interface BollingerYProps extends MarkProps, BollingerYOptions {}

export function BollingerX({data, ...options}: BollingerXProps) {
  useMark({name: "bollingerX", data, options, create: bollingerX});
  return null;
}

export function BollingerY({data, ...options}: BollingerYProps) {
  useMark({name: "bollingerY", data, options, create: bollingerY});
  return null;
}
