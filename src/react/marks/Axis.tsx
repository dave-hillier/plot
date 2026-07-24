import {useMark} from "../useMark.js";
import {axisX, axisY, axisFx, axisFy, gridX, gridY, gridFx, gridFy} from "../../marks/axis.js";

export function AxisX(options: any = {}) {
  useMark({name: "axisX", options, create: (_data, o) => axisX(o)});
  return null;
}

export function AxisY(options: any = {}) {
  useMark({name: "axisY", options, create: (_data, o) => axisY(o)});
  return null;
}

export function AxisFx(options: any = {}) {
  useMark({name: "axisFx", options, create: (_data, o) => axisFx(o)});
  return null;
}

export function AxisFy(options: any = {}) {
  useMark({name: "axisFy", options, create: (_data, o) => axisFy(o)});
  return null;
}

export function GridX(options: any = {}) {
  useMark({name: "gridX", options, create: (_data, o) => gridX(o)});
  return null;
}

export function GridY(options: any = {}) {
  useMark({name: "gridY", options, create: (_data, o) => gridY(o)});
  return null;
}

export function GridFx(options: any = {}) {
  useMark({name: "gridFx", options, create: (_data, o) => gridFx(o)});
  return null;
}

export function GridFy(options: any = {}) {
  useMark({name: "gridFy", options, create: (_data, o) => gridFy(o)});
  return null;
}
