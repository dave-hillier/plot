import {legend} from "../../src/react/index.js";

export function opacityLegend() {
  return legend({opacity: {domain: [0, 10], label: "Quantitative"}});
}

export function opacityLegendRange() {
  return legend({opacity: {domain: [0, 1], range: [0.5, 1], label: "Range"}});
}

export function opacityLegendLinear() {
  return legend({opacity: {type: "linear", domain: [0, 10], label: "Linear"}});
}

export function opacityLegendColor() {
  return legend({opacity: {type: "linear", domain: [0, 10], label: "Linear"}, color: "steelblue"});
}

export function opacityLegendLog() {
  return legend({opacity: {type: "log", domain: [1, 10], label: "Log"}});
}

export function opacityLegendSqrt() {
  return legend({opacity: {type: "sqrt", domain: [0, 1], label: "Sqrt"}});
}
