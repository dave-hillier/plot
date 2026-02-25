import React from "react";
import {Plot, Sphere, Graticule} from "../../src/react/index.js";

export async function graticule() {
  return React.createElement(Plot, {
      width: 960,
      height: 470,
      projection: {type: "equal-earth", rotate: [20, 40, 60]}
    },
    React.createElement(Sphere),
    React.createElement(Graticule)
  );
}
