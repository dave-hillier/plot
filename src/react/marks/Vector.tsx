import {useMark} from "../useMark.js";
import {vector, vectorX, vectorY, spike} from "../../marks/vector.js";

export interface VectorProps {
  data?: any;
  [key: string]: any;
}

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
