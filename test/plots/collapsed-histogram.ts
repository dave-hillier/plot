import React from "react";
import {Plot, RectY, binX} from "../../src/react/index.js";

export async function collapsedHistogram() {
  return React.createElement(Plot, {},
    React.createElement(RectY, {data: [1, 1, 1], ...binX()})
  );
}
