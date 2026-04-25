import {useMark, stampOptions} from "../useMark.js";
import {hexgrid} from "../../marks/hexgrid.js";

export function Hexgrid(options: any = {}) {
  useMark({stamp: stampOptions("hexgrid", null, options), factory: () => hexgrid(options)});
  return null;
}
