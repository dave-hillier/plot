import React from "react";
import {Plot, Frame, AxisX, AxisY, RuleX, RuleY} from "../../src/react/index.js";

export async function axisLabelX() {
  return React.createElement(Plot, {
      inset: 6,
      x: {type: "linear"},
      y: {type: "linear", axis: null}
    },
    React.createElement(Frame, {}),
    React.createElement(AxisX, {anchor: "top", label: "top-left", labelAnchor: "left"}),
    React.createElement(AxisX, {anchor: "top", label: "top-center", labelAnchor: "center", ticks: []}),
    React.createElement(AxisX, {anchor: "top", label: "top-right", labelAnchor: "right", ticks: []}),
    React.createElement(AxisX, {anchor: "bottom", label: "bottom-left", labelAnchor: "left"}),
    React.createElement(AxisX, {anchor: "bottom", label: "bottom-center", labelAnchor: "center", ticks: []}),
    React.createElement(AxisX, {anchor: "bottom", label: "bottom-right", labelAnchor: "right", ticks: []})
  );
}

export async function axisLabelY() {
  return React.createElement(Plot, {
      inset: 6,
      x: {type: "linear", axis: null},
      y: {type: "linear"}
    },
    React.createElement(Frame, {}),
    React.createElement(AxisY, {anchor: "left", label: "left-top", labelAnchor: "top"}),
    React.createElement(AxisY, {anchor: "left", label: "left-center", labelAnchor: "center", ticks: []}),
    React.createElement(AxisY, {anchor: "left", label: "left-bottom", labelAnchor: "bottom", ticks: []}),
    React.createElement(AxisY, {anchor: "right", label: "right-top", labelAnchor: "top"}),
    React.createElement(AxisY, {anchor: "right", label: "right-center", labelAnchor: "center", ticks: []}),
    React.createElement(AxisY, {anchor: "right", label: "right-bottom", labelAnchor: "bottom", ticks: []})
  );
}

export async function axisLabelBoth() {
  return React.createElement(Plot, {
      inset: 6,
      x: {type: "linear", axis: "both", labelAnchor: "center"},
      y: {type: "linear", axis: "both", labelAnchor: "center"}
    },
    React.createElement(RuleX, {data: [{x: 0}, {x: 1}], x: "x"}),
    React.createElement(RuleY, {data: [{y: 0}, {y: 1}], y: "y"})
  );
}

export async function axisLabelBothReverse() {
  return React.createElement(Plot, {
      inset: 6,
      x: {type: "linear", reverse: true, axis: "both", labelAnchor: "center"},
      y: {type: "linear", reverse: true, axis: "both", labelAnchor: "center"}
    },
    React.createElement(RuleX, {data: [{x: 0}, {x: 1}], x: "x"}),
    React.createElement(RuleY, {data: [{y: 0}, {y: 1}], y: "y"})
  );
}

export async function axisLabelFontVariant() {
  return React.createElement(Plot, {
      x: {domain: "abcde"}
    },
    React.createElement(AxisX, {label: "Letter", fontVariant: "small-caps"})
  );
}

export async function axisLabelVaryingFill() {
  return React.createElement(Plot, {
      x: {domain: "ABCDEF"}
    },
    React.createElement(AxisX, {label: "Letter", fill: (d, i) => i})
  );
}

export async function axisLabelHref() {
  return React.createElement(Plot, {
      x: {domain: "ABCDEF"}
    },
    React.createElement(AxisX, {label: "Letter", href: (d) => `https://en.wikipedia.org/wiki/${d}`})
  );
}
