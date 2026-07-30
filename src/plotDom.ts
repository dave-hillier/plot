import {buildAutoLegends, renderLegendElement} from "./react/legends/Legend.js";
import {exposeScales} from "./scales.js";
import {consumeWarnings} from "./warnings.js";
import {computePlot} from "./plot.js";
import {renderToStaticMarkup} from "react-dom/server";
import {buildStaticPlotSvg} from "./react/renderStatic.js";

// The imperative entry point: plot() builds real DOM, so it is the only part
// of the core that needs a renderer capable of serializing React elements.
//
// It lives apart from computePlot (src/plot.ts) deliberately. <Plot> imports
// computePlot, and react-dom declares no `sideEffects: false`, so a bundler
// keeps the react-dom/server import of any module it pulls in — even when the
// binding is unused. Sharing a module with computePlot therefore put the whole
// server renderer in the client bundle of every app that renders a plot
// (issue #140).

export function plot(options: any = {}) {
  const computed: any = computePlot(options);
  const {className, scales, scaleDescriptors, context} = computed;
  const {style, title, subtitle, caption} = options;
  const document = context.document;
  const figureHolder: {current: any} = context.figureHolder;

  // Drain warnings emitted during computePlot so the ⚠️ indicator renders and
  // the warn() dedupe state is reset (matching the React <Plot> path).
  const warnings = consumeWarnings();

  // Render the marks to a detached <svg> via React's renderJSX — no
  // d3-selection. The same renderMarksWith/renderJSX code powers <Plot>, so
  // the imperative and JSX outputs stay in lockstep. We serialize to markup
  // and reparse into the target document (which may be a custom jsdom doc).
  const markup = renderToStaticMarkup(buildStaticPlotSvg(computed, warnings, options.className));
  const holder = document.createElement("div");
  holder.innerHTML = markup;
  const svg: any = holder.firstElementChild;

  // Apply the plot-level style option (string or object), mirroring
  // applyInlineStyles on the former imperative path.
  if (typeof style === "string") svg.setAttribute("style", style);
  else if (style != null) Object.assign(svg.style, style);

  figureHolder.current = svg;

  // Wrap the plot in a figure, if needed. Auto-legends render via the React
  // legend components (no d3-selection); serialize each to a DOM node in the
  // target document, matching the former createLegends output.
  const legends = buildAutoLegends(scaleDescriptors, context, options).map((el) => {
    const h = document.createElement("div");
    h.innerHTML = renderToStaticMarkup(el);
    return h.firstElementChild;
  });
  const {figure: figured = title != null || subtitle != null || caption != null || legends.length > 0} = options;
  if (figured) {
    const fig: any = document.createElement("figure");
    fig.className = `${className}-figure`;
    fig.style.maxWidth = "initial"; // avoid Observable default style
    if (title != null) fig.append(createTitleElement(document, title, "h2"));
    if (subtitle != null) fig.append(createTitleElement(document, subtitle, "h3"));
    fig.append(...legends, svg);
    if (caption != null) fig.append(createFigcaption(document, caption));
    if ("value" in svg) (fig.value = svg.value), delete svg.value;
    figureHolder.current = fig;
  }

  figureHolder.current.scale = exposeScales(scales.scales);
  // The .legend(key, options) method renders via the React legend components
  // (no d3-selection); serialize to a DOM node in the target document.
  figureHolder.current.legend = (key: string, legendOptions: any = {}) => {
    if (key !== "color" && key !== "opacity" && key !== "symbol") throw new Error(`unknown legend type: ${key}`);
    if (!(key in scaleDescriptors)) return;
    const el = renderLegendElement(key, legendOptions, scaleDescriptors, context, options);
    if (el == null) return;
    // Render into the per-call document option if given (e.g. a separate jsdom
    // window), else the plot's document.
    const targetDoc = legendOptions?.document ?? document;
    const h = targetDoc.createElement("div");
    h.innerHTML = renderToStaticMarkup(el);
    return h.firstElementChild;
  };

  return figureHolder.current;
}

function createTitleElement(document, contents, tag) {
  if (contents.ownerDocument) return contents;
  const e = document.createElement(tag);
  e.append(contents);
  return e;
}

function createFigcaption(document, caption) {
  const e = document.createElement("figcaption");
  e.append(caption);
  return e;
}
