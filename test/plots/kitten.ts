import React from "react";
import {Plot, Image, dodgeY} from "../../src/react/index.js";
import type {ImageProps} from "../../src/react/index.js";

async function kitten({
  x = (d, i) => i % 5,
  y = (d, i) => Math.floor(i / 5),
  src = (d, i) => `https://placekitten.com/${100 + 2 * i}/${100 + 2 * i}`,
  ...options
}: Partial<ImageProps> = {}) {
  return React.createElement(Plot, {
      inset: 60,
      width: 520,
      height: 520,
      axis: null,
      r: {range: [10, 60]}
    },
    React.createElement(Image, {data: {length: 25}, x, y, src, ...options})
  );
}

export async function kittenConstant() {
  return kitten({r: 49});
}

export async function kittenConstantWidthHeight() {
  return kitten({r: 49, width: 200, height: 200});
}

export async function kittenConstantRotate() {
  return kitten({r: 49, rotate: 10});
}

export async function kittenVariable() {
  return kitten({r: (d, i) => i});
}

export async function kittenVariableDodge() {
  return kitten(dodgeY({r: (d, i) => i}));
}

export async function kittenVariableRotate() {
  return kitten({r: 49, rotate: (d, i) => (i - 12) * 20});
}
