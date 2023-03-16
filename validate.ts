// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

import {
  isNonNegativeInteger,
  isNumber,
  isString,
  isUndefined,
} from "./deps.ts";
import { RangeSet, RangeSpecifierRe, ReOtherRange } from "./parse.ts";
import type { IntRange, OtherRange, RangeSpec, SuffixRange } from "./types.ts";

/** Whether the {@link RangeSpec} is {@link IntRange} or not.
 *
 * @example
 * ```ts
 * import {
 *   type IntRange,
 *   isIntRange,
 *   type OtherRange,
 *   type SuffixRange,
 * } from "https://deno.land/x/range_parser@$VERSION/mod.ts";
 * import { assert } from "https://deno.land/std/testing/asserts.ts";
 *
 * declare const intRange: IntRange;
 * declare const suffixRange: SuffixRange;
 * declare const otherRange: OtherRange;
 *
 * assert(isIntRange(intRange));
 * assert(!isIntRange(suffixRange));
 * assert(!isIntRange(otherRange));
 * ```
 */
export function isIntRange(rangeSpec: RangeSpec): rangeSpec is IntRange {
  return !isString(rangeSpec) && "firstPos" in rangeSpec;
}

/** Whether the {@link RangeSpec} is {@link SuffixRange} or not.
 *
 * @example
 * ```ts
 * import {
 *   type IntRange,
 *   isSuffixRange,
 *   type OtherRange,
 *   type SuffixRange,
 * } from "https://deno.land/x/range_parser@$VERSION/mod.ts";
 * import { assert } from "https://deno.land/std/testing/asserts.ts";
 *
 * declare const intRange: IntRange;
 * declare const suffixRange: SuffixRange;
 * declare const otherRange: OtherRange;
 *
 * assert(isSuffixRange(suffixRange));
 * assert(!isSuffixRange(intRange));
 * assert(!isSuffixRange(otherRange));
 * ```
 */
export function isSuffixRange(rangeSpec: RangeSpec): rangeSpec is SuffixRange {
  return !isString(rangeSpec) && "suffixLength" in rangeSpec;
}

/** Whether the {@link RangeSpec} is {@link OtherRange} or not.
 *
 * @example
 * ```ts
 * import {
 *   type IntRange,
 *   isOtherRange,
 *   type OtherRange,
 *   type SuffixRange,
 * } from "https://deno.land/x/range_parser@$VERSION/mod.ts";
 * import { assert } from "https://deno.land/std/testing/asserts.ts";
 *
 * declare const intRange: IntRange;
 * declare const suffixRange: SuffixRange;
 * declare const otherRange: OtherRange;
 *
 * assert(isOtherRange(otherRange));
 * assert(!isOtherRange(intRange));
 * assert(!isOtherRange(suffixRange));
 * ```
 */
export function isOtherRange(rangeSpec: RangeSpec): rangeSpec is OtherRange {
  return isString(rangeSpec);
}

/** Whether the {@link IntRange} is valid or not. */
export function isValidIntRange(intRange: IntRange): boolean {
  return isNonNegativeInteger(intRange.firstPos) &&
    (
      isUndefined(intRange.lastPos) ||
      (isNumber(intRange.lastPos) &&
        isNonNegativeInteger(intRange.lastPos) &&
        intRange.firstPos <= intRange.lastPos)
    );
}

/** Whether the {@link SuffixRange} is valid or not. */
export function isValidSuffixRange(suffixRange: SuffixRange): boolean {
  return isNonNegativeInteger(suffixRange.suffixLength);
}

/** Whether the {@link OtherRange} is valid or not. */
export function isValidOtherRange(otherRange: OtherRange): boolean {
  return ReOtherRange.test(otherRange);
}

/** Whether the input is HTTP `Range` header field format or not.
 *
 * @example
 * ```ts
 * import { isRangeFormat } from "https://deno.land/x/range_parser@$VERSION/mod.ts";
 * import { assert } from "https://deno.land/std/testing/asserts.ts";
 *
 * assert(isRangeFormat("bytes=0-100, 200-, -500"));
 * assert(!isRangeFormat("<invalid>"));
 * ```
 */
export function isRangeFormat(input: string): boolean {
  return RangeSpecifierRe.test(input.trim());
}

/** Whether the input is `<range-unit>` format or not. */
export function isRangeUnitFormat(input: string): boolean {
  return RangeSet.test(input);
}

/** Assert for `<range-unit>` format.
 * @throws {TypeError} If the input is not `<range-unit>` format.
 */
export function assertRangeUnitFormat(input: string): asserts input {
  if (!isRangeUnitFormat(input)) {
    throw TypeError("invalid <range-unit> format.");
  }
}
