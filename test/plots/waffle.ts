import React from "react";
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
  return React.createElement(Plot, {},
    React.createElement(WaffleX, {data: [10]})
  );
}

export function waffleMultiple() {
  return React.createElement(Plot, {y: {inset: 12}},
    React.createElement(WaffleY, {data: [4, 9, 24, 46, 66, 7], multiple: 10, fill: "currentColor"}),
    React.createElement(WaffleY, {data: [-4, -9, -24, -46, -66, -7], multiple: 10, fill: "red"})
  );
}

export function waffleShorthand() {
  return React.createElement(Plot, {y: {inset: 12}},
    React.createElement(WaffleY, {data: [4, 9, 24, 46, 66, 7], fill: "currentColor"}),
    React.createElement(WaffleY, {data: [-4, -9, -24, -46, -66, -7], fill: "red"})
  );
}

export function waffleStroke() {
  return React.createElement(Plot, {y: {inset: 12}},
    React.createElement(WaffleY, {data: [4, 9, 24, 46, 66, 7], fill: "currentColor", stroke: "red", gap: 0}),
    React.createElement(WaffleY, {data: [-4, -9, -24, -46, -66, -7], fill: "red", stroke: "currentColor", gap: 0})
  );
}

export function waffleRound() {
  return React.createElement(Plot, {y: {inset: 12}},
    React.createElement(WaffleY, {data: [4, 9, 24, 46, 66, 7], fill: "currentColor", rx: "100%"}),
    React.createElement(WaffleY, {data: [-4, -9, -24, -46, -66, -7], fill: "red", rx: "100%"})
  );
}

export function waffleStrokeMixed() {
  return React.createElement(Plot, {y: {insetBottom: 16}},
    React.createElement(WaffleY, {
      data: {length: 6},
      x: ["A", "B", "C", "D", "E", "F"],
      y1: [-1.1, -2.2, -3.3, -4.4, -5.5, -6.6],
      y2: [2.3, 4.5, 6.7, 7.8, 9.1, 10.2],
      unit: 0.2,
      fill: "currentColor",
      stroke: "red"
    }),
    React.createElement(WaffleY, {
      data: {length: 6},
      x: ["A", "B", "C", "D", "E", "F"],
      y1: [2.3, 4.5, 6.7, 7.8, 9.1, 10.2],
      y2: [-1.1, -2.2, -3.3, -4.4, -5.5, -6.6],
      unit: 0.2,
      gap: 10,
      fill: "red"
    }),
    React.createElement(RuleY, {data: [0]})
  );
}

export function waffleStrokeNegative() {
  return React.createElement(Plot, {x: {axis: "top"}},
    React.createElement(WaffleY, {
      data: {length: 6},
      x: ["A", "B", "C", "D", "E", "F"],
      y1: 0,
      y2: [-1.1, -2.2, -3.3, -4.4, -5.5, -6.6],
      unit: 0.2,
      fillOpacity: 0.4
    }),
    React.createElement(WaffleY, {
      data: {length: 6},
      x: ["A", "B", "C", "D", "E", "F"],
      y1: [-1.1, -2.2, -3.3, -4.4, -5.5, -6.6],
      y2: [-2.3, -4.5, -6.7, -7.8, -9.1, -10.2],
      unit: 0.2,
      fill: "currentColor",
      stroke: "red"
    }),
    React.createElement(WaffleY, {
      data: {length: 6},
      x: ["A", "B", "C", "D", "E", "F"],
      y1: [-1.1, -2.2, -3.3, -4.4, -5.5, -6.6],
      y2: 0,
      gap: 10,
      unit: 0.2,
      fillOpacity: 0.4
    }),
    React.createElement(WaffleY, {
      data: {length: 6},
      x: ["A", "B", "C", "D", "E", "F"],
      y1: [-2.3, -4.5, -6.7, -7.8, -9.1, -10.2],
      y2: [-1.1, -2.2, -3.3, -4.4, -5.5, -6.6],
      unit: 0.2,
      gap: 10,
      fill: "red"
    }),
    React.createElement(RuleY, {data: [0]})
  );
}

