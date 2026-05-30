import {createContext} from "./context.js";
import {isScaleOptions} from "./options.js";
import {renderToStaticMarkup} from "react-dom/server";
import {renderStandaloneLegend} from "./react/legends/Legend.js";

// Plot.legend(options): renders a standalone legend (color/opacity/symbol) via
// the React legend components — no d3-selection. Returns a DOM node created in
// the options' document, undefined for identity scales (nothing to draw), and
// throws when no legend scale is present or the requested swatches legend is
// invalid (the React ColorSwatches throws the same message as the former d3
// legend builders).
export function legend(options = {}) {
  if (!isScaleOptions(options.symbol) && !isScaleOptions(options.color) && !isScaleOptions(options.opacity)) {
    throw new Error("unknown legend type; no scale found");
  }
  const element = renderStandaloneLegend(options);
  if (element == null) return; // e.g., an identity scale has no legend
  const {document} = createContext(options);
  const div = document.createElement("div");
  div.innerHTML = renderToStaticMarkup(element);
  return div.firstElementChild;
}
