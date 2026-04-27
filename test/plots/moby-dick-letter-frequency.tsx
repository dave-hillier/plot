import {Plot, BarY, RuleY, groupX} from "../../src/react/index.js";
import * as d3 from "d3";

export async function mobyDickLetterFrequency() {
  const mobydick = await d3.text("data/moby-dick-chapter-1.txt");
  const letters = [...mobydick].filter((c) => /[a-z]/i.test(c)).map((c) => c.toUpperCase());
  return (
    <Plot y={{grid: true}}>
      <BarY data={letters} {...groupX({y: "count"})} />
      <RuleY data={[0]} />
    </Plot>
  );
}

export async function mobyDickLetterFrequencyFillX() {
  const mobydick = await d3.text("data/moby-dick-chapter-1.txt");
  const letters = [...mobydick].filter((c) => /[a-z]/i.test(c)).map((c) => c.toUpperCase());
  return (
    <Plot y={{grid: true}} color={{scheme: "spectral"}}>
      <BarY data={letters} {...groupX({y: "count", fill: "x"})} />
      <RuleY data={[0]} />
    </Plot>
  );
}
