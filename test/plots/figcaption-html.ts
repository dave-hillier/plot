import React from "react";
import {Plot, BarY, RuleY} from "../../src/react/index.js";
import * as d3 from "d3";
import {html} from "htl";

export async function figcaptionHtml() {
  const alphabet = await d3.csv<any>("data/alphabet.csv", d3.autoType);
  return React.createElement(Plot, {
      caption: html`Figure 1. The relative frequency of letters in the English language. Data:
        <i>Cryptographical Mathematics</i>`,
      x: {
        label: null
      },
      y: {
        label: "Frequency (%)",
        transform: (y) => y * 100,
        grid: true
      }
    },
    React.createElement(BarY, {data: alphabet, x: "letter", y: "frequency"}),
    React.createElement(RuleY, {data: [0]})
  );
}
