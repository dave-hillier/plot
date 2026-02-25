import React from "react";
import {Plot, RectY, binX} from "../../src/react/index.js";

export async function singleValueBin() {
  return React.createElement(Plot, {},
    React.createElement(RectY, {data: [3], ...binX()})
  );
}
