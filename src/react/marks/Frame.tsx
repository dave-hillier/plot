import {useMark} from "../useMark.js";
import {frame} from "../../marks/frame.js";
import type {FrameOptions} from "../../marks/frame.js";

// Frame takes no data, so FrameProps builds on the imperative options
// interface directly rather than on MarkProps; the index signature keeps the
// surface open for the reasons documented in markProps.ts.
export interface FrameProps extends FrameOptions {
  [option: string]: unknown;
}

export function Frame(options: FrameProps = {}) {
  useMark({name: "frame", options, create: (_data, o) => frame(o)});
  return null;
}
