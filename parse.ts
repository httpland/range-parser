// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

import { isNotEmpty, isNumber, isString, isUndefined, trim } from "./deps.ts";
import type { Range, RangeSpec } from "./types.ts";

const RangeSpecifierRe =
  /^(?<rangeUnit>([!#$%&'*+-.^_`|~A-Za-z0-9])+)=(?<rangeSet>((([0-9])+-(([0-9])+)?)|(-([0-9])+)|([\x21-\x2B\x2D-\x7E]+))((\x20|\t)*,(\x20|\t)*((([0-9])+-(([0-9])+)?)|(-([0-9])+)|([\x21-\x2B\x2D-\x7E]+)))*)$/;

export interface RangesSpecifier {
  readonly rangeUnit: string;
  readonly rangeSet: string;
}

enum Msg {
  InvalidToken = "Unexpected token",
  InvalidIntRangeSemantic = "<last-pos> is less than <first-pos>",
  Unexpected = "Unreachable",
}

/** Parses a string as HTTP `Range` header field and yield JavaScript Object.
 *
 * @example
 * ```ts
 * import { parse } from "https://deno.land/x/range_parser@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
 *
 * const actual = parse("bytes=0-100, 200-, -300");
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
export function parse(input: string): Range {
  input = input.trim();

  const rangesSpecifier = parseRangesSpecifier(input);
  const rangeSet = parseRangeSet(rangesSpecifier.rangeSet);

  return { rangeUnit: rangesSpecifier.rangeUnit, rangeSet };
}

export function parseRangesSpecifier(input: string): RangesSpecifier {
  const result = RangeSpecifierRe.exec(input);

  if (!result || !result.groups) throw SyntaxError();

  const rangeUnit = result.groups.rangeUnit;
  const rangeSet = result.groups.rangeSet;

  if (isUndefined(rangeUnit) || isUndefined(rangeSet)) {
    throw SyntaxError();
  }

  return { rangeUnit, rangeSet };
}

const RangeSpecRe =
  /^((?<firstPos>[0-9]+)-(?<lastPos>[0-9]+)?)$|^(-(?<suffixLength>[0-9]+))$|^(?<otherRange>[\x21-\x2B\x2D-\x7E]+)$/;

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

    if (isNaN(suffix)) throw SyntaxError();

    return { suffixLength: suffix };
  }

  if (isString(otherRange)) return otherRange;

  throw SyntaxError(Msg.Unexpected);
}

export function parseRangeSet(input: string): [RangeSpec, ...RangeSpec[]] {
  const result = input.split(",");

  const ranges = result
    .map(trim)
    .map(parseRangeSpec);

  if (!isNotEmpty(ranges)) throw SyntaxError();

  return ranges;
}
