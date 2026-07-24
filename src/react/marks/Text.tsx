import {useMark} from "../useMark.js";
import {text, textX, textY} from "../../marks/text.js";

export interface TextProps {
  data?: any;
  [key: string]: any;
}

export function Text({data, ...options}: TextProps) {
  useMark({name: "text", data, options, create: text});
  return null;
}

export function TextX({data, ...options}: TextProps) {
  useMark({name: "textX", data, options, create: textX});
  return null;
}

export function TextY({data, ...options}: TextProps) {
  useMark({name: "textY", data, options, create: textY});
  return null;
}
