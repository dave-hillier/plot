import {useMark} from "../useMark.js";
import type {MarkProps} from "../markProps.js";
import {cluster, tree} from "../../marks/tree.js";
import type {TreeOptions} from "../../marks/tree.js";

// Mark-specific options come from the imperative options interface; the
// shared MarkProps base contributes data and keeps the surface open (see
// markProps.ts for the openness rationale).
export interface TreeProps extends MarkProps, TreeOptions {}

export function TreeMark({data, ...options}: TreeProps) {
  useMark({name: "tree", data, options, create: tree});
  return null;
}

export function ClusterMark({data, ...options}: TreeProps) {
  useMark({name: "cluster", data, options, create: cluster});
  return null;
}
