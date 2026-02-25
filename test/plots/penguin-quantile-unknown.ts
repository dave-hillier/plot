import React from "react";
import {Plot, TickX} from "../../src/react/index.js";
import * as d3 from "d3";

export async function penguinQuantileUnknown() {
  const sample = (await d3.csv<any>("data/penguins.csv", d3.autoType)).map((d, i) => ({
    ...d,
    body_mass_g: i % 7 === 0 ? NaN : d.body_mass_g
  }));
  return React.createElement(Plot, {
      color: {type: "quantile", n: 5, scheme: "blues", unknown: "red", legend: true}
    },
    React.createElement(TickX, {data: sample, x: "culmen_length_mm", stroke: "body_mass_g"})
  );
}

export async function penguinQuantileEmpty() {
  const sample = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return React.createElement(Plot, {
      color: {type: "quantile", n: 5, scheme: "blues", unknown: "red"}
    },
    React.createElement(TickX, {data: sample, x: "culmen_length_mm", stroke: () => null})
  );
}
