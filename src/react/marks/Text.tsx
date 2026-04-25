import {useMark, stampOptions} from "../useMark.js";
import {text, textX, textY} from "../../marks/text.js";

export interface TextProps {
  data?: any;
  [key: string]: any;
}

export function Text({data, ...options}: TextProps) {
  useMark({stamp: stampOptions("text", data, options), factory: () => text(data, options)});
  return null;
}

export function TextX({data, ...options}: TextProps) {
  useMark({stamp: stampOptions("textX", data, options), factory: () => textX(data, options)});
  return null;
}

export function TextY({data, ...options}: TextProps) {
  useMark({stamp: stampOptions("textY", data, options), factory: () => textY(data, options)});
  return null;
}
