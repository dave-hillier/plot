import React from "react";
import {Plot, Image} from "../../src/react/index.js";

export async function imagePixelated() {
  return React.createElement(Plot, {width: 300, height: 200},
    React.createElement(Image, {
      data: [0],
      frameAnchor: "middle",
      src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAACCAYAAACddGYaAAAAAXNSR0IArs4c6QAAACNJREFUGFdjVBaX/s/TdotBLrqfgfHeXaP/Ek3PGGatfcEAAHifCmZc3SIiAAAAAElFTkSuQmCC",
      width: 300,
      height: 200,
      imageRendering: "pixelated"
    })
  );
}
