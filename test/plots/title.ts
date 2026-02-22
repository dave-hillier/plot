import React from "react";
import {Plot, DotX} from "../../src/react/index.js";
import * as d3 from "d3";
import {html} from "htl";

export async function title() {
  const penguins = await d3.csv("data/penguins.csv", d3.autoType);
  return React.createElement(Plot, {
      title: "A title about penguins",
      subtitle: "A subtitle about body_mass_g",
      color: {legend: true}
    },
    React.createElement(DotX, {data: penguins, x: "body_mass_g", stroke: "species"})
  );
}

export async function titleHtml() {
  const penguins = await d3.csv("data/penguins.csv", d3.autoType);
  return React.createElement(Plot, {
      title: html`<h2>A <i>fancy</i> title about penguins</h2>`,
      subtitle: html`<em>A <tt>fancy</tt> subtitle</em>`
    },
    React.createElement(DotX, {data: penguins, x: "body_mass_g"})
  );
}
