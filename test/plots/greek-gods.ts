import React from "react";
import {Plot, TreeMark, Link, Dot, Text, treeLink, treeNode} from "../../src/react/index.js";

export async function greekGods() {
  const gods = `Chaos Gaia Mountains
Chaos Gaia Pontus
Chaos Gaia Uranus
Chaos Eros
Chaos Erebus
Chaos Tartarus`
    .split("\n")
    .map((d) => d.replace(/\s+/g, "/"));
  return React.createElement(Plot, {
      axis: null,
      insetLeft: 35,
      insetTop: 20,
      insetBottom: 20,
      insetRight: 120
    },
    React.createElement(TreeMark, {data: gods})
  );
}

export async function greekGodsTip() {
  const gods = `Chaos Gaia Mountains
Chaos Gaia Pontus
Chaos Gaia Uranus
Chaos Eros
Chaos Erebus
Chaos Tartarus`
    .split("\n")
    .map((d) => d.replace(/\s+/g, "/"));
  return React.createElement(Plot, {
      axis: null,
      insetLeft: 35,
      insetTop: 20,
      insetBottom: 20,
      insetRight: 120
    },
    React.createElement(TreeMark, {data: gods, tip: true})
  );
}

export async function greekGodsExplicit() {
  const gods = `Chaos Gaia Mountains
Chaos Gaia Pontus
Chaos Gaia Uranus
Chaos Eros
Chaos Erebus
Chaos Tartarus`.split("\n");
  return React.createElement(Plot, {
      axis: null,
      insetLeft: 10,
      insetTop: 20,
      insetBottom: 20,
      insetRight: 120
    },
    React.createElement(Link, {data: gods, ...treeLink({stroke: "node:internal", delimiter: " "})}),
    React.createElement(Dot, {data: gods, ...treeNode({fill: "node:internal", delimiter: " "})}),
    React.createElement(Text, {data: gods, ...treeNode({text: "node:name", stroke: "white", fill: "currentColor", dx: 6, delimiter: " "})})
  );
}
