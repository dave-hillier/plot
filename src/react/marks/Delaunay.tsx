import {useMark} from "../useMark.js";
import type {MarkProps} from "../markProps.js";
import {delaunayLink, delaunayMesh, hull, voronoi, voronoiMesh} from "../../marks/delaunay.js";
import type {DelaunayOptions} from "../../marks/delaunay.js";

// Mark-specific options come from the imperative options interface; the
// shared MarkProps base contributes data and keeps the surface open (see
// markProps.ts for the openness rationale).
export interface DelaunayProps extends MarkProps, DelaunayOptions {}

export function DelaunayLink({data, ...options}: DelaunayProps) {
  useMark({name: "delaunayLink", data, options, create: delaunayLink});
  return null;
}

export function DelaunayMesh({data, ...options}: DelaunayProps) {
  useMark({name: "delaunayMesh", data, options, create: delaunayMesh});
  return null;
}

export function Hull({data, ...options}: DelaunayProps) {
  useMark({name: "hull", data, options, create: hull});
  return null;
}

export function Voronoi({data, ...options}: DelaunayProps) {
  useMark({name: "voronoi", data, options, create: voronoi});
  return null;
}

export function VoronoiMesh({data, ...options}: DelaunayProps) {
  useMark({name: "voronoiMesh", data, options, create: voronoiMesh});
  return null;
}
