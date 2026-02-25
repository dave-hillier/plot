import React from "react";
import {Plot, Auto, valueof} from "../../src/react/index.js";
import * as d3 from "d3";

// Tanner's bug https://github.com/observablehq/plot/issues/1365
export async function autoLineZero() {
  const industries = await d3.csv<any>("data/bls-industry-unemployment.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Auto, {data: industries, x: "date", y: {value: "unemployed", zero: true}, color: "industry"})
  );
}

// Jeff's bug https://github.com/observablehq/plot/issues/1340
export async function autoBarNonZeroReducer() {
  const athletes = await d3.csv<any>("data/athletes.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Auto, {data: athletes, x: "date_of_birth", y: {value: "height", reduce: "mean"}, mark: "bar"})
  );
}

export async function autoHistogram() {
  const athletes = await d3.csv<any>("data/athletes.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Auto, {data: athletes, x: "weight"})
  );
}

export async function autoHistogramDate() {
  const athletes = await d3.csv<any>("data/athletes.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Auto, {data: athletes, x: "date_of_birth"})
  );
}

export async function autoHistogramGroup() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Auto, {data: penguins, x: "island"})
  );
}

export async function autoNullReduceContinuous() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Auto, {data: penguins, x: "culmen_length_mm", y: {reduce: null}})
  );
}

export async function autoNullReduceOrdinal() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Auto, {data: penguins, x: "island", y: {reduce: null}})
  );
}

export async function autoNullReduceDate() {
  const athletes = await d3.csv<any>("data/athletes.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Auto, {data: athletes, x: "date_of_birth", y: {reduce: null}})
  );
}

export async function autoLineHistogram() {
  const aapl = await d3.csv<any>("data/aapl.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Auto, {data: aapl, x: "Volume", mark: "line"})
  );
}

export async function autoLine() {
  const aapl = await d3.csv<any>("data/aapl.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Auto, {data: aapl, x: "Date", y: "Close"})
  );
}

export async function autoArea() {
  const aapl = await d3.csv<any>("data/aapl.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Auto, {data: aapl, x: "Date", y: "Close", mark: "area"})
  );
}

export async function autoAreaColor() {
  const aapl = await d3.csv<any>("data/aapl.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Auto, {data: aapl, x: "Date", y: "Close", color: "Close", mark: "area"})
  );
}

export async function autoAreaColorValue() {
  const aapl = await d3.csv<any>("data/aapl.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Auto, {data: aapl, x: "Date", y: "Close", color: {value: "Close"}, mark: "area"})
  );
}

export async function autoAreaColorName() {
  const aapl = await d3.csv<any>("data/aapl.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Auto, {data: aapl, x: "Date", y: "Close", color: "red", mark: "area"})
  );
}

export async function autoAreaColorColor() {
  const aapl = await d3.csv<any>("data/aapl.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Auto, {data: aapl, x: "Date", y: "Close", color: {color: "red"}, mark: "area"})
  );
}

export async function autoDot() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Auto, {data: penguins, x: "culmen_length_mm", y: "body_mass_g"})
  );
}

export async function autoDotOrdinal() {
  const athletes = await d3.csv<any>("data/athletes.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Auto, {data: athletes, x: "sex", y: "nationality"})
  );
}

export async function autoDotOrdCont() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Auto, {data: penguins, x: "culmen_length_mm", y: "species"})
  );
}

export async function autoDotZero() {
  const alphabet = await d3.csv<any>("data/alphabet.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Auto, {data: alphabet, x: {value: "frequency", zero: true}, y: "letter"})
  );
}

export async function autoBar() {
  const alphabet = await d3.csv<any>("data/alphabet.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Auto, {data: alphabet, x: "frequency", y: "letter", mark: "bar"})
  );
}

const timeSeries = [
  {date: new Date("2023-04-01"), type: "triangle", value: 5},
  {date: new Date("2023-04-05"), type: "circle", value: 7},
  {date: new Date("2023-04-10"), type: "circle", value: 8},
  {date: new Date("2023-04-15"), type: "circle", value: 3},
  {date: new Date("2023-04-15"), type: "triangle", value: 7},
  {date: new Date("2023-04-20"), type: "triangle", value: 4},
  {date: new Date("2023-04-25"), type: "square", value: 5}
];

export async function autoBarTimeSeries() {
  return React.createElement(Plot, {x: {type: "band"}},
    React.createElement(Auto, {data: timeSeries, x: "date", y: "value", color: "type", mark: "bar"})
  );
}

export async function autoBarTimeSeriesReduce() {
  return React.createElement(Plot, {},
    React.createElement(Auto, {data: timeSeries, x: "date", y: {value: "value", reduce: "sum"}, color: "type", mark: "bar"})
  );
}

export async function autoConnectedScatterplot() {
  const driving = await d3.csv<any>("data/driving.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Auto, {data: driving, x: "miles", y: "gas", mark: "line"})
  );
}

// shouldnt make a line
export async function autoDotUnsortedDate() {
  const athletes = await d3.csv<any>("data/athletes.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Auto, {data: athletes, x: "date_of_birth", y: "height"})
  );
}

