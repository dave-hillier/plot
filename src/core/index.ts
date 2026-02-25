// src/core/index.ts — Pure (non-DOM) functions shared between the imperative
// and React APIs. These modules have no dependency on D3 selections, the DOM,
// or any browser globals. They operate entirely on data structures.
//
// The React layer imports exclusively through this barrel so that the
// boundary between pure computation and DOM rendering is explicit.

// Channel creation and scale inference
export {createChannel, inferChannelScale} from "../channel.js";

// Data formatting
export {formatDefault} from "../format.js";

// Layout dimension computation
export {createDimensions} from "../dimensions.js";

// Faceting (pure subset — facetTranslator is DOM-dependent, kept in facet.js)
export {createFacets, recreateFacets, facetExclude, facetGroups, facetFilter} from "../facet.js";

// Data and scale option utilities
export {
  isScaleOptions,
  isColor,
  isNoneish,
  maybeColorChannel,
  maybeNumberChannel,
  dataify,
  map,
  maybeIntervalTransform,
  range,
  valueof,
  column,
  identity,
  indexOf
} from "../options.js";

// Projection creation
export {createProjection, getGeometryChannels, hasProjection, project, xyProjection} from "../projection.js";

// Scale creation and management
export {createScales, createScaleFunctions, autoScaleRange, innerDimensions} from "../scales.js";

// Scale registry (symbolic constants)
export {
  registry as scaleRegistry,
  position,
  color,
  radius,
  length,
  opacity,
  symbol,
  projection
} from "../scales/index.js";

// Style utilities (pure subset)
export {maybeClassName} from "../style.js";

// Curve resolution
export {maybeCurveAuto} from "../curve.js";

// Value predicates
export {defined, ascendingDefined, descendingDefined, nonempty, finite, positive, negative} from "../defined.js";

// Interval transforms for Rect/Bar marks
export {maybeTrivialIntervalX, maybeTrivialIntervalY, maybeIntervalX, maybeIntervalY} from "../transforms/interval.js";
