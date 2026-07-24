import {useMark} from "../useMark.js";
import {hexgrid} from "../../marks/hexgrid.js";
import type {HexgridOptions} from "../../marks/hexgrid.js";

// Hexgrid takes no data (it decorates the frame), so HexgridProps builds on
// the imperative options interface directly rather than on MarkProps; the
// index signature keeps the surface open for the reasons documented in
// markProps.ts.
export interface HexgridProps extends HexgridOptions {
  [option: string]: unknown;
}

export function Hexgrid(options: HexgridProps = {}) {
  useMark({name: "hexgrid", options, create: (_data, o) => hexgrid(o)});
  return null;
}
