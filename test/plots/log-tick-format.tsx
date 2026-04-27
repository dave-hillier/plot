import {Plot, formatNumber} from "../../src/react/index.js";

export async function logTickFormatFunction() {
  return <Plot x={{type: "log", domain: [1, 4200], tickFormat: formatNumber()}} />;
}

export async function logTickFormatFunctionSv() {
  return <Plot x={{type: "log", domain: [1, 4200], tickFormat: formatNumber("sv-SE")}} />;
}
