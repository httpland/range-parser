// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

import {
  isIntRange,
  isOtherRange,
  isRangeUnitFormat,
  isValidIntRange,
  isValidOtherRange,
  isValidSuffixRange,
} from "./validate.ts";
import { isNumber } from "./deps.ts";
import type {
  IntRange,
  OtherRange,
  Range,
  RangeSet,
  RangeSpec,
  SuffixRange,
} from "./types.ts";

/** Serializes {@link Range} into string.
 *
 * @example
 * ```ts
 * import { stringify } from "https://deno.land/x/range_parser@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
 *
 * assertEquals(
 *   stringify({
 *     rangeUnit: "bytes",
 *     rangeSet: [{ firstPos: 0, lastPos: 100 }, { suffixLength: 200 }],
 *   }),
 *   "bytes=0-100, -200",
 * );
 * ```
 *
 * @throws {TypeError} If the {@link Range} is invalid.
 */
export function stringify(range: Range): string {
  const rangeUnit = stringifyRangeUnit(range.rangeUnit);
  const rangeSet = stringifyRangeSet(range.rangeSet);

  return `${rangeUnit}=${rangeSet}`;
}

/**
 * @throws {TypeError} If the input is invalid `<range-unit>`.
 */
export function stringifyRangeUnit(rangeUnit: string): string {
  if (!isRangeUnitFormat(rangeUnit)) {
    throw TypeError("<range-unit> is invalid.");
  }

  return rangeUnit;
}

/**
 * @throws {TypeError} If the {@link RangeSet} is invalid.
 */
export function stringifyRangeSet(rangeSet: RangeSet): string {
  const rangeSetValue = rangeSet.map(stringifyRangeSpec).join(", ");

  return rangeSetValue;
}

export function stringifyRangeSpec(rangeSpec: RangeSpec): string {
  if (isIntRange(rangeSpec)) return stringifyIntRange(rangeSpec);
  if (isOtherRange(rangeSpec)) return stringifyOtherRange(rangeSpec);

  return stringifySuffixRange(rangeSpec);
}

export function stringifyIntRange(intRange: IntRange): string {
  if (!isValidIntRange(intRange)) {
    throw TypeError("<int-range> is invalid.");
  }

  const lastPos = isNumber(intRange.lastPos) ? intRange.lastPos : "";

  return `${intRange.firstPos}-${lastPos}`;
}

export function stringifyOtherRange(otherRange: OtherRange): string {
  if (!isValidOtherRange(otherRange)) {
    throw TypeError("<other-range> is invalid.");
  }

  return otherRange;
}

export function stringifySuffixRange(suffixRange: SuffixRange): string {
  if (!isValidSuffixRange(suffixRange)) {
    throw TypeError("<suffix-range> is invalid.");
  }

  return `-${suffixRange.suffixLength}`;
}
