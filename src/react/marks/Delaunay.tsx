import {useMark} from "../useMark.js";
import {delaunayLink, delaunayMesh, hull, voronoi, voronoiMesh} from "../../marks/delaunay.js";

export interface DelaunayProps {
  data?: any;
  [key: string]: any;
}

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
