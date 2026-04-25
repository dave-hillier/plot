import {useMark, stampOptions} from "../useMark.js";
import {frame} from "../../marks/frame.js";

export interface FrameProps {
  [key: string]: any;
}

export function Frame(options: FrameProps = {}) {
  useMark({
    stamp: stampOptions("frame", null, options),
    factory: () => frame(options)
  });
  return null;
}
