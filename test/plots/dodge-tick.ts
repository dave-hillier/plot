import React from "react";
import {Plot, TickX, dodgeY} from "../../src/react/index.js";

export async function dodgeTick() {
  return React.createElement(Plot, {},
    React.createElement(TickX, {data: [1, 2, 3], ...dodgeY()})
  );
}
