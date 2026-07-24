import {useMark} from "../useMark.js";
import type {MarkProps} from "../markProps.js";
import {text, textX, textY} from "../../marks/text.js";
import type {TextOptions, TextXOptions, TextYOptions} from "../../marks/text.js";

// Mark-specific options come from the imperative options interface; the
// shared MarkProps base contributes data and keeps the surface open (see
// markProps.ts for the openness rationale).
export interface TextProps extends MarkProps, TextOptions {}

export interface TextXProps extends MarkProps, TextXOptions {}

export interface TextYProps extends MarkProps, TextYOptions {}

export function Text({data, ...options}: TextProps) {
  useMark({name: "text", data, options, create: text});
  return null;
}

export function TextX({data, ...options}: TextXProps) {
  useMark({name: "textX", data, options, create: textX});
  return null;
}

export function TextY({data, ...options}: TextYProps) {
  useMark({name: "textY", data, options, create: textY});
  return null;
}
