import {useMark} from "../useMark.js";
import type {MarkProps} from "../markProps.js";
import {image} from "../../marks/image.js";
import type {ImageOptions} from "../../marks/image.js";

// Mark-specific options come from the imperative options interface; the
// shared MarkProps base contributes data and keeps the surface open (see
// markProps.ts for the openness rationale).
export interface ImageProps extends MarkProps, ImageOptions {}

export function Image({data, ...options}: ImageProps) {
  useMark({name: "image", data, options, create: image});
  return null;
}
