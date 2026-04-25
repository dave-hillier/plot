import {useMark, stampOptions} from "../useMark.js";
import {geo, sphere, graticule} from "../../marks/geo.js";

export function Geo({data, ...options}: any) {
  useMark({stamp: stampOptions("geo", data, options), factory: () => geo(data, options)});
  return null;
}

export function Sphere(options: any) {
  useMark({stamp: stampOptions("sphere", null, options), factory: () => sphere(options)});
  return null;
}

export function Graticule(options: any) {
  useMark({stamp: stampOptions("graticule", null, options), factory: () => graticule(options)});
  return null;
}
