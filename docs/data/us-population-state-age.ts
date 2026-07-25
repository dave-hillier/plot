import {csvParse, autoType} from "d3";
import raw from "../public/data/us-population-state-age.csv?raw";

// Convert the wide CSV (one column per age range) to tidy data, keeping the
// list of age ranges (in age order) as an `ages` property on the array.
const wide = csvParse(raw);
const ages = wide.columns.slice(1);
const rows = wide.map((d) => ({...d, ...autoType(d)}) as Record<string, any>);

export default Object.assign(
  ages.flatMap((age) => rows.map((d) => ({state: d.name as string, age, population: d[age] as number}))),
  {ages}
);
