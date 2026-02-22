import React from "react";
import {Plot, Frame} from "../../src/react/index.js";

export async function emptyLegend() {
  return React.createElement(Plot, {
      color: {
        legend: true // ignored because no color scale
      }
    },
    React.createElement(Frame, {})
  );
}
