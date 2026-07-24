import {useMark} from "../useMark.js";
import {bollingerX, bollingerY} from "../../marks/bollinger.js";

export interface BollingerProps {
  data?: any;
  [key: string]: any;
}

export function BollingerX({data, ...options}: BollingerProps) {
  useMark({name: "bollingerX", data, options, create: bollingerX});
  return null;
}

export function BollingerY({data, ...options}: BollingerProps) {
  useMark({name: "bollingerY", data, options, create: bollingerY});
  return null;
}
