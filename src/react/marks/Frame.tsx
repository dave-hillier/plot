import {useMark} from "../useMark.js";
import {frame} from "../../marks/frame.js";

export interface FrameProps {
  [key: string]: any;
}

export function Frame(options: FrameProps = {}) {
  useMark({name: "frame", options, create: (_data, o) => frame(o)});
  return null;
}
