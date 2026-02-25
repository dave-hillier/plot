import React from "react";
import {Plot, CellX} from "../../src/react/index.js";

export async function highCardinalityOrdinal() {
  return React.createElement(Plot, {color: {type: "ordinal"}},
    React.createElement(CellX, {data: "ABCDEFGHIJKLMNOPQRSTUVWXYZ"})
  );
}
