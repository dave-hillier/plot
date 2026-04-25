import React from "react";
import {Plot, BarX} from "../../src/react/index.js";
import * as d3 from "d3";

export async function lightDark() {
  const alphabet = await d3.csv<any>("data/alphabet.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(BarX, {data: alphabet, x: "frequency", y: "letter", fill: "light-dark(steelblue, orange)", sort: {y: "-x"}})
  );
}
