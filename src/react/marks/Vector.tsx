import {useMark} from "../useMark.js";
import type {MarkProps} from "../markProps.js";
import {vector, vectorX, vectorY, spike} from "../../marks/vector.js";
import type {VectorOptions} from "../../marks/vector.js";

// Mark-specific options come from the imperative options interface; the
// shared MarkProps base contributes data and keeps the surface open (see
// markProps.ts for the openness rationale).
export interface VectorProps extends MarkProps, VectorOptions {}

export function Vector({data, ...options}: VectorProps) {
  useMark({name: "vector", data, options, create: vector});
  return null;
}

export function VectorX({data, ...options}: VectorProps) {
  useMark({name: "vectorX", data, options, create: vectorX});
  return null;
}

export function VectorY({data, ...options}: VectorProps) {
  useMark({name: "vectorY", data, options, create: vectorY});
  return null;
}

export function Spike({data, ...options}: VectorProps) {
  useMark({name: "spike", data, options, create: spike});
  return null;
}
