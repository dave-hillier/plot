import React from "react";
import {Plot, Frame} from "../../src/react/index.js";

export async function emptyX() {
  return React.createElement(Plot, {
      grid: true,
      x: {
        domain: [0, 1],
        axis: null
      }
    },
    React.createElement(Frame, {})
  );
}
