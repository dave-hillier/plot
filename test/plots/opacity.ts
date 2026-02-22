import React from "react";
import {Plot, DotX, identity} from "../../src/react/index.js";
import * as d3 from "d3";

export function opacityDotsFillUnscaled() {
  return React.createElement(Plot, {},
    React.createElement(DotX, {
      data: d3.ticks(0.3, 0.7, 40),
      fill: "black",
      r: 7,
      fillOpacity: identity
    })
  );
}

export function opacityDotsStrokeUnscaled() {
  return React.createElement(Plot, {},
    React.createElement(DotX, {
      data: d3.ticks(0.3, 0.7, 40),
      stroke: "black",
      r: 3.5,
      strokeWidth: 7,
      strokeOpacity: identity
    })
  );
}

export function opacityDotsUnscaled() {
  return React.createElement(Plot, {},
    React.createElement(DotX, {
      data: d3.ticks(0.3, 0.7, 40),
      fill: "black",
      r: 7,
      opacity: identity
    })
  );
}
