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
 * If a *source* is specified, then *column*.label exposes the given *source*’s
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

/** The singleton data used for data-less decoration marks, e.g. frame. */
export const singleton: null[];

/** Returns a channel transform that always returns the given value. */
export const constant: <T>(x: T) => () => T;

/** Coerces the value to a number, passing through null and undefined. */
export const number: (x: any) => number | null | undefined;

/** A filter predicate that accepts everything. */
export const yes: (...args: any[]) => boolean;

/** Validates the input against the allowed keywords, returning the lowercase keyword. */
export function keyword<T extends string>(input: any, name: string, allowed: readonly T[]): T;

/** Like keyword, but returns undefined if the input is nullish. */
export function maybeKeyword<T extends string>(input: any, name: string, allowed: readonly T[]): T | undefined;

/** Coerces the values to an array, materializing iterables; passes through nullish values and typed arrays. */
export function arrayify(values: any): any;

/** Returns true if the value is an iterable (but not a string). */
export function isIterable(value: any): value is Iterable<any>;

/** Returns true if the values are temporal (dates). */
export function isTemporal(values: Iterable<any>): boolean;

/** Returns true if the values are integers representing years. */
export function isYearIntegers(values: Iterable<any>): boolean;

/** Returns true if the value is an interval implementing floor and offset. */
export function isInterval(t: any): boolean;

/** Resolves a range interval specification, which must implement range. */
export function maybeRangeInterval(interval: any, type?: any): any;

/** Returns [channel, constant] for a channel that may be a constant color. */
export function maybeColorChannel(value: any, defaultValue?: any): [any, any];

/** Returns [channel, constant] for a channel that may be a constant number. */
export function maybeNumberChannel(value: any, defaultValue?: any): [any, any];

/** Returns true if the value is a valid CSS color string. */
export function isColor(value: any): boolean;

/** Returns true if the value represents none (e.g. "none" or null). */
export function isNone(value: any): boolean;

/** Returns true if the value is nullish or represents none. */
export function isNoneish(value: any): boolean;

/** Returns the length of the data, if known. */
export function lengthof(data: any): number | undefined;

/** Returns [x, y]; falls back to the tuple accessors when both are undefined. */
export function maybeTuple(x: any, y: any): [any, any];

/** Returns the z (series) channel implied by the z, fill, or stroke options. */
export function maybeZ(options?: {z?: any; fill?: any; stroke?: any}): any;

/** Validates a frame anchor specification, defaulting to middle. */
export function maybeFrameAnchor(value?: any): any;

/** Coerces the value to a string, passing through null and undefined. */
export const string: (x: any) => string | null | undefined;

/** Returns true if the options specify an x or y channel. */
export function hasXY(options: any): boolean;

/** Returns true if the option is a plain options object. */
export function isObject(option: any): boolean;

/** Merges the given options with defaults from the rest, preserving getters. */
export function inherit(options?: any, ...rest: any[]): any;
