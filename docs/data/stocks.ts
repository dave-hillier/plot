import {csvParse, autoType} from "d3";
import {useDataset} from "../components/useDataset";
import aapl from "./aapl.ts";

// AAPL, AMZN, GOOG and IBM daily closes combined into one tidy array, each row
// tagged with its ticker Symbol. The three extra CSVs (~280 kB) are fetched
// from the static assets dir at runtime rather than bundled.
async function loadOne(name: string) {
  const response = await fetch(`${import.meta.env.BASE_URL}data/${name}.csv`);
  const raw = await response.text();
  return csvParse(raw).map((d) => ({...d, ...autoType(d)}));
}

async function load() {
  const [amzn, goog, ibm] = await Promise.all([loadOne("amzn"), loadOne("goog"), loadOne("ibm")]);
  const series: [string, any[]][] = [
    ["AAPL", aapl],
    ["AMZN", amzn],
    ["GOOG", goog],
    ["IBM", ibm]
  ];
  return series.flatMap(([Symbol, data]) => data.map((d) => ({Symbol, ...d})));
}

export function useStocks() {
  return useDataset("stocks", load);
}
