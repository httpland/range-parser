// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

import { isNotEmpty, isNumber, isString, trim } from "./deps.ts";
import { isRangeUnitFormat } from "./validate.ts";
import type { Range, RangeSpec, RangesSpecifier } from "./types.ts";

const enum Msg {
  InvalidToken = "Unexpected token",
  InvalidIntRangeSemantic = "<last-pos> is less than <first-pos>",
  Unexpected = "Unreachable",
  InvalidRangeUnit = "invalid <range-unit> syntax.",
}

/** Parses a string into {@link Range}.
 *
 * @example
 * ```ts
 * import { parseRange } from "https://deno.land/x/range_parser@$VERSION/parse.ts";
 * import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
 *
 * const actual = parseRange("bytes=0-100, 200-, -300");
 *
 * assertEquals(actual, {
 *   rangeUnit: "bytes",
 *   rangeSet: [
 *     { firstPos: 0, lastPos: 100 },
 *     { firstPos: 200, lastPos: undefined },
 *     { suffixLength: 300 },
 *   ],
 * });
 * ```
 *
 * @throws {SyntaxError} If the input is invalid `Range` header format.
 * @throws {RangeError} If the input is invalid semantic.
 */
export function parseRange(input: string): Range {
  return parseRangesSpecifier(input);
}

/**
 * @deprecated Rename to {@link parseRange}
 */
export const parse = parseRange;

const ReRangeSpecifier = /^(.*?)=(.*?)$/;

export function parseRangesSpecifier(input: string): RangesSpecifier {
  const result = ReRangeSpecifier.exec(input);

  if (!result || !isString(result[1]) || !isString(result[2])) {
    throw SyntaxError(Msg.InvalidToken);
  }

  const rangeUnit = result[1];

  if (!isRangeUnitFormat(rangeUnit)) {
    throw SyntaxError(`${Msg.InvalidRangeUnit} ${rangeUnit}`);
  }

  const rangeSet = parseRangeSet(result[2]);

  return { rangeUnit, rangeSet };
}

const RangeSpecRe =
  /^((?<firstPos>\d+)-(?<lastPos>\d+)?)$|^(-(?<suffixLength>\d+))$|^(?<otherRange>[\x21-\x2B\x2D-\x7E]+)$/;

export function parseRangeSpec(input: string): RangeSpec {
  const result = RangeSpecRe.exec(input);

  if (!result || !result.groups) {
    throw SyntaxError(Msg.InvalidToken);
  }

  const firstPosStr = result.groups.firstPos;
  const lastPosValue = result.groups.lastPos;
  const suffixLength = result.groups.suffixLength;
  const otherRange = result.groups.otherRange;

  if (isString(firstPosStr)) {
    const firstPos = Number.parseInt(firstPosStr);
    const lastPos = isString(lastPosValue)
      ? Number.parseInt(lastPosValue)
      : undefined;

    if (isNumber(lastPos) && lastPos < firstPos) {
      throw RangeError(Msg.InvalidIntRangeSemantic);
    }

    return { firstPos, lastPos };
  }

  if (isString(suffixLength)) {
    const suffix = Number.parseInt(suffixLength);

    return { suffixLength: suffix };
  }

  if (isString(otherRange)) return otherRange;

  throw SyntaxError(Msg.Unexpected);
}

export function parseRangeSet(input: string): [RangeSpec, ...RangeSpec[]] {
  const ranges = input
    .split(",")
    .map(trim)
    .filter(Boolean)
    .map(parseRangeSpec);

  if (!isNotEmpty(ranges)) throw SyntaxError(Msg.InvalidToken);

  return ranges;
}