export function waffleStrokePositive() {
  return React.createElement(Plot, {},
    React.createElement(WaffleY, {
      data: {length: 6},
      x: ["A", "B", "C", "D", "E", "F"],
      y1: 0,
      y2: [1.1, 2.2, 3.3, 4.4, 5.5, 6.6],
      unit: 0.2,
      fillOpacity: 0.4
    }),
    React.createElement(WaffleY, {
      data: {length: 6},
      x: ["A", "B", "C", "D", "E", "F"],
      y1: [1.1, 2.2, 3.3, 4.4, 5.5, 6.6],
      y2: [2.3, 4.5, 6.7, 7.8, 9.1, 10.2],
      unit: 0.2,
      fill: "currentColor",
      stroke: "red"
    }),
    React.createElement(WaffleY, {
      data: {length: 6},
      x: ["A", "B", "C", "D", "E", "F"],
      y1: [1.1, 2.2, 3.3, 4.4, 5.5, 6.6],
      y2: 0,
      gap: 10,
      unit: 0.2,
      fillOpacity: 0.4
    }),
    React.createElement(WaffleY, {
      data: {length: 6},
      x: ["A", "B", "C", "D", "E", "F"],
      y1: [2.3, 4.5, 6.7, 7.8, 9.1, 10.2],
      y2: [1.1, 2.2, 3.3, 4.4, 5.5, 6.6],
      unit: 0.2,
      gap: 10,
      fill: "red"
    }),
    React.createElement(RuleY, {data: [0]})
  );
}

export function waffleX() {
  return React.createElement(Plot, {
      marginLeft: 80,
      y: {label: null},
      color: {scheme: "cool"}
    },
    React.createElement(AxisX, {label: "Frequency (thousands)", tickFormat: (d) => d / 1000}),
    React.createElement(WaffleX, {data: demographics, y: "group", fill: "group", x: "freq", unit: 100, sort: {y: null, color: null}}),
    React.createElement(RuleX, {data: [0]})
  );
}

export function waffleXStacked() {
  return React.createElement(Plot, {
      height: 240,
      color: {scheme: "cool"}
    },
    React.createElement(AxisX, {label: "Frequency (thousands)", tickFormat: (d) => d / 1000}),
    React.createElement(WaffleX, {data: demographics, fill: "group", x: "freq", unit: 100, sort: {color: null}}),
    React.createElement(RuleX, {data: [0]})
  );
}

export function waffleY() {
  return React.createElement(Plot, {
      x: {label: null},
      color: {scheme: "cool"}
    },
    React.createElement(AxisY, {label: "Frequency (thousands)", tickFormat: (d) => d / 1000}),
    React.createElement(WaffleY, {data: demographics, x: "group", fill: "group", y: "freq", unit: 100, sort: {x: null, color: null}}),
    React.createElement(RuleY, {data: [0]})
  );
}

export function waffleYStacked() {
  return React.createElement(Plot, {
      y: {insetTop: 10},
      color: {scheme: "cool", legend: true}
    },
    React.createElement(AxisY, {label: "Frequency (thousands)", tickFormat: (d) => d / 1000}),
    React.createElement(WaffleY, {data: demographics, fill: "group", y: "freq", unit: 100, sort: {color: null}}),
    React.createElement(RuleY, {data: [0]})
  );
}

export async function waffleYGrouped() {
  const athletes = await d3.csv<any>("data/athletes.csv", d3.autoType);
  return React.createElement(Plot, {
      marginBottom: 100,
      x: {tickRotate: -90, label: null}
    },
    React.createElement(WaffleY, {data: athletes, ...groupX({y: "count"}, {x: "sport", unit: 10})}),
    React.createElement(RuleY, {data: [0]})
  );
}

export function wafflePointer() {
  const random = d3.randomLcg(42);
  const data = Array.from({length: 100}, (_, i) => ({x: i % 3, fill: random()}));
  return React.createElement(Plot, {y: {inset: 12}},
    React.createElement(WaffleY, {data, x: "x", y: 1, fill: "#888"}),
    React.createElement(WaffleY, {data, ...pointer({x: "x", y: 1, fill: "fill"})})
  );
}

export function wafflePointerFractional() {
  const values = [0.51, 0.99, 0.5, 6, 0.3, 1.6, 9.1, 2, 18, 6, 0.5, 2.5, 46, 34, 20, 7, 0.5, 0.1, 0, 2.5, 1, 0.1, 0.8];
  const multiple = 16;
  return React.createElement(Plot, {
      axis: null,
      y: {insetTop: 12},
      color: {scheme: "Dark2"}
    },
    React.createElement(WaffleY, {
      data: values,
      x: null,
      multiple,
      fill: (d, i) => i % 7,
      tip: true
    }),
    // TODO: This mark uses a render function with svg tagged template literals
    React.createElement(WaffleY, {
      data: values,
      x: null,
      multiple,
      // eslint-disable-next-line
      render: (index, scales, values, dimensions, context, next) => {
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
      }
    })
  );
}

