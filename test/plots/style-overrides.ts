import React from "react";
import {Plot, Legend, Dot} from "../../src/react/index.js";

export function styleOverrideLegendCategorical() {
  // This test verifies legend style overrides. The React version uses the
  // Legend component inside a Plot with color scale configuration.
  return React.createElement(Plot, {
      color: {domain: "ABCDEFGHIJ"},
      className: "style-override"
    },
    React.createElement(Dot, {data: Array.from("ABCDEFGHIJ"), fill: (d) => d, x: (d, i) => i, y: () => 0}),
    React.createElement(Legend, {scale: "color", label: "Hello"})
  );
}
