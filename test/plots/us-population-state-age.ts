import React from "react";
import {Plot, RuleX, RuleY, TickX, BarY, normalizeX} from "../../src/react/index.js";
import * as d3 from "d3";

export async function usPopulationStateAge() {
  const states = await d3.csv<any>("data/us-population-state-age.csv", d3.autoType);
  const ages = states.columns.slice(1);
  const stateage = ages.flatMap((age) => states.map((d) => ({state: d.name, age, population: d[age]})));
  return React.createElement(Plot, {
      marginLeft: 50,
      grid: true,
      x: {
        axis: "top",
        label: "Percent (%)",
        percent: true
      },
      y: {
        domain: ages,
        label: "Age"
      }
    },
    React.createElement(RuleX, {data: [0]}),
    React.createElement(TickX, {data: stateage, ...normalizeX("sum", {z: "state", x: "population", y: "age"})})
  );
}

export async function usPopulationStateAgeGrouped() {
  const states = await d3.csv<any>("data/us-population-state-age.csv", d3.autoType);
  const ages = states.columns.slice(1);
  const stateage = ages.flatMap((age) => states.map((d) => ({state: d.name, age, population: d[age]})));
  return React.createElement(Plot, {
      x: {
        axis: null,
        domain: ages
      },
      y: {
        grid: true,
        tickFormat: "s"
      },
      color: {
        domain: ages,
        scheme: "spectral"
      },
      fx: {
        label: null,
        tickSize: 6
      }
    },
    React.createElement(BarY, {
      data: stateage,
      fx: "state",
      x: "age",
      y: "population",
      fill: "age",
      title: "age",
      sort: {fx: "-y", limit: 6}
    }),
    React.createElement(RuleY, {data: [0]})
  );
}
