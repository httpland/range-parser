// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

/**
 * @see https://www.rfc-editor.org/rfc/rfc9110#section-14.1.1-3
 */
export type RangeSpec = IntRange | SuffixRange | OtherRange;

/**
 * @see https://www.rfc-editor.org/rfc/rfc9110#section-14.1.1-5
 */
export interface IntRange {
  /** The number is positive integer. <first-pos> */
  readonly firstPos: number;

  /** The number is positive integer. <last-pos> */
  readonly lastPos: number | undefined;
}

/**
 * @see https://www.rfc-editor.org/rfc/rfc9110#section-14.1.1-5
 */
export interface SuffixRange {
  /** The number is positive integer. <suffix-length> */
  readonly suffixLength: number;
}

/**
 * @see https://www.rfc-editor.org/rfc/rfc9110#section-14.1.1-5
 */
export type OtherRange = string;

/**
 * @see [RFC 9110, 14.1.1. Range Specifiers](https://www.rfc-editor.org/rfc/rfc9110#section-14.1.1)
 */
export type RangeSet = [RangeSpec, ...RangeSpec[]];

/**
 * @see [RFC 9110, 14.1.1. Range Specifiers](https://www.rfc-editor.org/rfc/rfc9110#section-14.1.1)
 */
export interface RangesSpecifier {
  /** <range-unit> */
  readonly rangeUnit: string;

  /** <range-set> */
  readonly rangeSet: RangeSet;
}

/**
 * @see [RFC 9110, 14.2. Range](https://www.rfc-editor.org/rfc/rfc9110#section-14.2)
 */
export type Range = RangesSpecifier;
