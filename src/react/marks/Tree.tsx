import {useMark} from "../useMark.js";
import {cluster, tree} from "../../marks/tree.js";

export interface TreeProps {
  data?: any;
  [key: string]: any;
}

export function TreeMark({data, ...options}: TreeProps) {
  useMark({name: "tree", data, options, create: tree});
  return null;
}

export function ClusterMark({data, ...options}: TreeProps) {
  useMark({name: "cluster", data, options, create: cluster});
  return null;
}
