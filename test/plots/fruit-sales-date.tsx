import {Plot, BarY, Text, stackY} from "../../src/react/index.js";
import * as d3 from "d3";

export async function fruitSalesDate() {
  const sales = await d3.csv<any>("data/fruit-sales.csv", d3.autoType);
  return (
    <Plot x={{type: "band"}}>
      <BarY data={sales} {...stackY({x: "date", y: "units", fill: "fruit"})} />
      <Text data={sales} {...stackY({x: "date", y: "units", text: "fruit"})} />
    </Plot>
  );
}

export async function fruitSalesSingleDate() {
  const sales = (await d3.csv<any>("data/fruit-sales.csv", d3.autoType)).slice(0, 3);
  return (
    <Plot x={{type: "band"}}>
      <BarY data={sales} {...stackY({x: "date", y: "units", fill: "fruit"})} />
      <Text data={sales} {...stackY({x: "date", y: "units", text: "fruit"})} />
    </Plot>
  );
}
