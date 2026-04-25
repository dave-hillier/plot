// Throwaway validation scaffolding for the new <Plot> + useMark contract.
// Renders mark façades via the new useMark contract so unit tests can confirm
// the imperative mount path works end-to-end. Delete once real marks have
// migrated off the legacy stack.
import React from "react";
import {Plot} from "./Plot.js";
import {Frame} from "./marks/Frame.js";
import {RuleX, RuleY} from "./marks/Rule.js";
import {TickX, TickY} from "./marks/Tick.js";

export function validatePlot() {
  return (
    <Plot width={200} height={100}>
      <Frame stroke="black" />
    </Plot>
  );
}

export function validateFrame() {
  return (
    <Plot width={200} height={100}>
      <Frame stroke="black" />
    </Plot>
  );
}

export function validateRuleX() {
  return (
    <Plot width={200} height={100}>
      <RuleX data={[1, 2, 3]} />
    </Plot>
  );
}

export function validateRuleY() {
  return (
    <Plot width={200} height={100}>
      <RuleY data={[1, 2, 3]} />
    </Plot>
  );
}

export function validateTickX() {
  return (
    <Plot width={200} height={100}>
      <TickX data={[1, 2, 3]} />
    </Plot>
  );
}

export function validateTickY() {
  return (
    <Plot width={200} height={100}>
      <TickY data={[1, 2, 3]} />
    </Plot>
  );
}
