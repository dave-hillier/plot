import type {ChannelTransform, ChannelValue} from "./channel.js";
import type {Data} from "./mark.js";

/** Array, Float32Array, etc. */
type ArrayishConstructor = (new (...args: any) => any) & {from: (data: Data) => Iterable<any> & ArrayLike<any>};

/**
 * Given some *data* and a channel *value* definition (such as a field name or
 * function accessor), returns an array of the specified *type* containing the
 * corresponding values derived from *data*. If *type* is not specified, it
 * defaults to Array; otherwise it must be an Array or TypedArray subclass.
 *
 * The returned array is not guaranteed to be new; when the *value* is a channel
 * transform or an array that is an instance of the given *type*, the array may
 * be returned as-is without making a copy.
 */
export function valueof(data: Data | null, value: ChannelValue | null, type?: ArrayConstructor): any[] | null;
export function valueof<T extends ArrayishConstructor>(data: Data | null, value: ChannelValue | null, type: T): InstanceType<T> | null; // prettier-ignore

/**
 * Returns a [*column*, *setColumn*] helper for deriving columns; *column* is a
 * channel transform that returns whatever value was most recently passed to
 * *setColumn*. If *setColumn* is not called, then the channel transform returns
 * undefined.
 *
 * If a *source* is specified, then *column*.label exposes the given *source*'s
 * label, if any: if *source* is a string as when representing a named field of
 * data, then *column*.label is *source*; otherwise *column*.label propagates
 * *source*.label. This allows derived columns to propagate a human-readable
 * axis or legend label.
 */
export function column(source?: any): [ChannelTransform, <T>(value: T) => T];

/**
 * A channel transform that returns the data as-is, avoiding an extra copy when
 * defining a channel as being equal to the data. For example, to re-use the
 * given *data* for the **fill** channel:
 *
 * ```js
 * Plot.raster(data, {width: 300, height: 200, fill: Plot.identity})
 * ```
 */
export const identity: ChannelTransform;

/**
 * A channel transform that returns the zero-based index [0, 1, 2, …] of the
 * data; often used as a default for mark shorthand.
 */
export const indexOf: ChannelTransform;

// --- Internal functions used by React layer ---

/** Returns true if the value is a scale options object (not a channel value). */
export function isScaleOptions(value: any): boolean;

/** Coerces the data to an array, or returns null if the data is nullish. */
export function dataify(data: any): any[] | null;

/** Maps an array of values through a function. */
export function map(values: any[], fn: (v: any) => any): any[];

/** Returns a transform function for the given interval, if any. */
export function maybeIntervalTransform(interval: any, type: any): ((v: any) => any) | undefined;

/** Returns the zero-based index array [0, 1, 2, …, data.length - 1] for the given data. */
export function range(data: any): number[];

/** Resolves a number interval specification. */
export function numberInterval(interval: any): any;

/** Returns true if the value is a valid CSS color string. */
export function isColor(value: any): boolean;

/** Returns true if the value is null, undefined, or the string "none". */
export function isNoneish(value: any): boolean;

/**
 * Given a value, returns a [channel, constant] tuple where one is undefined.
 * If the value is a CSS color string, it is treated as a constant; otherwise
 * it is treated as a channel (field name or accessor).
 */
export function maybeColorChannel(value: any, defaultValue?: any): [any, any];

/**
 * Given a value, returns a [channel, constant] tuple where one is undefined.
 * If the value is a number, it is treated as a constant; otherwise it is
 * treated as a channel (field name or accessor).
 */
export function maybeNumberChannel(value: any, defaultValue?: any): [any, any];
