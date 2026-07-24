import {useMark} from "../useMark.js";
import type {MarkProps} from "../markProps.js";
import {link} from "../../marks/link.js";
import type {LinkOptions} from "../../marks/link.js";

// Mark-specific options come from the imperative options interface; the
// shared MarkProps base contributes data and keeps the surface open (see
// markProps.ts for the openness rationale).
export interface LinkProps extends MarkProps, LinkOptions {}

export function Link({data, ...options}: LinkProps) {
  useMark({name: "link", data, options, create: link});
  return null;
}
