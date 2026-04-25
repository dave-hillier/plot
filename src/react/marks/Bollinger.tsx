import {useMark, stampOptions} from "../useMark.js";
import {bollingerX, bollingerY} from "../../marks/bollinger.js";

export interface BollingerProps {
  data?: any;
  [key: string]: any;
}

export function BollingerX({data, ...options}: BollingerProps) {
  useMark({stamp: stampOptions("bollingerX", data, options), factory: () => bollingerX(data, options)});
  return null;
}

export function BollingerY({data, ...options}: BollingerProps) {
  useMark({stamp: stampOptions("bollingerY", data, options), factory: () => bollingerY(data, options)});
  return null;
}
