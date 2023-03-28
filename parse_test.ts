import {
  parseRange,
  parseRangeSet,
  parseRangeSpec,
  parseRangesSpecifier,
} from "./parse.ts";
import { Range, RangeSet, RangeSpec, RangesSpecifier } from "./types.ts";
import { assertEquals, assertThrows, describe, it } from "./_dev_deps.ts";

describe("parseRange", () => {
  it("should return parsed <Range>", () => {
    const table: [string, Range][] = [
      ["bytes=0-100, 200-, -300, test", {
        rangeUnit: "bytes",
        rangeSet: [
          { firstPos: 0, lastPos: 100 },
          { firstPos: 200, lastPos: undefined },
          { suffixLength: 300 },
          "test",
        ],
      }],
      ["unknown!=1000-,000-1000,-100,unknown", {
        rangeUnit: "unknown!",
        rangeSet: [
          { firstPos: 1000, lastPos: undefined },
          { firstPos: 0, lastPos: 1000 },
          { suffixLength: 100 },
          "unknown",
        ],
      }],
    ];

    table.forEach(([input, expected]) => {
      assertEquals(parseRange(input), expected);
    });
  });

  it("should throw error", () => {
    const table: string[] = [
      "",
      "a",
      "abc",
      "=",
      "<>=1",
      "unknown=,",
      "xxx=1-0",
    ];

    table.forEach((input) => {
      assertThrows(() => parseRange(input));
    });
  });
});

describe("parseRangesSpecifier", () => {
  it("should return parsed <ranges-specifier>", () => {
    const table: [string, RangesSpecifier][] = [
      ["bytes=0-100", {
        rangeUnit: "bytes",
        rangeSet: [{ firstPos: 0, lastPos: 100 }],
      }],
      ["bytes=0-", {
        rangeUnit: "bytes",
        rangeSet: [{ firstPos: 0, lastPos: undefined }],
      }],
      ["bytes=-100", { rangeUnit: "bytes", rangeSet: [{ suffixLength: 100 }] }],
      ["bytes=0-0,1-1", {
        rangeUnit: "bytes",
        rangeSet: [{ firstPos: 0, lastPos: 0 }, { firstPos: 1, lastPos: 1 }],
      }],
      ["bytes=-100,0-100", {
        rangeUnit: "bytes",
        rangeSet: [{ suffixLength: 100 }, { firstPos: 0, lastPos: 100 }],
      }],
      ["bytes=-100 , 0-100", {
        rangeUnit: "bytes",
        rangeSet: [{ suffixLength: 100 }, { firstPos: 0, lastPos: 100 }],
      }],
      ["bytes=-100 , -200   , 300-400", {
        rangeUnit: "bytes",
        rangeSet: [{ suffixLength: 100 }, { suffixLength: 200 }, {
          firstPos: 300,
          lastPos: 400,
        }],
      }],
      ["unknown!=-1234567890", {
        rangeUnit: "unknown!",
        rangeSet: [{ suffixLength: 1234567890 }],
      }],
      ["unknown=a", {
        rangeUnit: "unknown",
        rangeSet: ["a"],
      }],
      ["a=b", {
        rangeUnit: "a",
        rangeSet: ["b"],
      }],
      ["a=1", {
        rangeUnit: "a",
        rangeSet: ["1"],
      }],
      ["a=1.0", {
        rangeUnit: "a",
        rangeSet: ["1.0"],
      }],
      ["a1=120", {
        rangeUnit: "a1",
        rangeSet: ["120"],
      }],
    ];

    table.forEach(([input, expected]) => {
      assertEquals(parseRangesSpecifier(input), expected);
    });
  });

  it("should throw error if the input is invalid syntax", () => {
    const table: string[] = [
      "",
      "a",
      "abc",
      "=",
      "<>=1",
      " a=120",
      " a=120 ",
      "unknown=,",
    ];

    table.forEach((input) => {
      assertThrows(() => parseRangesSpecifier(input));
    });
  });
});

describe("parseRangeSet", () => {
  it("should return range set", () => {
    const table: [string, RangeSet][] = [
      ["0-100,", [{ firstPos: 0, lastPos: 100 }]],
      ["0-100,,,-200", [{ firstPos: 0, lastPos: 100 }, { suffixLength: 200 }]],
    ];

    table.forEach(([input, expected]) => {
      assertEquals(parseRangeSet(input), expected);
    });
  });

  it("should throw error", () => {
    const table: string[] = [
      "",
      " , ",
      ",",
      ",   ,",
    ];

    table.forEach((input) => {
      assertThrows(() => parseRangeSet(input));
    });
  });
});

describe("parseRangeSpec", () => {
  it("should return parsed <range-spec>", () => {
    const table: [string, RangeSpec][] = [
      ["0-", { firstPos: 0, lastPos: undefined }],
      ["0-0", { firstPos: 0, lastPos: 0 }],
      ["100-100", { firstPos: 100, lastPos: 100 }],

      ["-0", { suffixLength: 0 }],
      ["-100", { suffixLength: 100 }],

      ["a", "a"],
      ["0", "0"],
      ["123", "123"],
      ["<!@#$>", "<!@#$>"],
    ];

    table.forEach(([input, expected]) => {
      assertEquals(parseRangeSpec(input), expected);
    });
  });

  it("should throw error if the input is invalid syntax", () => {
    const table: string[] = [
      "",
      ",",
      "abc,",
    ];

    table.forEach((input) => {
      assertThrows(() => parseRangeSpec(input));
    });
  });

  it("should throw error if the input is invalid semantic", () => {
    const table: string[] = [
      "100-0",
      "1-0",
      "01-00",
      "0000001-0000000000",
    ];

    table.forEach((input) => {
      assertThrows(() => parseRangeSpec(input));
    });
  });
});
