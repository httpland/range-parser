# range-parser

[![deno land](http://img.shields.io/badge/available%20on-deno.land/x-lightgrey.svg?logo=deno)](https://deno.land/x/range_parser)
[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/x/range_parser/mod.ts)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/httpland/range-parser)](https://github.com/httpland/range-parser/releases)
[![codecov](https://codecov.io/github/httpland/range-parser/branch/main/graph/badge.svg?token=MNFZEQH8OK)](https://codecov.io/gh/httpland/range-parser)
[![GitHub](https://img.shields.io/github/license/httpland/range-parser)](https://github.com/httpland/range-parser/blob/main/LICENSE)

[![test](https://github.com/httpland/range-parser/actions/workflows/test.yaml/badge.svg)](https://github.com/httpland/range-parser/actions/workflows/test.yaml)
[![NPM](https://nodei.co/npm/@httpland/range-parser.png?mini=true)](https://nodei.co/npm/@httpland/range-parser/)

HTTP `Range` header field parser.

Compliant with
[RFC 9110, 14.2 Range](https://www.rfc-editor.org/rfc/rfc9110#section-14.2)

## Deserialization

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
`<other-range>` according to the definition of `<range-spec>`.

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

### Parsing specification

The parser strictly adheres to the ABNF syntax. It also checks semantics.

Specifically, the parser guarantees the following:

- The `<int-range>` or `<suffix-range>` number is a non-negative integer
- `<range-unit>` and `<other-range>` are syntactically valid strings
- `<int-range>`, `<first-pos>` is equal to or greater than `<last-pos>`.

### Syntax error

Throws `SyntaxError` if it detects invalid syntax.

```ts
import { parse } from "https://deno.land/x/range_parser@$VERSION/mod.ts";
import { assertThrows } from "https://deno.land/std/testing/asserts.ts";

assertThrows(() => parse("<invalid:input>"));
```

### Semantic error

The following cases are semantic error:

- `<int-range>`, `<last-pos>` less than `<first-pos>`.

see
[RFC 9110, 14.1.1. Range Specifiers](https://www.rfc-editor.org/rfc/rfc9110#section-14.1.1-6)

In this case, it throws a `RangeError`.

```ts
import { parse } from "https://deno.land/x/range_parser@$VERSION/mod.ts";
import { assertThrows } from "https://deno.land/std/testing/asserts.ts";

assertThrows(() => parse("bytes=1-0"));
```

## Serialization

Serializes `Range` into string.

```ts
import { stringify } from "https://deno.land/x/range_parser@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

assertEquals(
  stringify({
    rangeUnit: "bytes",
    rangeSet: [{ firstPos: 0, lastPos: 100 }, { suffixLength: 200 }],
  }),
  "bytes=0-100, -200",
);
```

### Throwing error

Throws `TypeError` if `Range` contains errors.

For error definitions, see the [Parsing specification](#parsing-specification).

```ts
import { stringify } from "https://deno.land/x/range_parser@$VERSION/mod.ts";
import { assertThrows } from "https://deno.land/std/testing/asserts.ts";

assertThrows(() =>
  stringify({
    rangeUnit: "bytes",
    rangeSet: [{ firstPos: NaN, lastPos: undefined }],
  })
);
```

## Utility

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

### isRangeFormat

Whether the input is HTTP `Range` header field format or not.

```ts
import { isRangeFormat } from "https://deno.land/x/range_parser@$VERSION/mod.ts";
import { assert } from "https://deno.land/std/testing/asserts.ts";

assert(isRangeFormat("bytes=0-100, 200-, -500"));
assert(!isRangeFormat("<invalid>"));
```

## License

Copyright © 2023-present [httpland](https://github.com/httpland).

Released under the [MIT](./LICENSE) license
