import React from "react";
import {Plot, Dot, CrosshairX, Crosshair, Hexagon, LineY, GridX, AxisX, dodgeY, hexbin, pointerX} from "../../src/react/index.js";
import * as d3 from "d3";

export async function crosshairDodge() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return React.createElement(Plot, {height: 160},
    React.createElement(Dot, {data: penguins, ...dodgeY({x: "culmen_length_mm", r: "body_mass_g"})}),
    React.createElement(CrosshairX, {data: penguins, ...dodgeY({x: "culmen_length_mm", r: "body_mass_g"})})
  );
}

export async function crosshairDot() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Dot, {data: penguins, x: "culmen_length_mm", y: "culmen_depth_mm", stroke: "sex"}),
    React.createElement(Crosshair, {data: penguins, x: "culmen_length_mm", y: "culmen_depth_mm"})
  );
}

export async function crosshairDotFacet() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Dot, {data: penguins, x: "culmen_length_mm", y: "culmen_depth_mm", fy: "species", stroke: "sex"}),
    React.createElement(Crosshair, {data: penguins, x: "culmen_length_mm", y: "culmen_depth_mm", fy: "species"})
  );
}

export async function crosshairHexbin() {
  const olympians = await d3.csv<any>("data/athletes.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Hexagon, {data: olympians, ...hexbin({r: "count"}, {x: "weight", y: "height"})}),
    React.createElement(Crosshair, {data: olympians, ...hexbin({r: "count"}, {x: "weight", y: "height"})})
  );
}

export async function crosshairLine() {
  const aapl = await d3.csv<any>("data/aapl.csv", d3.autoType);
  return React.createElement(Plot, {marginLeft: 60, marginRight: 40},
    React.createElement(LineY, {data: aapl, x: "Date", y: "Close"}),
    React.createElement(CrosshairX, {data: aapl, x: "Date", y: "Close"})
  );
}

export async function crosshairContinuousX() {
  const aapl = await d3.csv<any>("data/aapl.csv", d3.autoType);
  return React.createElement(Plot, {height: 270, x: {nice: true}},
    React.createElement(LineY, {data: aapl, x: "Date", y: "Close"}),
    React.createElement(GridX, {...pointerX({ticks: 1000, ariaLabel: `crosshair-x tick`})}),
    React.createElement(AxisX, {
      ...pointerX({
        ticks: 1000,
        ariaLabel: `crosshair-x label`,
        tickFormat: `%Y\n%b`,
        textStroke: "var(--plot-background)",
        textStrokeWidth: 5,
        tickSize: 0
      })
    })
  );
}
