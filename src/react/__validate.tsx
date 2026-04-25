// Throwaway validation scaffolding for the new <Plot> + useMark contract.
// Renders a single Frame mark via the new façade so the unit test can confirm
// the imperative mount path works end-to-end. Delete once real marks have
// migrated off the legacy stack.
import React from "react";
import {Plot} from "./Plot.js";
import {useMark, stampOptions} from "./useMark.js";
import {frame as frameMark} from "../marks/frame.js";
import {Density} from "./marks/Density.js";
import {Contour} from "./marks/Contour.js";
import {Raster} from "./marks/Raster.js";

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

export function validateDensity() {
  // A small 2-D point cloud — enough to produce density contours.
  const data = [
    [0, 0], [0.1, 0.05], [0.2, -0.05], [0.05, 0.1], [-0.05, 0.05],
    [1, 1], [1.05, 0.95], [0.95, 1.05], [1.1, 1.0], [0.9, 0.9],
    [2, 0.5], [2.1, 0.55], [1.95, 0.45], [2.05, 0.5], [2.0, 0.6]
  ];
  return (
    <Plot width={200} height={150}>
      <Density data={data} x={(d: number[]) => d[0]} y={(d: number[]) => d[1]} bandwidth={20} thresholds={5} />
    </Plot>
  );
}

export function validateContour() {
  // Use the function-of-(x,y) form so the contour mark samples its own grid.
  return (
    <Plot width={200} height={150}>
      <Contour
        x1={-2}
        y1={-2}
        x2={2}
        y2={2}
        fill={(x: number, y: number) => Math.sin(x) * Math.cos(y)}
        thresholds={5}
      />
    </Plot>
  );
}

export function validateRaster() {
  // Use the function-of-(x,y) form so the raster mark samples its own grid.
  return (
    <Plot width={200} height={150}>
      <Raster
        x1={-2}
        y1={-2}
        x2={2}
        y2={2}
        fill={(x: number, y: number) => Math.sin(x) * Math.cos(y)}
      />
    </Plot>
  );
}
