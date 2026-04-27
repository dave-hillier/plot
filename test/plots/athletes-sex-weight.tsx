import {Plot, RectY, RuleY, binX} from "../../src/react/index.js";
import * as d3 from "d3";

export async function athletesSexWeight() {
  const athletes = await d3.csv<any>("data/athletes.csv", d3.autoType);
  return (
    <Plot y={{grid: true}}>
      <RectY
        data={athletes}
        {...binX({y2: "count"}, {x: "weight", fill: "sex", mixBlendMode: "multiply", thresholds: 30})}
      />
      <RuleY data={[0]} />
    </Plot>
  );
}
