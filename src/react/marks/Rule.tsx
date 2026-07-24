import {useMark} from "../useMark.js";
import {ruleX, ruleY} from "../../marks/rule.js";

export interface RuleProps {
  data?: any;
  [key: string]: any;
}

export function RuleX({data, ...options}: RuleProps) {
  useMark({name: "ruleX", data, options, create: ruleX});
  return null;
}

export function RuleY({data, ...options}: RuleProps) {
  useMark({name: "ruleY", data, options, create: ruleY});
  return null;
}
