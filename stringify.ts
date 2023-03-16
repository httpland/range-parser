// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

import {
  assertRangeUnitFormat,
  isIntRange,
  isOtherRange,
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
  assertRangeUnitFormat(range.rangeUnit);

  const rangeUnit = range.rangeUnit;
  const rangeSet = stringifyRangeSet(range.rangeSet);

  return `${rangeUnit}=${rangeSet}`;
}

/**
 * @throws {TypeError} If the {@link RangeSet} is invalid.
 */
export function stringifyRangeSet(rangeSet: RangeSet): string {
  const rangeSetValue = rangeSet.map(stringifyRangeSpec).join(", ");

  return rangeSetValue;
}

/**
 * @throws {TypeError} If the {@link RangeSpec} is invalid.
 */
export function stringifyRangeSpec(rangeSpec: RangeSpec): string {
  if (isIntRange(rangeSpec)) return stringifyIntRange(rangeSpec);
  if (isOtherRange(rangeSpec)) return stringifyOtherRange(rangeSpec);

  return stringifySuffixRange(rangeSpec);
}

/**
 * @throws {TypeError} If the {@link IntRange} is invalid.
 */
export function stringifyIntRange(intRange: IntRange): string {
  if (!isValidIntRange(intRange)) {
    throw TypeError("<int-range> is invalid.");
  }

  const lastPos = isNumber(intRange.lastPos) ? intRange.lastPos : "";

  return `${intRange.firstPos}-${lastPos}`;
}

/**
 * @throws {TypeError} If the {@link OtherRange} is invalid.
 */
export function stringifyOtherRange(otherRange: OtherRange): string {
  if (!isValidOtherRange(otherRange)) {
    throw TypeError("<other-range> is invalid.");
  }

  return otherRange;
}

/**
 * @throws {TypeError} If the {@link SuffixRange} is invalid.
 */
export function stringifySuffixRange(suffixRange: SuffixRange): string {
  if (!isValidSuffixRange(suffixRange)) {
    throw TypeError("<suffix-range> is invalid.");
  }

  return `-${suffixRange.suffixLength}`;
}
