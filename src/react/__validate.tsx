// Throwaway validation scaffolding for the new <Plot> + useMark contract.
// Renders a single Frame mark via the new façade so the unit test can confirm
// the imperative mount path works end-to-end. Delete once real marks have
// migrated off the legacy stack.
import React from "react";
import {Plot} from "./Plot.js";
import {useMark, stampOptions} from "./useMark.js";
import {frame as frameMark} from "../marks/frame.js";
import {BollingerY} from "./marks/Bollinger.js";
import {DifferenceY} from "./marks/Difference.js";
import {LinearRegressionY} from "./marks/LinearRegression.js";

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

export function validateBollingerY() {
  // A series with enough samples for the n=5 window — verifies the band
  // (area + line) is actually computed by the imperative bollingerY composite.
  const data = [
    10, 11, 12, 13, 14, 13, 12, 13, 15, 17,
    18, 19, 18, 17, 16, 17, 19, 20, 21, 22
  ];
  return (
    <Plot width={300} height={150}>
      <BollingerY data={data} n={5} />
    </Plot>
  );
}

export function validateDifferenceY() {
  const data = [
    {x: 0, y1: 1, y2: 2},
    {x: 1, y1: 3, y2: 2},
    {x: 2, y1: 5, y2: 4},
    {x: 3, y1: 4, y2: 6},
    {x: 4, y1: 6, y2: 5}
  ];
  return (
    <Plot width={300} height={150}>
      <DifferenceY data={data} x="x" y1="y1" y2="y2" />
    </Plot>
  );
}

export function validateLinearRegressionY() {
  const data = [
    {x: 0, y: 1},
    {x: 1, y: 2.1},
    {x: 2, y: 2.9},
    {x: 3, y: 4.05},
    {x: 4, y: 5.1}
  ];
  return (
    <Plot width={300} height={150}>
      <LinearRegressionY data={data} x="x" y="y" />
    </Plot>
  );
}
