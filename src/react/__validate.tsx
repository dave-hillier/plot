// Throwaway validation scaffolding for the new <Plot> + useMark contract.
// Renders a single Frame mark via the new façade so the unit test can confirm
// the imperative mount path works end-to-end. Delete once real marks have
// migrated off the legacy stack.
import React from "react";
import {Plot} from "./Plot.js";
import {useMark, stampOptions} from "./useMark.js";
import {frame as frameMark} from "../marks/frame.js";
import {BoxY} from "./marks/Box.js";
import {TreeMark} from "./marks/Tree.js";
import {Auto} from "./marks/Auto.js";

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

export function validateBoxY() {
  // Two groups, each with values that include outliers; imperative boxY
  // should emit rule + bar + tick + dot.
  const data = [
    {g: "a", v: 1}, {g: "a", v: 2}, {g: "a", v: 3}, {g: "a", v: 4},
    {g: "a", v: 5}, {g: "a", v: 6}, {g: "a", v: 7}, {g: "a", v: 50},
    {g: "b", v: 2}, {g: "b", v: 3}, {g: "b", v: 4}, {g: "b", v: 5},
    {g: "b", v: 6}, {g: "b", v: 7}, {g: "b", v: 8}
  ];
  return (
    <Plot width={300} height={200}>
      <BoxY data={data} x="g" y="v" />
    </Plot>
  );
}

export function validateTreeMark() {
  // Flat hierarchical input — imperative tree() must run treeNode/treeLink
  // transforms to compute positions from path strings.
  const data = [
    "root",
    "root/a",
    "root/a/aa",
    "root/a/ab",
    "root/b",
    "root/b/ba",
    "root/b/bb"
  ];
  return (
    <Plot width={400} height={200} margin={20}>
      <TreeMark data={data} />
    </Plot>
  );
}

export function validateAuto() {
  const data = [
    {x: 0, y: 0},
    {x: 1, y: 1},
    {x: 2, y: 4},
    {x: 3, y: 9}
  ];
  return (
    <Plot width={300} height={200}>
      <Auto data={data} x="x" y="y" />
    </Plot>
  );
}
