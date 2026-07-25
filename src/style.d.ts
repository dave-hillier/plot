/**
 * Resolves the plot class name. If name is undefined, returns the default
 * class name ("replot-d6a7b5"); otherwise validates and returns the given name.
 */
export function maybeClassName(name?: string): string;

/** The sub-pixel offset used for crisp edges on low-DPI displays. */
export const offset: number;

/** Sets the sub-pixel offset used for crisp edges; for tests. */
export function setOffset(o: number): void;

/** Applies the mark’s transform attribute to the given selection. */
export function applyTransform(selection: any, mark: any, scales: {x?: any; y?: any}, tx?: number, ty?: number): void;

/** Returns a unique clip path ID string. */
export function getClipId(): string;

/** Returns a unique pattern ID string. */
export function getPatternId(): string;

export function impliedString(value: any, impliedValue: string): string | undefined;
export function impliedNumber(value: any, impliedValue: number): number | undefined;

/** Returns the [cx, cy] frame anchor position for the given mark and dimensions. */
export function applyFrameAnchor(mark: any, dimensions: any): [number, number];
