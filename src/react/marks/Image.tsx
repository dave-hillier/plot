import {useMark, stampOptions} from "../useMark.js";
import {image} from "../../marks/image.js";

export interface ImageProps {
  data?: any;
  [key: string]: any;
}

export function Image({data, ...options}: ImageProps) {
  useMark({stamp: stampOptions("image", data, options), factory: () => image(data, options)});
  return null;
}
