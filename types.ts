// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

/** [`<range-spec>`](https://www.rfc-editor.org/rfc/rfc9110#rule.ranges-specifier) representation. */
export type RangeSpec = IntRange | SuffixRange | OtherRange;

/** [`<int-range>`](https://www.rfc-editor.org/rfc/rfc9110#rule.int-range) representation. */
export interface IntRange {
  /** [`<first-pos>`](https://www.rfc-editor.org/rfc/rfc9110#rule.int-range) representation. The number is non-negative integer. */
  readonly firstPos: number;

  /** [`<last-pos>`](https://www.rfc-editor.org/rfc/rfc9110#rule.int-range) representation.The number is non-negative integer. */
  readonly lastPos: number | undefined;
}

/** [`<suffix-range>`](https://www.rfc-editor.org/rfc/rfc9110#rule.suffix-range) representation. */
export interface SuffixRange {
  /** [`<suffix-length>`](https://www.rfc-editor.org/rfc/rfc9110#rule.suffix-range) representation. The number is non-negative integer. */
  readonly suffixLength: number;
}

/** [`<other-range>`](https://www.rfc-editor.org/rfc/rfc9110#rule.other-range) representation. */
export type OtherRange = string;

/** [`<range-set>`](https://www.rfc-editor.org/rfc/rfc9110#range.specifiers) representation. */
export type RangeSet = [RangeSpec, ...RangeSpec[]];

/** [`<ranges-specifier>`](https://www.rfc-editor.org/rfc/rfc9110#rule.ranges-specifier) representation. */
export interface RangesSpecifier {
  /** [`<range-unit>`](https://www.rfc-editor.org/rfc/rfc9110#range.units) representation. */
  readonly rangeUnit: string;

  /** [`<range-set>`](https://www.rfc-editor.org/rfc/rfc9110#range.specifiers) representation. */
  readonly rangeSet: RangeSet;
}

/** [`<Range>`](https://www.rfc-editor.org/rfc/rfc9110#name-range) representation.
 * @see [RFC 9110, 14.2. Range](https://www.rfc-editor.org/rfc/rfc9110#section-14.2)
 */
export type Range = RangesSpecifier;
