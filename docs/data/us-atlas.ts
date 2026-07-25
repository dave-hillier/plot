import * as topojson from "topojson-client";
import {useResource} from "../components/useDataset.js";

async function loadUs() {
  const response = await fetch(`${import.meta.env.BASE_URL}data/us-counties-10m.json`);
  return response.json();
}

export function useNation() {
  return useResource("us-nation", async () => {
    const us = await loadUs();
    return topojson.feature(us, us.objects.nation);
  });
}

// Interior state borders (shared borders only), as a single mesh geometry.
export function useStatemesh() {
  return useResource("us-statemesh", async () => {
    const us = await loadUs();
    return topojson.mesh(us, us.objects.states, (a: any, b: any) => a !== b);
  });
}

export function useStates() {
  return useResource("us-states", async () => {
    const us = await loadUs();
    return (topojson.feature(us, us.objects.states) as any).features;
  });
}

export function useCounties() {
  return useResource("us-counties", async () => {
    const us = await loadUs();
    return (topojson.feature(us, us.objects.counties) as any).features;
  });
}

// County boundary mesh (all county borders).
export function useCountymesh() {
  return useResource("us-countymesh", async () => {
    const us = await loadUs();
    return topojson.mesh(us, us.objects.counties);
  });
}
