# range-parser

HTTP `Range` header field parser.

Compliant with
[RFC 9110, 14.2 Range](https://www.rfc-editor.org/rfc/rfc9110#section-14.2)

## Parsing

Parses a string as HTTP `Range` header field and yield JavaScript Object.

The field naming conventions follow
[RFC 9110, 14.2. Range](https://www.rfc-editor.org/rfc/rfc9110#section-14.2).

```ts
import { parse } from "https://deno.land/x/range_parser@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

const actual = parse("bytes=0-100, 200-, -300, test");

assertEquals(actual, {
  rangeUnit: "bytes",
  rangeSet: [
    { firstPos: 0, lastPos: 100 },
    { firstPos: 200, lastPos: undefined },
    { suffixLength: 300 },
    "test",
  ],
});
```

`rangeSet` is a list of one or more `<int-range>`, `<suffix-range>` and
`other-range` according to the definition of `<range-spec>`.

It has the following data structure:

```ts
interface IntRange {
  firstPos: number;
  lastPos: number | undefined;
}
interface SuffixRange {
  suffixLength: number;
}
type OtherRange = string;
```

### Throwing error

Throws `SyntaxError` if it detects invalid syntax.

```ts
import { parse } from "https://deno.land/x/range_parser@$VERSION/mod.ts";
import { assertThrows } from "https://deno.land/std/testing/asserts.ts";

assertThrows(() => parse("<invalid:input>"));
```

## Utils

We provide some utilities.

### isIntRange

Whether the `RangeSpec` is `IntRange` or not.

```ts
import {
  type IntRange,
  isIntRange,
  type OtherRange,
  type SuffixRange,
} from "https://deno.land/x/range_parser@$VERSION/mod.ts";
import { assert } from "https://deno.land/std/testing/asserts.ts";

declare const intRange: IntRange;
declare const suffixRange: SuffixRange;
declare const otherRange: OtherRange;

assert(isIntRange(intRange));
assert(!isIntRange(suffixRange));
assert(!isIntRange(otherRange));
```

### isSuffixRange

Whether the `RangeSpec` is `SuffixRange` or not.

```ts
import {
  type IntRange,
  isSuffixRange,
  type OtherRange,
  type SuffixRange,
} from "https://deno.land/x/range_parser@$VERSION/mod.ts";
import { assert } from "https://deno.land/std/testing/asserts.ts";

declare const intRange: IntRange;
declare const suffixRange: SuffixRange;
declare const otherRange: OtherRange;

assert(isSuffixRange(suffixRange));
assert(!isSuffixRange(intRange));
assert(!isSuffixRange(otherRange));
```

### isOtherRange

Whether the `RangeSpec` is `OtherRange` or not.

```ts
import {
  type IntRange,
  isOtherRange,
  type OtherRange,
  type SuffixRange,
} from "https://deno.land/x/range_parser@$VERSION/mod.ts";
import { assert } from "https://deno.land/std/testing/asserts.ts";

declare const intRange: IntRange;
declare const suffixRange: SuffixRange;
declare const otherRange: OtherRange;

assert(isOtherRange(otherRange));
assert(!isOtherRange(intRange));
assert(!isOtherRange(suffixRange));
```

## License

Copyright © 2023-present [httpland](https://github.com/httpland).

Released under the [MIT](./LICENSE) license
