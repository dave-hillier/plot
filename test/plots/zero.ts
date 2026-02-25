import React from "react";
import {Plot, LineY} from "../../src/react/index.js";

export async function zeroNegativeY() {
  return React.createElement(Plot, {y: {zero: true}},
    React.createElement(LineY, {data: [-0.25, -0.15, -0.05]})
  );
}

export async function zeroPositiveY() {
  return React.createElement(Plot, {y: {zero: true}},
    React.createElement(LineY, {data: [0.25, 0.15, 0.05]})
  );
}

export async function zeroPositiveDegenerateY() {
  return React.createElement(Plot, {y: {zero: true}},
    React.createElement(LineY, {data: [0.25, 0.25, 0.25]})
  );
}

export async function zeroNegativeDegenerateY() {
  return React.createElement(Plot, {y: {zero: true}},
    React.createElement(LineY, {data: [-0.25, -0.25, -0.25]})
  );
}
