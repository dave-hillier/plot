// Throwaway validation scaffolding for the new <Plot> + useMark contract.
// Renders a single Frame mark via the new façade so the unit test can confirm
// the imperative mount path works end-to-end. Delete once real marks have
// migrated off the legacy stack.
import React from "react";
import {Plot} from "./Plot.js";
import {useMark, stampOptions} from "./useMark.js";
import {frame as frameMark} from "../marks/frame.js";
import {Geo, Sphere, Graticule} from "./marks/Geo.js";
import {Hexgrid} from "./marks/Hexgrid.js";
import {BarY, BarX} from "./marks/Bar.js";
import {RectY, Cell, CellY} from "./marks/Rect.js";

function FrameNew(props: Record<string, any>) {
  useMark({
    stamp: stampOptions("frame", null, props),
    factory: () => frameMark(props)
  });
  return null;
}

export function validatePlot() {
  return (
    <Plot width={200} height={100}>
      <FrameNew stroke="black" />
    </Plot>
  );
}

export function validateGeo() {
  // Sphere + Graticule render a globe outline + grid via the new contract.
  return (
    <Plot width={200} height={200} projection="equirectangular">
      <Sphere stroke="black" />
      <Graticule stroke="#ccc" />
    </Plot>
  );
}

export function validateGeoData() {
  const data = [{type: "Point", coordinates: [0, 0]}];
  return (
    <Plot width={200} height={200} projection="equirectangular">
      <Geo data={data} stroke="red" />
    </Plot>
  );
}

export function validateHexgrid() {
  return (
    <Plot width={200} height={200}>
      <Hexgrid />
    </Plot>
  );
}

export function validateBarY() {
  const data = [
    {name: "a", value: 10},
    {name: "b", value: 20},
    {name: "c", value: 15}
  ];
  return (
    <Plot width={200} height={100}>
      <BarY data={data} x="name" y="value" fill="steelblue" />
    </Plot>
  );
}

export function validateBarX() {
  const data = [
    {name: "a", value: 10},
    {name: "b", value: 20}
  ];
  return (
    <Plot width={200} height={100}>
      <BarX data={data} y="name" x="value" fill="tomato" />
    </Plot>
  );
}

export function validateRectY() {
  const data = [1, 2, 3, 4, 5];
  return (
    <Plot width={200} height={100}>
      <RectY data={data} x={(_d: number, i: number) => i} y={(d: number) => d} fill="orange" />
    </Plot>
  );
}

export function validateCellY() {
  const data = [1, 2, 3, 4];
  return (
    <Plot width={200} height={100}>
      <CellY data={data} />
    </Plot>
  );
}

export function validateCell() {
  const data = [
    {x: "a", y: 1, v: 10},
    {x: "b", y: 2, v: 20}
  ];
  return (
    <Plot width={200} height={100}>
      <Cell data={data} x="x" y="y" fill="v" />
    </Plot>
  );
}
