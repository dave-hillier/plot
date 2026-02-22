import React from "react";
import {Plot, BarY, groupX} from "../../src/react/index.js";

export async function shorthandGroupBarY() {
  const gene = "AAAAGAGTGAAGATGCTGGAGACGAGTGAAGCATTCACTTTAGGGAAAGCGAGGCAAGAGCGTTTCAGAAGACGAAACCTGGTAGGTGCACTCACCACAG";
  return React.createElement(Plot, {},
    React.createElement(BarY, {data: gene, ...groupX()})
  );
}
