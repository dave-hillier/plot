import {useMark, stampOptions} from "../useMark.js";
import {link} from "../../marks/link.js";

export interface LinkProps {
  data?: any;
  [key: string]: any;
}

export function Link({data, ...options}: LinkProps) {
  useMark({stamp: stampOptions("link", data, options), factory: () => link(data, options)});
  return null;
}
