import {
  stringifyIntRange,
  stringifyOtherRange,
  stringifyRange,
  stringifyRangeSet,
  stringifyRangeSpec,
  stringifySuffixRange,
} from "./stringify.ts";
import type {
  IntRange,
  OtherRange,
  Range,
  RangeSet,
  RangeSpec,
  SuffixRange,
} from "./types.ts";
import { assertEquals, assertThrows, describe, it } from "./_dev_deps.ts";

describe("stringifyRange", () => {
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
      assertEquals(stringifyRange(range), expected);
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
      assertThrows(() => stringifyRange(range));
    });
  });
});

describe("stringifyIntRange", () => {
  it("should return string if the input is valid", () => {
    const table: [IntRange, string][] = [
      [
        { firstPos: 0, lastPos: undefined },
        "0-",
      ],
      [
        { firstPos: 0, lastPos: 1 },
        "0-1",
      ],
      [
        { firstPos: 100, lastPos: 1000 },
        "100-1000",
      ],
    ];

    table.forEach(([range, expected]) => {
      assertEquals(stringifyIntRange(range), expected);
    });
  });

  it("should throw error if the input is invalid", () => {
    const table: IntRange[] = [
      { firstPos: NaN, lastPos: undefined },
      { firstPos: 1.1, lastPos: undefined },
      { firstPos: 1, lastPos: 0 },
      { firstPos: 1, lastPos: NaN },
    ];

    table.forEach((range) => {
      assertThrows(() => stringifyIntRange(range));
    });
  });
});

describe("stringifyOtherRange", () => {
  it("should return string if the input is valid", () => {
    const table: [OtherRange, string][] = [
      ["other", "other"],
      ["abc", "abc"],
    ];

    table.forEach(([range, expected]) => {
      assertEquals(stringifyOtherRange(range), expected);
    });
  });

  it("should throw error if the input is invalid", () => {
    const table: OtherRange[] = [
      "",
      " a ",
      ",",
    ];

    table.forEach((range) => {
      assertThrows(() => stringifyOtherRange(range));
    });
  });
});

describe("stringifySuffixRange", () => {
  it("should return string if the input is valid", () => {
    const table: [SuffixRange, string][] = [
      [{ suffixLength: 0 }, "-0"],
      [{ suffixLength: 100 }, "-100"],
    ];

    table.forEach(([range, expected]) => {
      assertEquals(stringifySuffixRange(range), expected);
    });
  });

  it("should throw error if the input is invalid", () => {
    const table: SuffixRange[] = [
      { suffixLength: NaN },
      { suffixLength: -1 },
      { suffixLength: 1.1 },
    ];

    table.forEach((range) => {
      assertThrows(() => stringifySuffixRange(range));
    });
  });
});

describe("stringifyRangeSpec", () => {
  it("should return string if the input is valid", () => {
    const table: [RangeSpec, string][] = [
      [{ suffixLength: 0 }, "-0"],
      [{ suffixLength: 100 }, "-100"],
      [{ firstPos: 0, lastPos: undefined }, "0-"],
      ["other", "other"],
    ];

    table.forEach(([range, expected]) => {
      assertEquals(stringifyRangeSpec(range), expected);
    });
  });

  it("should throw error if the input is invalid", () => {
    const table: RangeSpec[] = [
      { suffixLength: NaN },
      { suffixLength: -1 },
      { suffixLength: 1.1 },
      { firstPos: NaN, lastPos: undefined },
    ];

    table.forEach((range) => {
      assertThrows(() => stringifyRangeSpec(range));
    });
  });
});

describe("stringifyRangeSet", () => {
  it("should return string if the input is valid", () => {
    const table: [RangeSet, string][] = [
      [[{ suffixLength: 0 }], "-0"],
      [[{ suffixLength: 0 }, { firstPos: 0, lastPos: undefined }], "-0, 0-"],
      [[{ suffixLength: 0 }, { firstPos: 0, lastPos: 100 }], "-0, 0-100"],
      [
        [{ suffixLength: 0 }, { firstPos: 0, lastPos: 100 }, "other"],
        "-0, 0-100, other",
      ],
    ];

    table.forEach(([range, expected]) => {
      assertEquals(stringifyRangeSet(range), expected);
    });
  });

  it("should throw error if the input is invalid", () => {
    const table: RangeSet[] = [
      [{ suffixLength: NaN }],
      [{ suffixLength: -1 }],
      [{ suffixLength: 1.1 }],
      [{ firstPos: NaN, lastPos: undefined }],
    ];

    table.forEach((range) => {
      assertThrows(() => stringifyRangeSet(range));
    });
  });
});
