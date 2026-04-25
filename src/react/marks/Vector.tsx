import {useMark, stampOptions} from "../useMark.js";
import {vector, vectorX, vectorY, spike} from "../../marks/vector.js";

export interface VectorProps {
  data?: any;
  [key: string]: any;
}

export function Vector({data, ...options}: VectorProps) {
  useMark({stamp: stampOptions("vector", data, options), factory: () => vector(data, options)});
  return null;
}

export function VectorX({data, ...options}: VectorProps) {
  useMark({stamp: stampOptions("vectorX", data, options), factory: () => vectorX(data, options)});
  return null;
}

export function VectorY({data, ...options}: VectorProps) {
  useMark({stamp: stampOptions("vectorY", data, options), factory: () => vectorY(data, options)});
  return null;
}

export function Spike({data, ...options}: VectorProps) {
  useMark({stamp: stampOptions("spike", data, options), factory: () => spike(data, options)});
  return null;
}
