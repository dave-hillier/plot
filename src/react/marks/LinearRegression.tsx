import {useMark} from "../useMark.js";
import type {MarkProps} from "../markProps.js";
import {linearRegressionX, linearRegressionY} from "../../marks/linearRegression.js";
import type {LinearRegressionXOptions, LinearRegressionYOptions} from "../../marks/linearRegression.js";

// Mark-specific options come from the imperative options interface; the
// shared MarkProps base contributes data and keeps the surface open (see
// markProps.ts for the openness rationale).
export interface LinearRegressionXProps extends MarkProps, LinearRegressionXOptions {}

export interface LinearRegressionYProps extends MarkProps, LinearRegressionYOptions {}

export function LinearRegressionX({data, ...options}: LinearRegressionXProps) {
  useMark({name: "linearRegressionX", data, options, create: linearRegressionX});
  return null;
}

export function LinearRegressionY({data, ...options}: LinearRegressionYProps) {
  useMark({name: "linearRegressionY", data, options, create: linearRegressionY});
  return null;
}
