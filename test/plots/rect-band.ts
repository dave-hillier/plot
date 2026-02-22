import React from "react";
import {Plot, Frame, BarX, RectX, RectY, Rect} from "../../src/react/index.js";
import * as d3 from "d3";

export async function rectBand() {
  return React.createElement(Plot, {
      y: {
        type: "band",
        domain: "ABC",
        grid: true
      }
    },
    React.createElement(Frame, {}),
    React.createElement(BarX, {data: {length: 1}, x1: [0], x2: [1], fill: "cyan", mixBlendMode: "multiply"}),
    React.createElement(RectX, {data: {length: 1}, x1: [0], x2: [1], fill: "magenta", mixBlendMode: "multiply"})
  );
}

export async function rectBandX() {
  const alphabet = await d3.csv<any>("data/alphabet.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(RectY, {data: alphabet, x: "letter", y: "frequency"})
  );
}

export async function rectBandY() {
  const alphabet = await d3.csv<any>("data/alphabet.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(RectX, {data: alphabet, y: "letter", x: "frequency"})
  );
}

export async function rectBandX1() {
  return React.createElement(Plot, {
      round: true,
      x: {type: "band", domain: "ABCDE"},
      y: {type: "linear", domain: [0, 9]}
    },
    React.createElement(Rect, {
      data: [
        ["A", 0, "A", 1],
        ["A", 1, "B", 2],
        ["A", 2, "C", 3],
        ["A", 3, "D", 4],
        ["A", 4, "E", 5],
        ["B", 5, "E", 6],
        ["C", 6, "E", 7],
        ["D", 7, "E", 8],
        ["E", 8, "E", 9]
      ],
      x1: "0", y1: "1", x2: "2", y2: "3", inset: 0.5
    })
  );
}

export async function rectPointX1() {
  return React.createElement(Plot, {
      round: true,
      x: {type: "point", domain: "ABCDE"},
      y: {type: "linear", domain: [0, 9]}
    },
    React.createElement(Rect, {
      data: [
        ["A", 0, "A", 1],
        ["A", 1, "B", 2],
        ["A", 2, "C", 3],
        ["A", 3, "D", 4],
        ["A", 4, "E", 5],
        ["B", 5, "E", 6],
        ["C", 6, "E", 7],
        ["D", 7, "E", 8],
        ["E", 8, "E", 9]
      ],
      x1: "0", y1: "1", x2: "2", y2: "3", inset: 0.5, insetLeft: -0.5, insetRight: -0.5
    })
  );
}
