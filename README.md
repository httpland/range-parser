# range-parser

HTTP `Range` header field parser.

Compliant with
[RFC 9110, 14.2 Range](https://www.rfc-editor.org/rfc/rfc9110#section-14.2)

## Parse

Parses a string as HTTP `Range` header field and yield JavaScript Object.

The field naming conventions follow
[RFC 9110, 14.2. Range](https://www.rfc-editor.org/rfc/rfc9110#section-14.2).

```ts
import { parse } from "https://deno.land/x/range_parser@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

const actual = parse("bytes=0-100, 200-, -300");

assertEquals(actual, {
  rangeUnit: "bytes",
  rangeSet: [
    { firstPos: 0, lastPos: 100 },
    { firstPos: 200, lastPos: undefined },
    { suffixLength: 300 },
  ],
});
```

### Throwing error

Throws `SyntaxError` if it detects invalid syntax.

```ts
import { parse } from "https://deno.land/x/range_parser@$VERSION/mod.ts";
import { assertThrows } from "https://deno.land/std/testing/asserts.ts";

assertThrows(() => parse("<invalid:input>"));
```

## License

Copyright © 2023-present [httpland](https://github.com/httpland).

Released under the [MIT](./LICENSE) license
