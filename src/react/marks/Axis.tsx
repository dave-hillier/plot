import {useMark} from "../useMark.js";
import {axisX, axisY, axisFx, axisFy, gridX, gridY, gridFx, gridFy} from "../../marks/axis.js";
import type {AxisXOptions, AxisYOptions, GridXOptions, GridYOptions} from "../../marks/axis.js";
import type {Data} from "../../mark.js";

// Axis and grid components take options plus optional tick data (when data is
// omitted, tick values are derived from the scale), so their props build on
// the imperative options interfaces directly rather than on MarkProps; the
// index signature keeps the surface open for the reasons documented in
// markProps.ts. The facet variants share the x/y options interfaces, matching
// the imperative axisFx/axisFy/gridFx/gridFy signatures.
export interface AxisXProps extends AxisXOptions {
  data?: Data;
  [option: string]: unknown;
}

export interface AxisYProps extends AxisYOptions {
  data?: Data;
  [option: string]: unknown;
}

export interface GridXProps extends GridXOptions {
  data?: Data;
  [option: string]: unknown;
}

export interface GridYProps extends GridYOptions {
  data?: Data;
  [option: string]: unknown;
}

export function AxisX({data, ...options}: AxisXProps = {}) {
  useMark({name: "axisX", data, options, create: (d, o) => axisX(d, o)});
  return null;
}

export function AxisY({data, ...options}: AxisYProps = {}) {
  useMark({name: "axisY", data, options, create: (d, o) => axisY(d, o)});
  return null;
}

export function AxisFx({data, ...options}: AxisXProps = {}) {
  useMark({name: "axisFx", data, options, create: (d, o) => axisFx(d, o)});
  return null;
}

export function AxisFy({data, ...options}: AxisYProps = {}) {
  useMark({name: "axisFy", data, options, create: (d, o) => axisFy(d, o)});
  return null;
}

export function GridX({data, ...options}: GridXProps = {}) {
  useMark({name: "gridX", data, options, create: (d, o) => gridX(d, o)});
  return null;
}

export function GridY({data, ...options}: GridYProps = {}) {
  useMark({name: "gridY", data, options, create: (d, o) => gridY(d, o)});
  return null;
}

export function GridFx({data, ...options}: GridXProps = {}) {
  useMark({name: "gridFx", data, options, create: (d, o) => gridFx(d, o)});
  return null;
}

export function GridFy({data, ...options}: GridYProps = {}) {
  useMark({name: "gridFy", data, options, create: (d, o) => gridFy(d, o)});
  return null;
}
