import {csvParse} from "d3";
import * as topojson from "topojson-client";
import {useDataset} from "../components/useDataset";

// U.S. county features with population and the 2020 presidential election
// margin merged into properties, as used by the vector mark documentation.
async function load() {
  const [us, population, election] = await Promise.all([
    fetch(`${import.meta.env.BASE_URL}data/us-counties-10m.json`).then((response) => response.json()),
    fetch(`${import.meta.env.BASE_URL}data/us-county-population.csv`)
      .then((response) => response.text())
      .then(csvParse),
    fetch(`${import.meta.env.BASE_URL}data/us-presidential-election-2020.csv`)
      .then((response) => response.text())
      .then(csvParse)
  ]);
  const populationById = new Map(population.map((d: any) => [d.state + d.county, +d.population]));
  const electionById = new Map(election.map((d: any) => [d.fips, d]));
  for (const g of us.objects.counties.geometries) {
    g.properties.population = populationById.get(g.id);
    const e: any = electionById.get(g.id);
    if (e) {
      g.properties.margin2020 = +e.margin2020;
      g.properties.votes = +e.votes;
    }
  }
  return (topojson.feature(us, us.objects.counties) as any).features;
}

export function useElectionCounties() {
  return useDataset("vector-election-counties", load);
}
