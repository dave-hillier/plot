import React from "react";
import {Plot, Text} from "../../src/react/index.js";

export async function hrefFill() {
  return React.createElement(Plot, {},
    React.createElement(Text, {
      data: {length: 1},
      text: ["click me"],
      x: 0,
      y: 0,
      fill: "red",
      href: [`https://google.com/search?q=12345`]
    })
  );
}
