import type {GeoPermissibleObjects} from "d3";
import {useMark} from "../useMark.js";
import type {Data} from "../../mark.js";
import {geo, sphere, graticule} from "../../marks/geo.js";
import type {GeoOptions} from "../../marks/geo.js";

// Geo accepts a bare GeoJSON object as data in addition to the usual Data
// forms, matching the imperative geo signature, so GeoProps builds on the
// imperative options interface directly rather than on MarkProps; the index
// signature keeps the surface open for the reasons documented in markProps.ts.
export interface GeoProps extends GeoOptions {
  data?: Data | GeoPermissibleObjects;
  [option: string]: unknown;
}

// Sphere and graticule take no data (their geometry is implicit), so their
// props build on the imperative options interface directly rather than on
// MarkProps.
export interface SphereProps extends GeoOptions {
  [option: string]: unknown;
}

export interface GraticuleProps extends GeoOptions {
  [option: string]: unknown;
}

export function Geo({data, ...options}: GeoProps) {
  useMark({name: "geo", data, options, create: geo});
  return null;
}

export function Sphere(options: SphereProps = {}) {
  useMark({name: "sphere", options, create: (_data, o) => sphere(o)});
  return null;
}

export function Graticule(options: GraticuleProps = {}) {
  useMark({name: "graticule", options, create: (_data, o) => graticule(o)});
  return null;
}