export async function autoDotSize() {
  const aapl = await d3.csv<any>("data/aapl.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Auto, {data: aapl, x: "Date", size: "Volume"})
  );
}

export async function autoDotSize2() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Auto, {data: penguins, x: "culmen_length_mm", y: "culmen_depth_mm", size: "body_mass_g"})
  );
}

export async function autoDotGroup() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Auto, {data: penguins, x: "island", y: "species", size: "count"})
  );
}

export async function autoDotBin() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Auto, {data: penguins, x: "culmen_length_mm", y: "body_mass_g", size: "count"})
  );
}

export async function autoDotColor() {
  const cars = await d3.csv<any>("data/cars.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Auto, {data: cars, x: "power (hp)", y: "weight (lb)", color: "0-60 mph (s)"})
  );
}

export async function autoHeatmapOrdCont() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Auto, {data: penguins, x: "culmen_length_mm", y: "species", color: "count"})
  );
}

export async function autoHeatmap() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Auto, {data: penguins, x: "culmen_length_mm", y: "body_mass_g", color: "count"})
  );
}

export async function autoHeatmapOrdinal() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Auto, {data: penguins, x: "island", y: "species", color: "count"})
  );
}

export async function autoBarStackColor() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Auto, {data: penguins, y: "species", color: "sex"})
  );
}

export async function autoBarColorReducer() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Auto, {data: penguins, y: "species", color: "count"})
  );
}

export async function autoRectStackColor() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Auto, {data: penguins, x: "culmen_length_mm", color: "island"})
  );
}

export async function autoRectColorReducer() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Auto, {data: penguins, x: "culmen_length_mm", color: {value: "island", reduce: "mode"}})
  );
}

export async function autoRuleZero() {
  const athletes = await d3.csv<any>("data/athletes.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Auto, {data: athletes, x: "date_of_birth", y: {value: "height", reduce: "mean"}, mark: "rule"})
  );
}

export async function autoLineColor() {
  const aapl = await d3.csv<any>("data/aapl.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Auto, {data: aapl, x: "Date", y: "Close", color: "Close"})
  );
}

export async function autoLineColorSeries() {
  const industries = await d3.csv<any>("data/bls-industry-unemployment.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Auto, {data: industries, x: "date", y: "unemployed", color: "industry"})
  );
}

export async function autoAreaStackColor() {
  const industries = await d3.csv<any>("data/bls-industry-unemployment.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Auto, {data: industries, x: "date", y: "unemployed", color: "industry", mark: "area"})
  );
}

export async function autoAutoHistogram() {
  const weather = await d3.csv<any>("data/seattle-weather.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Auto, {data: weather, x: "temp_max", mark: "area"})
  );
}

export async function autoBarStackColorField() {
  const athletes = await d3.csv<any>("data/athletes.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Auto, {data: athletes, x: "height", color: {value: "gold"}})
  );
}

export async function autoBarStackColorConstant() {
  const athletes = await d3.csv<any>("data/athletes.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Auto, {data: athletes, x: "height", color: "gold"})
  );
}

export async function autoBarMode() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Auto, {data: penguins, x: "island", y: {value: "species", reduce: "mode"}, mark: "bar"})
  );
}

export async function autoLineMean() {
  const weather = await d3.csv<any>("data/seattle-weather.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Auto, {data: weather, x: "date", y: {value: "temp_max", reduce: "mean"}})
  );
}

export async function autoLineMeanZero() {
  const weather = await d3.csv<any>("data/seattle-weather.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Auto, {data: weather, x: "date", y: {value: "temp_max", reduce: "mean", zero: true}})
  );
}

export async function autoLineMeanColor() {
  const athletes = await d3.csv<any>("data/athletes.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Auto, {data: athletes, x: "date_of_birth", y: {value: "height", reduce: "mean"}, color: "sex"})
  );
}

export async function autoLineMeanThresholds() {
  const weather = await d3.csv<any>("data/seattle-weather.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Auto, {data: weather, x: {value: "date", thresholds: "month"}, y: {value: "temp_max", reduce: "mean"}})
  );
}

export async function autoLineFacet() {
  const industries = await d3.csv<any>("data/bls-industry-unemployment.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Auto, {data: industries, x: "date", y: "unemployed", fy: "industry"})
  );
}

export async function autoDotFacet() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Auto, {data: penguins, x: "body_mass_g", y: "culmen_length_mm", fx: "island", color: "sex"})
  );
}

export async function autoDotFacet2() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Auto, {
      data: penguins,
      x: "body_mass_g",
      y: "culmen_length_mm",
      fx: "island",
      fy: "species",
      color: "sex"
    })
  );
}

export async function autoChannels() {
  const athletes = await d3.csv<any>("data/athletes.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Auto, {data: athletes, x: valueof(athletes, "height"), y: valueof(athletes, "sport")})
  );
}

export async function autoBarNoReducer() {
  const simpsons = await d3.csv<any>("data/simpsons.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Auto, {data: simpsons, x: "season", y: "number_in_season", color: "imdb_rating", mark: "bar"})
  );
}
