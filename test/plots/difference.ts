import React from "react";
import {Plot, DifferenceY, DifferenceX, normalizeY, groupX, find, windowY, shiftX, mapX} from "../../src/react/index.js";
import * as d3 from "d3";

async function readStocks(start = 0, end = Infinity) {
  return (
    await Promise.all(
      ["AAPL", "GOOG"].map((symbol) =>
        d3.csv<any>(`data/${symbol.toLowerCase()}.csv`, (d, i) =>
          start <= i && i < end ? ((d.Symbol = symbol), d3.autoType(d)) : null
        )
      )
    )
  ).flat();
}

// Here we compare the normalized performance of Apple and Google stock; green
// represents Apple outperforming, while blue represents Google outperforming.
export async function differenceY() {
  const stocks = await readStocks();
  return React.createElement(Plot, {},
    React.createElement(DifferenceY, {
      data: stocks,
      ...normalizeY(
        groupX(
          {y1: find((d) => d.Symbol === "GOOG"), y2: find((d) => d.Symbol === "AAPL")},
          {x: "Date", y: "Close", tip: true}
        )
      )
    })
  );
}

export async function differenceYRandom() {
  const random = d3.randomLcg(42);
  let sum = 3;
  const cumsum = () => (sum += random() - 0.5);
  return React.createElement(Plot, {},
    React.createElement(DifferenceY, {data: {length: 60}, y1: cumsum, y2: cumsum, curve: "natural", tip: true})
  );
}

export async function differenceYCurve() {
  const stocks = await readStocks(60, 100);
  return React.createElement(Plot, {},
    React.createElement(DifferenceY, {
      data: stocks,
      ...normalizeY(
        groupX(
          {y1: find((d) => d.Symbol === "GOOG"), y2: find((d) => d.Symbol === "AAPL")},
          {x: "Date", y: "Close", curve: "cardinal", tension: 0.1}
        )
      )
    })
  );
}

export async function differenceYVariable() {
  const stocks = await readStocks();
  return React.createElement(Plot, {},
    React.createElement(DifferenceY, {
      data: stocks,
      ...normalizeY(
        groupX(
          {y1: find((d) => d.Symbol === "GOOG"), y2: find((d) => d.Symbol === "AAPL")},
          {x: "Date", y: "Close", negativeFill: "#eee", positiveFill: ([d]) => d.Date.getUTCFullYear()}
        )
      )
    })
  );
}

export async function differenceYClip() {
  const gistemp = await d3.csv<any>("data/gistemp.csv", d3.autoType);
  return React.createElement(Plot, {x: {insetLeft: -50}},
    React.createElement(DifferenceY, {data: gistemp, ...windowY(28, {x: "Date", y: "Anomaly", clip: "frame"})})
  );
}

export async function differenceYClipVariable() {
  const stocks = await readStocks();
  return React.createElement(Plot, {},
    React.createElement(DifferenceY, {
      data: stocks,
      ...normalizeY(
        groupX(
          {y1: find((d) => d.Symbol === "GOOG"), y2: find((d) => d.Symbol === "AAPL")},
          {x: "Date", y: "Close", negativeFill: "#eee", positiveFill: ([d]) => d.Date.getUTCFullYear(), clip: true}
        )
      )
    })
  );
}

export async function differenceYConstant() {
  const aapl = await d3.csv<any>("data/aapl.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(DifferenceY, {data: aapl, x: "Date", y1: 115, y2: "Close"})
  );
}

export async function differenceYOrdinal() {
  const random = d3.randomLcg(42);
  return React.createElement(Plot, {},
    React.createElement(DifferenceY, {
      data: {length: 30},
      y1: () => "ABCDE"[(random() * 5) | 0],
      y2: () => "ABCDE"[(random() * 5) | 0]
    })
  );
}

export async function differenceYOrdinalFlip() {
  const random = d3.randomLcg(42);
  return React.createElement(Plot, {y: {reverse: true}},
    React.createElement(DifferenceY, {
      data: {length: 30},
      y1: () => "ABCDE"[(random() * 5) | 0],
      y2: () => "ABCDE"[(random() * 5) | 0]
    })
  );
}

export async function differenceYReverse() {
  const gistemp = await d3.csv<any>("data/gistemp.csv", d3.autoType);
  return React.createElement(Plot, {y: {reverse: true}},
    React.createElement(DifferenceY, {data: gistemp, ...windowY(28, {x: "Date", y: "Anomaly"})})
  );
}

export async function differenceYZero() {
  const gistemp = await d3.csv<any>("data/gistemp.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(DifferenceY, {data: gistemp, ...windowY(28, {x: "Date", y: "Anomaly"})})
  );
}

export async function differenceYNegative() {
  const gistemp = await d3.csv<any>("data/gistemp.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(DifferenceY, {data: gistemp, ...windowY(28, {x: "Date", positiveFill: "none", y: "Anomaly"})})
  );
}

export async function differenceY1() {
  const aapl = await d3.csv<any>("data/aapl.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(DifferenceY, {
      data: aapl,
      ...shiftX("year", {
        x: "Date",
        y: "Close",
        positiveFillOpacity: 0.2,
        positiveFill: "currentColor",
        negativeFillOpacity: 0.8,
        negativeFill: "red"
      })
    })
  );
}

export async function differenceFilterX() {
  const aapl = await d3.csv<any>("data/aapl.csv", d3.autoType);
  const goog = await d3.csv<any>("data/goog.csv", d3.autoType);
  const x = aapl.map((d, i) => (200 <= i && i < 400 ? NaN : d.Date));
  const y1 = goog.map((d, i, data) => d.Close / data[0].Close);
  const y2 = aapl.map((d, i, data) => d.Close / data[0].Close);
  return React.createElement(Plot, {},
    React.createElement(DifferenceY, {data: aapl, x, y1, y2})
  );
}

export async function differenceFilterY1() {
  const aapl = await d3.csv<any>("data/aapl.csv", d3.autoType);
  const goog = await d3.csv<any>("data/goog.csv", d3.autoType);
  const x = aapl.map((d) => d.Date);
  const y1 = goog.map((d, i, data) => d.Close / data[0].Close);
  const y2 = aapl.map((d, i, data) => (200 <= i && i < 400 ? NaN : d.Close / data[0].Close));
  return React.createElement(Plot, {},
    React.createElement(DifferenceY, {data: aapl, x, y1, y2})
  );
}

export async function differenceFilterY2() {
  const aapl = await d3.csv<any>("data/aapl.csv", d3.autoType);
  const goog = await d3.csv<any>("data/goog.csv", d3.autoType);
  const x = aapl.map((d) => d.Date);
  const y1 = goog.map((d, i, data) => (200 <= i && i < 400 ? NaN : d.Close / data[0].Close));
  const y2 = aapl.map((d, i, data) => d.Close / data[0].Close);
  return React.createElement(Plot, {},
    React.createElement(DifferenceY, {data: aapl, x, y1, y2})
  );
}

export async function differenceX() {
  const random = d3.randomNormal.source(d3.randomLcg(22))();
  return React.createElement(Plot, {height: 600, y: {reverse: true}},
    React.createElement(DifferenceX, {data: {length: 100}, ...mapX("cumsum", {x1: random, x2: random, curve: "basis"})})
  );
}
