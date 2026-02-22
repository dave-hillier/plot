import React from "react";
import {Plot, Frame, Text} from "../../src/react/index.js";

export async function thisIsJustToSay() {
  return React.createElement(Plot, {height: 200},
    React.createElement(Frame, {}),
    React.createElement(Text, {
      data: [
        `This Is Just To Say\nWilliam Carlos Williams, 1934\n\nI have eaten\nthe plums\nthat were in\nthe icebox\n\nand which\nyou were probably\nsaving\nfor breakfast\n\nForgive me\nthey were delicious\nso sweet\nand so cold`
      ],
      frameAnchor: "middle"
    })
  );
}
