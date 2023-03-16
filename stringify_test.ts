import { stringify } from "./stringify.ts";
import { type Range } from "./types.ts";
import { assertEquals, assertThrows, describe, it } from "./_dev_deps.ts";

describe("stringify", () => {
  it("should return string if the input is valid", () => {
    const table: [Range, string][] = [
      [
        { rangeSet: [{ firstPos: 0, lastPos: undefined }], rangeUnit: "bytes" },
        "bytes=0-",
      ],
      [
        { rangeSet: [{ firstPos: 0, lastPos: 1 }], rangeUnit: "bytes" },
        "bytes=0-1",
      ],
      [
        {
          rangeSet: [{ firstPos: 0, lastPos: 1 }, { suffixLength: 5 }],
          rangeUnit: "bytes",
        },
        "bytes=0-1, -5",
      ],
      [
        {
          rangeSet: [{ firstPos: 0, lastPos: 1 }, { suffixLength: 5 }, "other"],
          rangeUnit: "bytes",
        },
        "bytes=0-1, -5, other",
      ],
    ];

    table.forEach(([range, expected]) => {
      assertEquals(stringify(range), expected);
    });
  });

  it("should throw error if the input is invalid", () => {
    const table: Range[] = [
      { rangeSet: [{ firstPos: 0, lastPos: undefined }], rangeUnit: "" },
      { rangeSet: [{ firstPos: 1, lastPos: 0 }], rangeUnit: "bytes" },
      { rangeSet: [{ firstPos: NaN, lastPos: undefined }], rangeUnit: "bytes" },
      { rangeSet: [{ suffixLength: NaN }], rangeUnit: "bytes" },
      { rangeSet: [{ suffixLength: 1.1 }], rangeUnit: "bytes" },
      { rangeSet: [""], rangeUnit: "bytes" },
    ];

    table.forEach((range) => {
      assertThrows(() => stringify(range));
    });
  });
});
