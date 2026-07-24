import {useMark} from "../useMark.js";
import {hexgrid} from "../../marks/hexgrid.js";

export function Hexgrid(options: any = {}) {
  useMark({name: "hexgrid", options, create: (_data, o) => hexgrid(o)});
  return null;
}
