// Throwaway validation scaffolding for the new <Plot> + useMark contract.
// Renders a single Frame mark via the new façade so the unit test can confirm
// the imperative mount path works end-to-end. Delete once real marks have
// migrated off the legacy stack.
import React from "react";
import {Plot} from "./Plot.js";
import {useMark, stampOptions} from "./useMark.js";
import {frame as frameMark} from "../marks/frame.js";
import {DelaunayLink, DelaunayMesh, Hull, Voronoi, VoronoiMesh} from "./marks/Delaunay.js";
import {WaffleX, WaffleY} from "./marks/Waffle.js";

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

const delaunayPoints = [
  {x: 10, y: 20},
  {x: 30, y: 60},
  {x: 50, y: 30},
  {x: 70, y: 80},
  {x: 90, y: 40}
];

export function validateDelaunayMesh() {
  return (
    <Plot width={200} height={150}>
      <DelaunayMesh data={delaunayPoints} x="x" y="y" stroke="black" />
    </Plot>
  );
}

export function validateDelaunayLink() {
  return (
    <Plot width={200} height={150}>
      <DelaunayLink data={delaunayPoints} x="x" y="y" stroke="purple" />
    </Plot>
  );
}

export function validateHull() {
  return (
    <Plot width={200} height={150}>
      <Hull data={delaunayPoints} x="x" y="y" stroke="red" />
    </Plot>
  );
}

export function validateVoronoi() {
  return (
    <Plot width={200} height={150}>
      <Voronoi data={delaunayPoints} x="x" y="y" stroke="blue" />
    </Plot>
  );
}

export function validateVoronoiMesh() {
  return (
    <Plot width={200} height={150}>
      <VoronoiMesh data={delaunayPoints} x="x" y="y" stroke="green" />
    </Plot>
  );
}

const waffleData = [
  {name: "a", value: 5},
  {name: "b", value: 7},
  {name: "c", value: 3}
];

export function validateWaffleY() {
  return (
    <Plot width={300} height={200}>
      <WaffleY data={waffleData} x="name" y="value" fill="steelblue" />
    </Plot>
  );
}

export function validateWaffleX() {
  return (
    <Plot width={300} height={200}>
      <WaffleX data={waffleData} y="name" x="value" fill="tomato" />
    </Plot>
  );
}
