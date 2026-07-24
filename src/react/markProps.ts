import type {Data, MarkOptions} from "../mark.js";
import type {MarkEventHandlers} from "./useMark.js";

// Shared base props for every mark component. MarkOptions (src/mark.d.ts)
// already carries the full shared surface — channel props (fill, stroke,
// opacity, …) as ChannelValueSpec, constant style props, and the common mark
// options (tip, sort, filter, facet, fx, fy, clip, transform, initializer,
// render, channels, …) — so mark props inherit it rather than redeclare it.
//
// The index signature keeps the surface OPEN by design, not closed: mark
// props spread wholesale into the imperative mark factory, after any
// enclosing transform wrappers rewrite them, so options that are valid to
// Plot but not declared on the mark's interface must not become type
// errors. Concretely: transform-consumed channels live on the mark inside a
// wrapper (e.g. z under <DodgeY>, or bin inputs under <BinX>), the channels
// meta-option can declare arbitrary extra channels, and the ported .d.ts
// layer still lags the runtime in places. A closed interface would reject
// those valid usages; `unknown` (rather than a narrower union) is used
// because option values legitimately span strings, numbers, booleans,
// arrays, accessor functions, intervals, and nested spec objects. The
// tradeoff — misspelled prop names are not flagged — is accepted; values of
// every declared prop are still type-checked.
//
// MarkEventHandlers contributes the per-mark event handler props (onClick,
// onPointerEnter, onPointerLeave, onPointerMove). useMark strips them from
// the imperative mark options and routes them through the registration so
// <Plot> can attach them to the rendered elements with the datum index
// closed over.
export interface MarkProps extends MarkOptions, MarkEventHandlers {
  data?: Data;
  [option: string]: unknown;
}
