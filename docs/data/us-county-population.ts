import {csvParse} from "d3";
import * as topojson from "topojson-client";
import {useDataset, useResource} from "../components/useDataset";

let usPromise: Promise<any> | undefined;

function loadUs() {
  return (usPromise ??= fetch(`${import.meta.env.BASE_URL}data/us-counties-10m.json`).then((response) =>
    response.json()
  ));
}

// U.S. county features from the us-counties-10m atlas, with each county's
// population (from us-county-population.csv) merged into its properties.
async function loadCounties() {
  const [us, population] = await Promise.all([
    loadUs(),
    fetch(`${import.meta.env.BASE_URL}data/us-county-population.csv`)
      .then((response) => response.text())
      .then(csvParse)
  ]);
  const map = new Map(population.map((d: any) => [d.state + d.county, +d.population]));
  us.objects.counties.geometries.forEach((g: any) => (g.properties.population = map.get(g.id)));
  return (topojson.feature(us, us.objects.counties) as any).features;
}

export function useCountiesWithPopulation() {
  return useDataset("us-county-population", loadCounties);
}

// All state borders (including the coastline), as a single mesh geometry.
export function useStatemesh() {
  return useResource("us-statemesh-all", async () => {
    const us = await loadUs();
    return topojson.mesh(us, us.objects.states);
  });
}
