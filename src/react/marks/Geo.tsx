import {useMark} from "../useMark.js";
import {geo, sphere, graticule} from "../../marks/geo.js";

export function Geo({data, ...options}: any) {
  useMark({name: "geo", data, options, create: geo});
  return null;
}

export function Sphere(options: any) {
  useMark({name: "sphere", options, create: (_data, o) => sphere(o)});
  return null;
}

export function Graticule(options: any) {
  useMark({name: "graticule", options, create: (_data, o) => graticule(o)});
  return null;
}
