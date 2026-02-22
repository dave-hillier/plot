import React from "react";
import {Plot, RectY} from "../../src/react/index.js";

export async function autoHeightEmpty() {
  return React.createElement(Plot, {},
    React.createElement(RectY, {data: [], x: "date", y: "visitors", fy: "path"})
  );
}
