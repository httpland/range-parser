// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

export {
  isNonNegativeInteger,
  isNumber,
  isString,
  isUndefined,
} from "https://deno.land/x/isx@1.0.0-beta.24/mod.ts";
export { trim } from "https://deno.land/x/prelude_js@1.0.0-beta.3/mod.ts";

export function isNotEmpty<T>(input: readonly T[]): input is [T, ...T[]] {
  return !!input.length;
}
