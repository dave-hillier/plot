import type {GeoPath, GeoStreamWrapper} from "d3";
import type {MarkOptions} from "./mark.js";

/** Additional rendering context provided to marks and initializers. */
export interface Context {
  /**
   * The current document. Defaults to window.document, but may be overridden
   * via plot options as when rendering plots in a headless environment.
   */
  document: Document;

  /** The current owner SVG element. */
  ownerSVGElement: SVGSVGElement;

  /** The Plot’s (typically generated) class name, for custom styles. */
  className: string;

  /** The current projection, if any. */
  projection?: GeoStreamWrapper;

  /** A function to draw GeoJSON with the current projection, if any, otherwise with the x and y scales. */
  path: () => GeoPath;

  /** The default clip for all marks. */
  clip?: MarkOptions["clip"];

  /** Returns the computed render state for the given mark; set during plot rendering for derived marks such as tips. */
  getMarkState?: (mark: any) => {data: any; facets: any; channels: any};

  /** Holds the figure element produced by the imperative plot() entry; set during plot rendering. */
  figureHolder?: {current: any};

  /** Filters facets lazily for marks such as axes; set during plot rendering. */
  filterFacets?: (data: any, channels: any) => any;

  /** Dispatches an input event with the given value on the figure; set during plot rendering. */
  dispatchValue?: (value: any) => void;
}

/** Creates a rendering context from the given plot options. */
export function createContext(options?: any): Context;
