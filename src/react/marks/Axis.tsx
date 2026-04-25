import {useMark, stampOptions} from "../useMark.js";
import {axisX, axisY, axisFx, axisFy, gridX, gridY, gridFx, gridFy} from "../../marks/axis.js";

export function AxisX(options: any = {}) {
  useMark({stamp: stampOptions("axisX", null, options), factory: () => axisX(options)});
  return null;
}

export function AxisY(options: any = {}) {
  useMark({stamp: stampOptions("axisY", null, options), factory: () => axisY(options)});
  return null;
}

export function AxisFx(options: any = {}) {
  useMark({stamp: stampOptions("axisFx", null, options), factory: () => axisFx(options)});
  return null;
}

export function AxisFy(options: any = {}) {
  useMark({stamp: stampOptions("axisFy", null, options), factory: () => axisFy(options)});
  return null;
}

export function GridX(options: any = {}) {
  useMark({stamp: stampOptions("gridX", null, options), factory: () => gridX(options)});
  return null;
}

export function GridY(options: any = {}) {
  useMark({stamp: stampOptions("gridY", null, options), factory: () => gridY(options)});
  return null;
}

export function GridFx(options: any = {}) {
  useMark({stamp: stampOptions("gridFx", null, options), factory: () => gridFx(options)});
  return null;
}

export function GridFy(options: any = {}) {
  useMark({stamp: stampOptions("gridFy", null, options), factory: () => gridFy(options)});
  return null;
}
