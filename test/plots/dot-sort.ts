import React from "react";
import {Plot, Dot, reverse, sort, shuffle} from "../../src/react/index.js";
import {html} from "htl";

export async function dotSort() {
  const x = [..."ABDCEFGH"];
  const r = [30, 60, 20, 20, 35, 22, 20, 28];
  const options = {x, r, stroke: "black", fill: x, fillOpacity: 0.8};
  const p = {width: 300, axis: null, r: {type: "identity"}, x: {inset: 50}, margin: 0};
  return html`
    ${React.createElement(Plot, {...p, caption: "default sort (r desc)"},
      React.createElement(Dot, {data: x, ...options})
    )}
    <br />
    ${React.createElement(Plot, {...p, caption: "sort by r"},
      React.createElement(Dot, {data: x, ...options, sort: r})
    )}
    <br />
    ${React.createElement(Plot, {...p, caption: "null sort"},
      React.createElement(Dot, {data: x, ...options, sort: null})
    )}
    <br />
    ${React.createElement(Plot, {...p, caption: "reverse"},
      React.createElement(Dot, {data: x, ...reverse(options)})
    )}
    <br />
    ${React.createElement(Plot, {...p, caption: "sort by x"},
      React.createElement(Dot, {data: x, ...sort((d) => d, options)})
    )}
    <br />
    ${React.createElement(Plot, {...p, caption: "reverse sort by x"},
      React.createElement(Dot, {data: x, ...reverse(sort((d) => d, options))})
    )}
    <br />
    ${React.createElement(Plot, {...p, caption: "shuffle"},
      React.createElement(Dot, {data: x, ...shuffle({...options, seed: 42})})
    )}
  `;
}
