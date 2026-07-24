import {useMark} from "../useMark.js";
import {axisX, axisY, axisFx, axisFy, gridX, gridY, gridFx, gridFy} from "../../marks/axis.js";
import type {AxisXOptions, AxisYOptions, GridXOptions, GridYOptions} from "../../marks/axis.js";

// Axis and grid components take options only (tick data is derived from the
// scale), so their props build on the imperative options interfaces directly
// rather than on MarkProps; the index signature keeps the surface open for
// the reasons documented in markProps.ts. The facet variants share the x/y
// options interfaces, matching the imperative axisFx/axisFy/gridFx/gridFy
// signatures.
export interface AxisXProps extends AxisXOptions {
  [option: string]: unknown;
}

export interface AxisYProps extends AxisYOptions {
  [option: string]: unknown;
}

export interface GridXProps extends GridXOptions {
  [option: string]: unknown;
}

export interface GridYProps extends GridYOptions {
  [option: string]: unknown;
}

export function AxisX(options: AxisXProps = {}) {
  useMark({name: "axisX", options, create: (_data, o) => axisX(o)});
  return null;
}

export function AxisY(options: AxisYProps = {}) {
  useMark({name: "axisY", options, create: (_data, o) => axisY(o)});
  return null;
}

export function AxisFx(options: AxisXProps = {}) {
  useMark({name: "axisFx", options, create: (_data, o) => axisFx(o)});
  return null;
}

export function AxisFy(options: AxisYProps = {}) {
  useMark({name: "axisFy", options, create: (_data, o) => axisFy(o)});
  return null;
}

export function GridX(options: GridXProps = {}) {
  useMark({name: "gridX", options, create: (_data, o) => gridX(o)});
  return null;
}

export function GridY(options: GridYProps = {}) {
  useMark({name: "gridY", options, create: (_data, o) => gridY(o)});
  return null;
}

export function GridFx(options: GridXProps = {}) {
  useMark({name: "gridFx", options, create: (_data, o) => gridFx(o)});
  return null;
}

export function GridFy(options: GridYProps = {}) {
  useMark({name: "gridFy", options, create: (_data, o) => gridFy(o)});
  return null;
}
