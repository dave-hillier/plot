import {Plot, WaffleX, WaffleY, RuleX, RuleY, AxisX, AxisY, identity, pointer, groupX} from "../../src/react/index.js";
import * as d3 from "d3";
import {svg} from "htl";

const demographics = d3.csvParse(
  `group,label,freq
Infants <1,0-1,16467
Children <11,1-11,30098
Teens 12-17,12-17,20354
Adults 18+,18+,12456
Elderly 65+,65+,12456`,
  d3.autoType
);

export function waffleSquished() {
  return (
    <Plot>
      <WaffleX data={[10]} />
    </Plot>
  );
}

export function waffleMultiple() {
  return (
    <Plot y={{inset: 12}}>
      <WaffleY data={[4, 9, 24, 46, 66, 7]} multiple={10} fill="currentColor" />
      <WaffleY data={[-4, -9, -24, -46, -66, -7]} multiple={10} fill="red" />
    </Plot>
  );
}

export function waffleShorthand() {
  return (
    <Plot y={{inset: 12}}>
      <WaffleY data={[4, 9, 24, 46, 66, 7]} fill="currentColor" />
      <WaffleY data={[-4, -9, -24, -46, -66, -7]} fill="red" />
    </Plot>
  );
}

export function waffleStroke() {
  return (
    <Plot y={{inset: 12}}>
      <WaffleY data={[4, 9, 24, 46, 66, 7]} fill="currentColor" stroke="red" gap={0} />
      <WaffleY data={[-4, -9, -24, -46, -66, -7]} fill="red" stroke="currentColor" gap={0} />
    </Plot>
  );
}

export function waffleRound() {
  return (
    <Plot y={{inset: 12}}>
      <WaffleY data={[4, 9, 24, 46, 66, 7]} fill="currentColor" rx="100%" />
      <WaffleY data={[-4, -9, -24, -46, -66, -7]} fill="red" rx="100%" />
    </Plot>
  );
}

export function waffleStrokeMixed() {
  return (
    <Plot y={{insetBottom: 16}}>
      <WaffleY
        data={{length: 6}}
        x={["A", "B", "C", "D", "E", "F"]}
        y1={[-1.1, -2.2, -3.3, -4.4, -5.5, -6.6]}
        y2={[2.3, 4.5, 6.7, 7.8, 9.1, 10.2]}
        unit={0.2}
        fill="currentColor"
        stroke="red"
      />
      <WaffleY
        data={{length: 6}}
        x={["A", "B", "C", "D", "E", "F"]}
        y1={[2.3, 4.5, 6.7, 7.8, 9.1, 10.2]}
        y2={[-1.1, -2.2, -3.3, -4.4, -5.5, -6.6]}
        unit={0.2}
        gap={10}
        fill="red"
      />
      <RuleY data={[0]} />
    </Plot>
  );
}

export function waffleStrokeNegative() {
  return (
    <Plot x={{axis: "top"}}>
      <WaffleY
        data={{length: 6}}
        x={["A", "B", "C", "D", "E", "F"]}
        y1={0}
        y2={[-1.1, -2.2, -3.3, -4.4, -5.5, -6.6]}
        unit={0.2}
        fillOpacity={0.4}
      />
      <WaffleY
        data={{length: 6}}
        x={["A", "B", "C", "D", "E", "F"]}
        y1={[-1.1, -2.2, -3.3, -4.4, -5.5, -6.6]}
        y2={[-2.3, -4.5, -6.7, -7.8, -9.1, -10.2]}
        unit={0.2}
        fill="currentColor"
        stroke="red"
      />
      <WaffleY
        data={{length: 6}}
        x={["A", "B", "C", "D", "E", "F"]}
        y1={[-1.1, -2.2, -3.3, -4.4, -5.5, -6.6]}
        y2={0}
        gap={10}
        unit={0.2}
        fillOpacity={0.4}
      />
      <WaffleY
        data={{length: 6}}
        x={["A", "B", "C", "D", "E", "F"]}
        y1={[-2.3, -4.5, -6.7, -7.8, -9.1, -10.2]}
        y2={[-1.1, -2.2, -3.3, -4.4, -5.5, -6.6]}
        unit={0.2}
        gap={10}
        fill="red"
      />
      <RuleY data={[0]} />
    </Plot>
  );
}

