import {useMark, stampOptions} from "../useMark.js";
import {linearRegressionX, linearRegressionY} from "../../marks/linearRegression.js";

export interface LinearRegressionProps {
  data?: any;
  [key: string]: any;
}

export function LinearRegressionX({data, ...options}: LinearRegressionProps) {
  useMark({stamp: stampOptions("linearRegressionX", data, options), factory: () => linearRegressionX(data, options)});
  return null;
}

export function LinearRegressionY({data, ...options}: LinearRegressionProps) {
  useMark({stamp: stampOptions("linearRegressionY", data, options), factory: () => linearRegressionY(data, options)});
  return null;
}
