import React from "react";
import {Plot, RuleX} from "../../src/react/index.js";
import * as d3 from "d3";

export async function seattlePrecipitationRule() {
  const data = await d3.csv<any>("data/seattle-weather.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(RuleX, {data, x: "date", strokeOpacity: "precipitation"})
  );
}
