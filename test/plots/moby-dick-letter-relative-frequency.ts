import React from "react";
import {Plot, BarY, RuleY, groupX} from "../../src/react/index.js";
import * as d3 from "d3";

export async function mobyDickLetterRelativeFrequency() {
  const mobydick = await d3.text("data/moby-dick-chapter-1.txt");
  const letters = [...mobydick].filter((c) => /[a-z]/i.test(c)).map((c) => c.toUpperCase());
  return React.createElement(Plot, {
      y: {
        grid: true,
        percent: true
      }
    },
    React.createElement(BarY, {data: letters, ...groupX({y: "proportion"})}),
    React.createElement(RuleY, {data: [0]})
  );
}
