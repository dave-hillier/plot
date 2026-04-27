import {Plot, RuleY, Dot} from "../../src/react/index.js";

export async function yearlyRequestsDot() {
  const requests = [
    [new Date("2002-01-01"), 9],
    [new Date("2003-01-01"), 17],
    [new Date("2005-01-01"), 5]
  ];
  return (
    <Plot x={{type: "point", interval: "year", grid: true}} y={{zero: true}}>
      <RuleY data={[0]} />
      <Dot data={requests} />
    </Plot>
  );
}
