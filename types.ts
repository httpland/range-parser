// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

export type RangeSpec = IntRange | SuffixRange;

export interface IntRange {
  readonly firstPos: number;
  readonly lastPos: number | undefined;
}

export interface SuffixRange {
  readonly suffixLength: number;
}

export type RangeSet = [RangeSpec, ...RangeSpec[]];

export interface RangesSpecifier {
  readonly rangeUnit: string;
  readonly rangeSet: string;
}

export interface Range {
  readonly rangeUnit: string;
  readonly rangeSet: RangeSet;
}