export function waffleStrokePositive() {
  return (
    <Plot>
      <WaffleY
        data={{length: 6}}
        x={["A", "B", "C", "D", "E", "F"]}
        y1={0}
        y2={[1.1, 2.2, 3.3, 4.4, 5.5, 6.6]}
        unit={0.2}
        fillOpacity={0.4}
      />
      <WaffleY
        data={{length: 6}}
        x={["A", "B", "C", "D", "E", "F"]}
        y1={[1.1, 2.2, 3.3, 4.4, 5.5, 6.6]}
        y2={[2.3, 4.5, 6.7, 7.8, 9.1, 10.2]}
        unit={0.2}
        fill="currentColor"
        stroke="red"
      />
      <WaffleY
        data={{length: 6}}
        x={["A", "B", "C", "D", "E", "F"]}
        y1={[1.1, 2.2, 3.3, 4.4, 5.5, 6.6]}
        y2={0}
        gap={10}
        unit={0.2}
        fillOpacity={0.4}
      />
      <WaffleY
        data={{length: 6}}
        x={["A", "B", "C", "D", "E", "F"]}
        y1={[2.3, 4.5, 6.7, 7.8, 9.1, 10.2]}
        y2={[1.1, 2.2, 3.3, 4.4, 5.5, 6.6]}
        unit={0.2}
        gap={10}
        fill="red"
      />
      <RuleY data={[0]} />
    </Plot>
  );
}

export function waffleX() {
  return (
    <Plot marginLeft={80} y={{label: null}} color={{scheme: "cool"}}>
      <AxisX label="Frequency (thousands)" tickFormat={(d) => d / 1000} />
      <WaffleX data={demographics} y="group" fill="group" x="freq" unit={100} sort={{y: null, color: null}} />
      <RuleX data={[0]} />
    </Plot>
  );
}

export function waffleXStacked() {
  return (
    <Plot height={240} color={{scheme: "cool"}}>
      <AxisX label="Frequency (thousands)" tickFormat={(d) => d / 1000} />
      <WaffleX data={demographics} fill="group" x="freq" unit={100} sort={{color: null}} />
      <RuleX data={[0]} />
    </Plot>
  );
}

export function waffleY() {
  return (
    <Plot x={{label: null}} color={{scheme: "cool"}}>
      <AxisY label="Frequency (thousands)" tickFormat={(d) => d / 1000} />
      <WaffleY data={demographics} x="group" fill="group" y="freq" unit={100} sort={{x: null, color: null}} />
      <RuleY data={[0]} />
    </Plot>
  );
}

export function waffleYStacked() {
  return (
    <Plot y={{insetTop: 10}} color={{scheme: "cool", legend: true}}>
      <AxisY label="Frequency (thousands)" tickFormat={(d) => d / 1000} />
      <WaffleY data={demographics} fill="group" y="freq" unit={100} sort={{color: null}} />
      <RuleY data={[0]} />
    </Plot>
  );
}

export async function waffleYGrouped() {
  const athletes = await d3.csv<any>("data/athletes.csv", d3.autoType);
  return (
    <Plot marginBottom={100} x={{tickRotate: -90, label: null}}>
      <WaffleY data={athletes} {...groupX({y: "count"}, {x: "sport", unit: 10})} />
      <RuleY data={[0]} />
    </Plot>
  );
}

export function wafflePointer() {
  const random = d3.randomLcg(42);
  const data = Array.from({length: 100}, (_, i) => ({x: i % 3, fill: random()}));
  return (
    <Plot y={{inset: 12}}>
      <WaffleY data={data} x="x" y={1} fill="#888" />
      <WaffleY data={data} {...pointer({x: "x", y: 1, fill: "fill"})} />
    </Plot>
  );
}

export function wafflePointerFractional() {
  const values = [0.51, 0.99, 0.5, 6, 0.3, 1.6, 9.1, 2, 18, 6, 0.5, 2.5, 46, 34, 20, 7, 0.5, 0.1, 0, 2.5, 1, 0.1, 0.8];
  const multiple = 16;
  return (
    <Plot axis={null} y={{insetTop: 12}} color={{scheme: "Dark2"}}>
      <WaffleY data={values} x={null} multiple={multiple} fill={(d, i) => i % 7} tip={true} />
      {/* TODO: This mark uses a render function with svg tagged template literals */}
      <WaffleY
        data={values}
        x={null}
        multiple={multiple}
        // eslint-disable-next-line
        render={(index, scales, values, dimensions, context, next) => {
          const format = (d: number) => +d.toFixed(2);
          const y1 = (values.channels.y1 as any).source.value;
          const y2 = (values.channels.y2 as any).source.value;
          return svg`<g stroke="black" fill="white" paint-order="stroke" stroke-width="3">${Array.from(
            index,
            (i) =>
              svg`<text ${{
                dy: "0.38em",
                x: values.x[i],
                y: values.y1[i]
              }}>${format(y2[i] - y1[i])}</text>`
          )}</g>`;
        }}
      />
    </Plot>
  );
}

