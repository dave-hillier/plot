// Throwaway validation scaffolding for the new <Plot> + useMark contract.
// Renders a single Frame mark via the new façade so the unit test can confirm
// the imperative mount path works end-to-end. Delete once real marks have
// migrated off the legacy stack.
import React from "react";
import {Plot} from "./Plot.js";
import {useMark, stampOptions} from "./useMark.js";
import {frame as frameMark} from "../marks/frame.js";
import {dot as dotMark} from "../marks/dot.js";
import {Tip} from "./interactions/Tip.js";
import {Crosshair} from "./interactions/Crosshair.js";

function FrameNew(props: Record<string, any>) {
  useMark({
    stamp: stampOptions("frame", null, props),
    factory: () => frameMark(props)
  });
  return null;
}

function DotNew({data, ...options}: {data: any; [key: string]: any}) {
  useMark({
    stamp: stampOptions("dot", data, options),
    factory: () => dotMark(data, options)
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

const sampleData = [
  {x: 1, y: 2},
  {x: 2, y: 4},
  {x: 3, y: 6}
];

export function validateTip() {
  return (
    <Plot width={200} height={100}>
      <DotNew data={sampleData} x="x" y="y" />
      <Tip data={sampleData} x="x" y="y" />
    </Plot>
  );
}

export function validateCrosshair() {
  return (
    <Plot width={200} height={100}>
      <DotNew data={sampleData} x="x" y="y" />
      <Crosshair data={sampleData} x="x" y="y" />
    </Plot>
  );
}
