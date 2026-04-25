import {useMark, stampOptions} from "../useMark.js";
import {cluster, tree} from "../../marks/tree.js";

export interface TreeProps {
  data?: any;
  [key: string]: any;
}

export function TreeMark({data, ...options}: TreeProps) {
  useMark({stamp: stampOptions("tree", data, options), factory: () => tree(data, options)});
  return null;
}

export function ClusterMark({data, ...options}: TreeProps) {
  useMark({stamp: stampOptions("cluster", data, options), factory: () => cluster(data, options)});
  return null;
}
