import React from "react";
import {Plot, DotX} from "../../src/react/index.js";

export async function logDegenerate() {
  return React.createElement(Plot, {x: {type: "log"}},
    React.createElement(DotX, {data: [0, 0.1, 1, 2, 10]})
  );
}
