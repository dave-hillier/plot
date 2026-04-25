// Throwaway validation scaffolding for the new <Plot> + useMark contract.
// Renders a single Frame mark via the new façade so the unit test can confirm
// the imperative mount path works end-to-end. Delete once real marks have
// migrated off the legacy stack.
import React from "react";
import {Plot} from "./Plot.js";
import {useMark, stampOptions} from "./useMark.js";
import {frame as frameMark} from "../marks/frame.js";
import {Vector, Spike} from "./marks/Vector.js";
import {Image} from "./marks/Image.js";

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

export function validateVector() {
  const data = [
    {x: 1, y: 1, len: 10},
    {x: 2, y: 2, len: 20},
    {x: 3, y: 3, len: 30}
  ];
  return (
    <Plot width={200} height={200}>
      <Vector data={data} x="x" y="y" length="len" stroke="red" />
    </Plot>
  );
}

export function validateSpike() {
  const data = [
    {x: 1, y: 1, len: 10},
    {x: 2, y: 2, len: 20}
  ];
  return (
    <Plot width={200} height={200}>
      <Spike data={data} x="x" y="y" length="len" stroke="blue" />
    </Plot>
  );
}

export function validateImage() {
  const data = [
    {x: 1, y: 1},
    {x: 2, y: 2}
  ];
  return (
    <Plot width={200} height={200}>
      <Image data={data} x="x" y="y" src="https://example.com/img.png" width={16} height={16} />
    </Plot>
  );
}