export function waffleTip() {
  return (
    <Plot color={{type: "sqrt", scheme: "spectral"}} y={{inset: 12}}>
      <WaffleY data={[1, 4, 9, 24, 46, 66, 7]} x={null} fill={identity} tip={true} />
    </Plot>
  );
}

export function waffleTipUnit() {
  return (
    <Plot y={{inset: 12}}>
      <WaffleY data={{length: 100}} x={(d, i) => i % 3} y={1} fill={d3.randomLcg(42)} tip={true} />
    </Plot>
  );
}

export function waffleTipFacet() {
  return (
    <Plot>
      <WaffleY data={{length: 500}} x={(d, i) => i % 3} fx={(d, i) => i % 2} y={1} fill={d3.randomLcg(42)} tip={true} />
    </Plot>
  );
}

export function waffleTipX() {
  return (
    <Plot
      style={{overflow: "visible"}}
      color={{type: "sqrt", scheme: "spectral"}}
      x={{label: "quantity"}}
      y={{inset: 12}}
    >
      <WaffleX data={[1, 4, 9, 24, 46, 66, 7]} y={null} fill={identity} tip={true} />
    </Plot>
  );
}

export function waffleTipUnitX() {
  return (
    <Plot height={300} y={{inset: 12}}>
      <WaffleX
        data={{length: 100}}
        multiple={5}
        y={(d, i) => i % 3}
        x={1}
        fill={d3.randomLcg(42)}
        tip={{format: {x: false}}}
      />
    </Plot>
  );
}

export function waffleHref() {
  return (
    <Plot inset={10}>
      <WaffleY
        data={{length: 77}}
        y={1}
        fill={(d, i) => i % 7}
        href={(d, i) => `/?${i}`}
        title={(d, i) => `waffle ${i}`}
        target="_blank"
      />
    </Plot>
  );
}

export function waffleStrokeWidth() {
  return (
    <Plot inset={10}>
      <WaffleY data={{length: 77}} y={1} stroke={(d, i) => i % 7} gap={15} strokeWidth={15} strokeOpacity={0.8} />
    </Plot>
  );
}

export function waffleStrokeWidthConst() {
  return (
    <Plot inset={10}>
      <WaffleY data={{length: 77}} y={1} stroke="black" gap={15} strokeWidth={15} strokeOpacity={0.8} />
    </Plot>
  );
}

export function waffleTipFacetX() {
  return (
    <Plot height={500}>
      <WaffleX data={{length: 500}} y={(d, i) => i % 3} fx={(d, i) => i % 2} x={1} fill={d3.randomLcg(42)} tip={true} />
    </Plot>
  );
}

export function waffleTipFacetXY() {
  return (
    <Plot height={600}>
      <WaffleX
        data={{length: 500}}
        fx={(d, i) => i % 3}
        fy={(d, i) => i % 2}
        x={1}
        fill={d3.randomLcg(42)}
        tip={true}
      />
    </Plot>
  );
}

export function waffleShapes() {
  const k = 10;
  let offset = 0;
  const waffle = (y1, y2) => {
    y1 += offset;
    y2 += offset;
    offset = Math.ceil(y2 / k) * k;
    return <WaffleY data={{length: 1}} y1={y1} y2={y2} multiple={k} fill={y1} stroke="black" />;
  };
  return (
    <Plot height={1200} color={{type: "categorical"}} y={{domain: [0, 300]}}>
      <WaffleY data={{length: 1}} y1={0} y2={300} multiple={10} stroke="currentColor" strokeOpacity={0.2} gap={0} />
      {waffle(0, 1)}
      {waffle(0, 0.5)}
      {waffle(0.2, 0.8)}
      {waffle(0.6, 1.4)}
      {waffle(9.6, 10.4)}
      {waffle(0.6, 2)}
      {waffle(1, 2.4)}
      {waffle(0.6, 2.4)}
      {waffle(1, 3)}
      {waffle(9, 11)}
      {waffle(0.6, 3)}
      {waffle(1, 3.4)}
      {waffle(0.6, 3.4)}
      {waffle(7, 20)}
      {waffle(7.6, 20)}
      {waffle(0, 13)}
      {waffle(0, 12.4)}
      {waffle(7, 23)}
      {waffle(7.6, 22.4)}
    </Plot>
  );
}
