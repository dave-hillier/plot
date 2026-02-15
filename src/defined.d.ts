/** Returns true if the value is not null, not undefined, and not NaN. */
export function defined(x: any): boolean;

/** Comparator that sorts defined values in ascending order, with undefined/NaN last. */
export function ascendingDefined(a: any, b: any): number;

/** Comparator that sorts defined values in descending order, with undefined/NaN last. */
export function descendingDefined(a: any, b: any): number;

/** Returns true if the value is not null, not undefined, and not the empty string. */
export function nonempty(x: any): boolean;

/** Returns x if finite, otherwise NaN. */
export function finite(x: number): number;

/** Returns x if positive and finite, otherwise NaN. */
export function positive(x: number): number;

/** Returns x if negative and finite, otherwise NaN. */
export function negative(x: number): number;
