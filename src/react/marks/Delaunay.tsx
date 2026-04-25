import {useMark, stampOptions} from "../useMark.js";
// @ts-expect-error — JS module without .d.ts
import {delaunayLink, delaunayMesh, hull, voronoi, voronoiMesh} from "../../marks/delaunay.js";

export interface DelaunayProps {
  data?: any;
  [key: string]: any;
}

export function DelaunayLink({data, ...options}: DelaunayProps) {
  useMark({stamp: stampOptions("delaunayLink", data, options), factory: () => delaunayLink(data, options)});
  return null;
}

export function DelaunayMesh({data, ...options}: DelaunayProps) {
  useMark({stamp: stampOptions("delaunayMesh", data, options), factory: () => delaunayMesh(data, options)});
  return null;
}

export function Hull({data, ...options}: DelaunayProps) {
  useMark({stamp: stampOptions("hull", data, options), factory: () => hull(data, options)});
  return null;
}

export function Voronoi({data, ...options}: DelaunayProps) {
  useMark({stamp: stampOptions("voronoi", data, options), factory: () => voronoi(data, options)});
  return null;
}

export function VoronoiMesh({data, ...options}: DelaunayProps) {
  useMark({stamp: stampOptions("voronoiMesh", data, options), factory: () => voronoiMesh(data, options)});
  return null;
}
