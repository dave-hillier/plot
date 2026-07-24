import {useMark} from "../useMark.js";
import {link} from "../../marks/link.js";

export interface LinkProps {
  data?: any;
  [key: string]: any;
}

export function Link({data, ...options}: LinkProps) {
  useMark({name: "link", data, options, create: link});
  return null;
}
