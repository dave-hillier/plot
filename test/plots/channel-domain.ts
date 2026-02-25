import React from "react";
import {Plot, BarX, TickX, groupY} from "../../src/react/index.js";
import * as d3 from "d3";
import type * as PlotType from "replot";

async function countNationality(sort: PlotType.ChannelDomainSort) {
  const athletes = await d3.csv<any>("data/athletes.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(BarX, {data: athletes, ...groupY({x: "count"}, {y: "nationality", sort})})
  );
}

export async function channelDomainDefault() {
  return countNationality({y: "x", limit: 20});
}

export async function channelDomainDefaultReverse() {
  return countNationality({y: "x", reverse: true, limit: 20});
}

export async function channelDomainAscending() {
  return countNationality({y: "x", order: "ascending", limit: 20});
}

export async function channelDomainAscendingReverse() {
  return countNationality({y: "x", order: "ascending", reverse: true, limit: 20});
}

export async function channelDomainDescending() {
  return countNationality({y: "x", order: "descending", limit: 20});
}

export async function channelDomainDescendingReverse() {
  return countNationality({y: "x", order: "descending", reverse: true, limit: 20});
}

export async function channelDomainMinus() {
  return countNationality({y: "-x", limit: 20});
}

export async function channelDomainMinusReverse() {
  return countNationality({y: "-x", reverse: true, limit: 20});
}

export async function channelDomainComparator() {
  return countNationality({y: "x", order: ([, a], [, b]) => d3.descending(a, b), limit: 20});
}

export async function channelDomainComparatorReverse() {
  return countNationality({y: "x", order: ([, a], [, b]) => d3.ascending(a, b), reverse: true, limit: 20});
}

// This test avoids the group transform because the group transform always sorts
// groups in natural ascending order by key. (Perhaps there should be an option
// to disable that behavior?)
async function groupNationality(sort: PlotType.ChannelDomainSort) {
  const athletes = await d3.csv<any>("data/athletes.csv", d3.autoType);
  const nationalities = d3.groups(athletes, (d) => d.nationality);
  const count = Object.assign(([, D]) => D.length, {label: "Frequency"});
  const key = Object.assign(([d]) => d, {label: "nationality"});
  return React.createElement(Plot, {},
    React.createElement(BarX, {data: nationalities, x: count, y: key, sort})
  );
}

export async function channelDomainNull() {
  return groupNationality({y: "x", order: null, limit: 20});
}

export async function channelDomainNullReverse() {
  return groupNationality({y: "x", order: null, reverse: true, limit: 20});
}

async function weightNationality(sort: PlotType.ChannelDomainSort) {
  const athletes = await d3.csv<any>("data/athletes.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(TickX, {data: athletes, x: "weight", y: "nationality", sort})
  );
}

export async function channelDomainReduceCount() {
  return weightNationality({y: "x", reduce: "count", order: "descending", limit: 20});
}

export async function channelDomainReduceDefault() {
  return weightNationality({y: "x", order: "descending", limit: 20}); // reduce: "max"
}
