import React from "react";
import {Plot, RectY, groupX} from "../../src/react/index.js";

export async function groupedRects() {
  return React.createElement(Plot, {},
    React.createElement(RectY, {data: {length: 10}, ...groupX({y: "count"}, {x: (d, i) => "ABCDEFGHIJ"[i]})})
  );
}
