import React from "react";
import {Plot, Frame, Vector, Text} from "../../src/react/index.js";

export async function vectorFrame() {
  return React.createElement(Plot, {
      inset: 12,
      width: 200,
      height: 200
    },
    React.createElement(Frame, {}),
    React.createElement(Vector, {
      data: [null],
      length: 100,
      rotate: -135,
      anchor: "start",
      frameAnchor: "top-right",
      dx: -10,
      dy: 10
    }),
    React.createElement(Vector, {
      data: [null],
      length: 100,
      rotate: 45,
      anchor: "start",
      frameAnchor: "bottom-left",
      dx: 10,
      dy: -10
    }),
    React.createElement(Vector, {
      data: [null],
      length: 100,
      rotate: 135,
      anchor: "start",
      frameAnchor: "top-left",
      dx: 10,
      dy: 10
    }),
    React.createElement(Vector, {
      data: [null],
      length: 100,
      rotate: -45,
      anchor: "start",
      frameAnchor: "bottom-right",
      dx: -10,
      dy: -10
    }),
    React.createElement(Text, {
      data: [null],
      x: null,
      y: null,
      text: () => "Ο"
    })
  );
}
