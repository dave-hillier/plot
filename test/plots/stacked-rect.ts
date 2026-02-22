import React from "react";
import {Plot, RectX} from "../../src/react/index.js";

export async function stackedRect() {
  return React.createElement(Plot, {
      x: {
        tickFormat: "%"
      }
    },
    React.createElement(RectX, {
      data: {length: 20},
      x: (d, i) => i,
      fill: (d, i) => i,
      insetLeft: 1,
      offset: "normalize"
    })
  );
}
