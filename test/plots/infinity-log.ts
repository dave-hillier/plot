import React from "react";
import {Plot, DotX} from "../../src/react/index.js";

export async function infinityLog() {
  return React.createElement(Plot, {x: {type: "log", tickFormat: "f"}},
    React.createElement(DotX, {data: [NaN, 0.2, 0, 1, 2, 1 / 0]})
  );
}