export function waffleTip() {
  return React.createElement(Plot, {
      color: {type: "sqrt", scheme: "spectral"},
      y: {inset: 12}
    },
    React.createElement(WaffleY, {data: [1, 4, 9, 24, 46, 66, 7], x: null, fill: identity, tip: true})
  );
}

export function waffleTipUnit() {
  return React.createElement(Plot, {y: {inset: 12}},
    React.createElement(WaffleY, {data: {length: 100}, x: (d, i) => i % 3, y: 1, fill: d3.randomLcg(42), tip: true})
  );
}

export function waffleTipFacet() {
  return React.createElement(Plot, {},
    React.createElement(WaffleY, {data: {length: 500}, x: (d, i) => i % 3, fx: (d, i) => i % 2, y: 1, fill: d3.randomLcg(42), tip: true})
  );
}

export function waffleTipX() {
  return React.createElement(Plot, {
      style: {overflow: "visible"},
      color: {type: "sqrt", scheme: "spectral"},
      x: {label: "quantity"},
      y: {inset: 12}
    },
    React.createElement(WaffleX, {data: [1, 4, 9, 24, 46, 66, 7], y: null, fill: identity, tip: true})
  );
}

export function waffleTipUnitX() {
  return React.createElement(Plot, {
      height: 300,
      y: {inset: 12}
    },
    React.createElement(WaffleX, {
      data: {length: 100},
      multiple: 5,
      y: (d, i) => i % 3,
      x: 1,
      fill: d3.randomLcg(42),
      tip: {format: {x: false}}
    })
  );
}

export function waffleHref() {
  return React.createElement(Plot, {inset: 10},
    React.createElement(WaffleY, {
      data: {length: 77},
      y: 1,
      fill: (d, i) => i % 7,
      href: (d, i) => `/?${i}`,
      title: (d, i) => `waffle ${i}`,
      target: "_blank"
    })
  );
}

export function waffleStrokeWidth() {
  return React.createElement(Plot, {inset: 10},
    React.createElement(WaffleY, {data: {length: 77}, y: 1, stroke: (d, i) => i % 7, gap: 15, strokeWidth: 15, strokeOpacity: 0.8})
  );
}

export function waffleStrokeWidthConst() {
  return React.createElement(Plot, {inset: 10},
    React.createElement(WaffleY, {data: {length: 77}, y: 1, stroke: "black", gap: 15, strokeWidth: 15, strokeOpacity: 0.8})
  );
}

export function waffleTipFacetX() {
  return React.createElement(Plot, {height: 500},
    React.createElement(WaffleX, {data: {length: 500}, y: (d, i) => i % 3, fx: (d, i) => i % 2, x: 1, fill: d3.randomLcg(42), tip: true})
  );
}

export function waffleTipFacetXY() {
  return React.createElement(Plot, {height: 600},
    React.createElement(WaffleX, {data: {length: 500}, fx: (d, i) => i % 3, fy: (d, i) => i % 2, x: 1, fill: d3.randomLcg(42), tip: true})
  );
}

export function waffleShapes() {
  const k = 10;
  let offset = 0;
  const waffle = (y1, y2) => {
    y1 += offset;
    y2 += offset;
    offset = Math.ceil(y2 / k) * k;
    return React.createElement(WaffleY, {data: {length: 1}, y1, y2, multiple: k, fill: y1, stroke: "black"});
  };
  return React.createElement(Plot, {
      height: 1200,
      color: {type: "categorical"},
      y: {domain: [0, 300]}
    },
    React.createElement(WaffleY, {data: {length: 1}, y1: 0, y2: 300, multiple: 10, stroke: "currentColor", strokeOpacity: 0.2, gap: 0}),
    waffle(0, 1),
    waffle(0, 0.5),
    waffle(0.2, 0.8),
    waffle(0.6, 1.4),
    waffle(9.6, 10.4),
    waffle(0.6, 2),
    waffle(1, 2.4),
    waffle(0.6, 2.4),
    waffle(1, 3),
    waffle(9, 11),
    waffle(0.6, 3),
    waffle(1, 3.4),
    waffle(0.6, 3.4),
    waffle(7, 20),
    waffle(7.6, 20),
    waffle(0, 13),
    waffle(0, 12.4),
    waffle(7, 23),
    waffle(7.6, 22.4)
  );
}
