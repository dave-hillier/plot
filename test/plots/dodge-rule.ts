import React from "react";
import {Plot, RuleX, dodgeY} from "../../src/react/index.js";

export async function dodgeRule() {
  return React.createElement(Plot, {},
    React.createElement(RuleX, {data: [1, 2, 3], ...dodgeY()})
  );
}
