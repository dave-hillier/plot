import raw from "../public/data/hadcrut-annual.txt?raw";

export default raw
  .trim()
  .split(/\n/g)
  .map((line) => line.split(/\s+/g))
  .map(([year, anomaly]) => ({year: +year, anomaly: +anomaly}));
