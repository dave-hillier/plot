import React from "react";
import {Plot, BarY, RuleY, groupX} from "../../src/react/index.js";
import * as d3 from "d3";

export async function mobyDickFaceted() {
  const mobydick = await d3.text("data/moby-dick-chapter-1.txt");
  const letters = [...mobydick].filter((d) => /\w/.test(d));
  const uppers = letters.map((d) => d.toUpperCase());
  const cases = letters.map((d) => (d.toLowerCase() === d ? "lower" : "upper"));
  const vowels = letters.map((d) => (/[aeiouy]/i.test(d) ? "vowel" : "consonant"));
  return React.createElement(Plot, {
      y: {
        grid: true
      },
      facet: {
        data: letters,
        x: vowels,
        y: cases
      }
    },
    React.createElement(BarY, {data: letters, ...groupX({y: "count"}, {x: uppers})}),
    React.createElement(RuleY, {data: [0]})
  );
}
