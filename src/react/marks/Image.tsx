import {useMark} from "../useMark.js";
import {image} from "../../marks/image.js";

export interface ImageProps {
  data?: any;
  [key: string]: any;
}

export function Image({data, ...options}: ImageProps) {
  useMark({name: "image", data, options, create: image});
  return null;
}
