import {Replot, Dot, reverse, sort, shuffle} from "../../src/react/index.js";
import {html} from "htl";

export async function dotSort() {
  const x = [..."ABDCEFGH"];
  const r = [30, 60, 20, 20, 35, 22, 20, 28];
  const options = {x, r, stroke: "black", fill: x, fillOpacity: 0.8};
  const p = {width: 300, axis: null, r: {type: "identity"}, x: {inset: 50}, margin: 0};
  return html`
    ${(
      <Replot {...p} caption="default sort (r desc)">
        <Dot data={x} {...options} />
      </Replot>
    )}
    <br />
    ${(
      <Replot {...p} caption="sort by r">
        <Dot data={x} {...options} sort={r} />
      </Replot>
    )}
    <br />
    ${(
      <Replot {...p} caption="null sort">
        <Dot data={x} {...options} sort={null} />
      </Replot>
    )}
    <br />
    ${(
      <Replot {...p} caption="reverse">
        <Dot data={x} {...reverse(options)} />
      </Replot>
    )}
    <br />
    ${(
      <Replot {...p} caption="sort by x">
        <Dot data={x} {...sort((d) => d, options)} />
      </Replot>
    )}
    <br />
    ${(
      <Replot {...p} caption="reverse sort by x">
        <Dot data={x} {...reverse(sort((d) => d, options))} />
      </Replot>
    )}
    <br />
    ${(
      <Replot {...p} caption="shuffle">
        <Dot data={x} {...shuffle({...options, seed: 42})} />
      </Replot>
    )}
  `;
}
