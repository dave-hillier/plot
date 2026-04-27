import {Plot, Sphere, Graticule} from "../../src/react/index.js";

export async function graticule() {
  return (
    <Plot width={960} height={470} projection={{type: "equal-earth", rotate: [20, 40, 60]}}>
      <Sphere />
      <Graticule />
    </Plot>
  );
}
