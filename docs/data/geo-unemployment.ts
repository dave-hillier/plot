import {csvParse} from "d3";
import * as topojson from "topojson-client";
import {useDataset} from "../components/useDataset";

// U.S. county features with the unemployment rate merged into properties,
// as used by the geo mark documentation's choropleth example.
async function load() {
  const [us, unemployment] = await Promise.all([
    fetch(`${import.meta.env.BASE_URL}data/us-counties-10m.json`).then((response) => response.json()),
    fetch(`${import.meta.env.BASE_URL}data/us-county-unemployment.csv`)
      .then((response) => response.text())
      .then(csvParse)
  ]);
  const rateById = new Map(unemployment.map((d: any) => [d.id, +d.rate]));
  for (const g of us.objects.counties.geometries) {
    g.properties.unemployment = rateById.get(g.id);
  }
  return (topojson.feature(us, us.objects.counties) as any).features;
}

export function useUnemploymentCounties() {
  return useDataset("geo-unemployment-counties", load);
}
