import {useMark} from "../useMark.js";
import {linearRegressionX, linearRegressionY} from "../../marks/linearRegression.js";

export interface LinearRegressionProps {
  data?: any;
  [key: string]: any;
}

export function LinearRegressionX({data, ...options}: LinearRegressionProps) {
  useMark({name: "linearRegressionX", data, options, create: linearRegressionX});
  return null;
}

export function LinearRegressionY({data, ...options}: LinearRegressionProps) {
  useMark({name: "linearRegressionY", data, options, create: linearRegressionY});
  return null;
}
