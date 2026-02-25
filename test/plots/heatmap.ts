import React from "react";
import {Plot, Raster, Frame, RuleX, RuleY, Rect} from "../../src/react/index.js";
import * as d3 from "d3";

export async function heatmap() {
  return React.createElement(Plot, {color: {type: "diverging"}},
    React.createElement(Raster, {
      fill: (x, y) => x * y * Math.sin(x) * Math.cos(y),
      x1: 0,
      y1: 0,
      x2: 4 * Math.PI,
      y2: 4 * Math.PI * (350 / 580),
      pixelSize: 3
    }),
    React.createElement(Frame)
  );
}

export async function heatmapArray() {
  const x1 = 0;
  const y1 = 0;
  const x2 = 4 * Math.PI;
  const y2 = 4 * Math.PI * (350 / 580);
  const pixelSize = 3;
  const width = Math.round(580 / pixelSize);
  const height = Math.round(350 / pixelSize);
  const x = (f => i => f.invert(i % width + 0.5))(d3.scaleLinear([x1, x2], [0, width])); // prettier-ignore
  const y = (f => i => f.invert(Math.floor(i / width) + 0.5))(d3.scaleLinear([y2, y1], [height, 0])); // prettier-ignore
  return React.createElement(Plot, {color: {type: "diverging"}},
    React.createElement(Raster, {
      data: d3.range(width * height),
      fill: ((f) => (_, i) => f(x(i), y(i)))((x, y) => x * y * Math.sin(x) * Math.cos(y)), // prettier-ignore
      x,
      y,
      x1,
      y1,
      x2,
      y2,
      width,
      height
    }),
    React.createElement(Frame)
  );
}

export async function heatmapLog() {
  return React.createElement(Plot, {
      height: 630,
      x: {ticks: 10, tickFormat: "+f"},
      y: {ticks: 10, tickFormat: "+f"},
      color: {type: "log", scheme: "magma"}
    },
    React.createElement(Raster, {
      fill: (x, y) =>
        (1 + (x + y + 1) ** 2 * (19 - 14 * x + 3 * x ** 2 - 14 * y + 6 * x * y + 3 * y ** 2)) *
        (30 + (2 * x - 3 * y) ** 2 * (18 - 32 * x + 12 * x * x + 48 * y - 36 * x * y + 27 * y ** 2)),
      x1: -2,
      y1: -2.5,
      x2: 2,
      y2: 1.5,
      pixelSize: 4
    }),
    React.createElement(RuleX, {data: [0], strokeOpacity: 0.2}),
    React.createElement(RuleY, {data: [0], strokeOpacity: 0.2}),
    React.createElement(Frame)
  );
}

export async function heatmapPartial() {
  return React.createElement(Plot, {axis: null},
    React.createElement(Raster, {x1: -7, x2: 7, y1: -7, y2: 7, fill: (x, y) => Math.atan2(y, x), pixelSize: 2}),
    React.createElement(Rect, {data: {length: 1}, x1: -10, x2: 10, y1: -10, y2: 10, stroke: "currentColor"})
  );
}

export async function heatmapFillOpacity() {
  return React.createElement(Plot, {axis: null},
    React.createElement(Raster, {
      x1: -1,
      y1: -1,
      x2: 1,
      y2: 1,
      fill: (x, y) => Math.atan2(y, x),
      fillOpacity: (x, y) => Math.PI - Math.atan2(y, x),
      pixelSize: 2
    })
  );
}

export async function heatmapOpacity() {
  return React.createElement(Plot, {axis: null},
    React.createElement(Raster, {
      x1: -1,
      y1: -1,
      x2: 1,
      y2: 1,
      fill: "red",
      fillOpacity: (x, y) => Math.PI - Math.atan2(y, x),
      pixelSize: 2
    })
  );
}

export async function heatmapConstantOpacity() {
  return React.createElement(Plot, {axis: null},
    React.createElement(Raster, {
      x1: -1,
      y1: -1,
      x2: 1,
      y2: 1,
      fill: (x, y) => Math.atan2(y, x),
      fillOpacity: 0.5,
      pixelSize: 2
    })
  );
}

export async function heatmapFaceted() {
  function lin(x) {
    return x / (4 * Math.PI);
  }
  return React.createElement(Plot, {
      height: 580,
      color: {type: "diverging"},
      fx: {tickFormat: (f) => f?.name},
      fy: {tickFormat: (f) => f?.name}
    },
    React.createElement(Raster, {
      fill: (x, y, {fx, fy}) => fx(x) * fy(y),
      fx: [Math.sin, Math.sin, lin, lin],
      fy: [Math.cos, lin, lin, Math.cos],
      x1: 0,
      y1: 0,
      x2: 4 * Math.PI,
      y2: 4 * Math.PI,
      pixelSize: 2
    }),
    React.createElement(Frame)
  );
}

export function mandelbrot() {
  return React.createElement(Plot, {height: 500},
    React.createElement(Raster, {
      fill: (x, y) => {
        for (let n = 0, zr = 0, zi = 0; n < 80; ++n) {
          [zr, zi] = [zr * zr - zi * zi + x, 2 * zr * zi + y];
          if (zr * zr + zi * zi > 4) return n;
        }
      },
      x1: -2,
      y1: -1.164,
      x2: 1,
      y2: 1.164
    })
  );
}

export function mandelbrotClip() {
  return React.createElement(Plot, {
      height: 500,
      clip: {
        type: "Polygon",
        coordinates: [
          [
            [-2, 0],
            [0, 1.5],
            [1, 0],
            [0, -1.5],
            [-2, 0]
          ]
        ]
      }
    },
    React.createElement(Raster, {
      fill: (x, y) => {
        for (let n = 0, zr = 0, zi = 0; n < 80; ++n) {
          [zr, zi] = [zr * zr - zi * zi + x, 2 * zr * zi + y];
          if (zr * zr + zi * zi > 4) return n;
        }
      },
      x1: -2,
      y1: -1.164,
      x2: 1,
      y2: 1.164
    })
  );
}
