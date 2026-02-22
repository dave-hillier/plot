import React from "react";
import {Plot, BoxX} from "../../src/react/index.js";
import * as d3 from "d3";

export async function diamondsBoxplot() {
  const diamonds = await d3.csv<any>("data/diamonds.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(BoxX, {data: diamonds, x: "price", y: "clarity", sort: {y: "x"}})
  );
}
