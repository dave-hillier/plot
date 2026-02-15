/** A facet descriptor with optional x, y keys and an index. */
export interface FacetDescriptor {
  x?: any;
  y?: any;
  i: number;
  empty?: boolean;
}

/**
 * Creates an array of facet descriptors from the channel-by-scale mappings
 * and plot options. Returns undefined if no facets are configured.
 */
export function createFacets(channelsByScale: Map<string, any[]>, options: any): FacetDescriptor[] | undefined;

/**
 * Filters and reorders facets to match the current fx/fy scale domains.
 */
export function recreateFacets(
  facets: FacetDescriptor[],
  domains: {x?: any[]; y?: any[]}
): FacetDescriptor[];

/**
 * Groups data indices by facet values (fx and/or fy channels).
 * Returns a (possibly nested) Map of grouped indices.
 */
export function facetGroups(data: any, channels: {fx?: any; fy?: any}): Map<any, any>;

/**
 * Returns a function that translates a facet cell's position
 * using the fx/fy scale functions and the plot's margins.
 * The returned function mutates `this` (the SVG element) by setting
 * transform or x/y attributes.
 */
export function facetTranslator(
  fx: ((v: any) => number) | undefined,
  fy: ((v: any) => number) | undefined,
  dimensions: {marginTop: number; marginLeft: number}
): (this: Element, d: FacetDescriptor) => void;

/**
 * For each facet, returns the indices of elements present in *other*
 * facets (used by the "exclude" facet mode).
 */
export function facetExclude(index: number[][]): number[][];

/**
 * Resolves a facet anchor name to a function, or null if the anchor is null.
 */
export function maybeFacetAnchor(facetAnchor: string | null | undefined): Function | null;

/**
 * Filters facet indices using a mark's channel groups.
 * Returns an array of index arrays, one per facet.
 */
export function facetFilter(
  facets: FacetDescriptor[],
  state: {channels: Record<string, any>; groups: Map<any, any>}
): number[][];
