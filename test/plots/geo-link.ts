import React from "react";
import {Plot, Sphere, Graticule, Link} from "../../src/react/index.js";

export async function geoLink() {
  const xy = {x1: [-122.4194], y1: [37.7749], x2: [2.3522], y2: [48.8566]};
  return React.createElement(Plot, {projection: "equal-earth"},
    React.createElement(Sphere),
    React.createElement(Graticule),
    React.createElement(Link, {data: {length: 1}, curve: "linear", strokeOpacity: 0.3, ...xy}),
    React.createElement(Link, {data: {length: 1}, markerEnd: "arrow", ...xy})
  );
}
