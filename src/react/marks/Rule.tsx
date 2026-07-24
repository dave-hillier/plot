import {useMark} from "../useMark.js";
import type {MarkProps} from "../markProps.js";
import {ruleX, ruleY} from "../../marks/rule.js";
import type {RuleXOptions, RuleYOptions} from "../../marks/rule.js";

// Mark-specific options come from the imperative options interface; the
// shared MarkProps base contributes data and keeps the surface open (see
// markProps.ts for the openness rationale).
export interface RuleXProps extends MarkProps, RuleXOptions {}

export interface RuleYProps extends MarkProps, RuleYOptions {}

export function RuleX({data, ...options}: RuleXProps) {
  useMark({name: "ruleX", data, options, create: ruleX});
  return null;
}

export function RuleY({data, ...options}: RuleYProps) {
  useMark({name: "ruleY", data, options, create: ruleY});
  return null;
}
