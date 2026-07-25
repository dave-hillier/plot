import {csvParse, autoType} from "d3";
import {useDataset} from "../components/useDataset";

// Daily San Francisco vs. San Jose temperatures, filtered to 2020 as in the
// upstream docs. Fetched lazily (~160 kB CSV).
async function load() {
  const response = await fetch(`${import.meta.env.BASE_URL}data/sf-sj-temperatures.csv`);
  const raw = await response.text();
  return csvParse(raw)
    .map((d) => ({...d, ...autoType(d)}))
    .filter((d: any) => d.date.getUTCFullYear() === 2020);
}

export function useSfSjTemperatures() {
  return useDataset("sf-sj-temperatures-2020", load);
}
