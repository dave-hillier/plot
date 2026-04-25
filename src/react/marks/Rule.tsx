import {useMark, stampOptions} from "../useMark.js";
import {ruleX, ruleY} from "../../marks/rule.js";

export interface RuleProps {
  data?: any;
  [key: string]: any;
}

export function RuleX({data, ...options}: RuleProps) {
  useMark({
    stamp: stampOptions("ruleX", data, options),
    factory: () => ruleX(data, options)
  });
  return null;
}

export function RuleY({data, ...options}: RuleProps) {
  useMark({
    stamp: stampOptions("ruleY", data, options),
    factory: () => ruleY(data, options)
  });
  return null;
}
