import React from "react";
import {Plot, Dot} from "../../src/react/index.js";
import * as d3 from "d3";

export async function letterFrequencyDot() {
  const alphabet = await d3.csv<any>("data/alphabet.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Dot, {data: alphabet, x: "letter", r: "frequency"})
  );
}
