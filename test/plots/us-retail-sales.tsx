import {Plot, Line, RuleY} from "../../src/react/index.js";
import * as d3 from "d3";

const parseDate = d3.utcParse("%b-%Y");

export async function usRetailSales() {
  const data = await d3.csv<any>("data/us-retail-sales.csv", ({Date, ...d}) => ({
    Date: parseDate(Date),
    ...d3.autoType(d)
  }));
  return (
    <Plot
      y={{
        grid: true,
        label: "U.S. retail monthly sales (in billions, seasonally-adjusted)",
        transform: (y) => y / 1e3 // convert millions to billions
      }}
    >
      <Line data={data} x="Date" y="Sales" stroke="#bab0ab" />
      <Line data={data} x="Date" y="Seasonally Adjusted Sales" />
      <RuleY data={[0]} />
    </Plot>
  );
}
