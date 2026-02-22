import React from "react";
import {Dot} from "./Dot.js";

// Minimal Auto mark stub. The imperative auto mark auto-detects the best mark
// type from the data; this React wrapper currently renders as a Dot placeholder.
export function Auto(props: any) {
  return <Dot {...props} />;
}
