import React from "react";
import {Plot, Frame} from "../../src/react/index.js";
import {svg} from "htl";

export async function empty() {
  return React.createElement(Plot, {
      grid: true,
      inset: 6,
      x: {type: "linear"},
      y: {type: "linear"}
    },
    React.createElement(Frame, {}),
    // TODO: arrow fn marks — undefined, null, () => null, () => undefined, () => svg`<circle cx=50% cy=50% r=5 fill=green>`
  );
}
