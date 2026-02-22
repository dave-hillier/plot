import React from "react";
import {Plot, BarX, Frame} from "../../src/react/index.js";

export async function tickFormatEmptyDomain() {
  return React.createElement(Plot, {y: {tickFormat: "%W"}},
    React.createElement(BarX, {data: []}),
    React.createElement(Frame, {})
  );
}

export async function tickFormatEmptyFacetDomain() {
  return React.createElement(Plot, {fy: {tickFormat: "%W"}},
    React.createElement(BarX, {data: []}),
    React.createElement(Frame, {})
  );
}
