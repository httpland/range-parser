import {
  isIntRange,
  isOtherRange,
  isRangeFormat,
  isRangeUnitFormat,
  isSuffixRange,
  isValidIntRange,
} from "./validate.ts";
import type { IntRange, RangeSpec } from "./types.ts";
import { assert, describe, it } from "./_dev_deps.ts";

describe("isIntRange", () => {
  it("should return true", () => {
    const table: RangeSpec[] = [
      { firstPos: 0, lastPos: undefined },
      { firstPos: 0, lastPos: 0 },
      { firstPos: 0, lastPos: 0, suffixLength: 0 },
      { firstPos: -1, lastPos: -1, suffixLength: -1 },
    ];

    table.forEach((rangeSpec) => {
      assert(isIntRange(rangeSpec));
    });
  });

  it("should return false", () => {
    const table: RangeSpec[] = [
      { suffixLength: 0 },
      { suffixLength: 0, lastPos: 0 },
      "",
      "test",
    ];

    table.forEach((rangeSpec) => {
      assert(!isIntRange(rangeSpec));
    });
  });
});

describe("isSuffixRange", () => {
  it("should return true", () => {
    const table: RangeSpec[] = [
      { firstPos: 0, lastPos: 0, suffixLength: 0 },
      { firstPos: -1, lastPos: -1, suffixLength: -1 },
      { suffixLength: 0 },
      { lastPos: 0, suffixLength: 0 },
    ];

    table.forEach((rangeSpec) => {
      assert(isSuffixRange(rangeSpec));
    });
  });

  it("should return false", () => {
    const table: RangeSpec[] = [
      { firstPos: 0, lastPos: undefined },
      { firstPos: 0, lastPos: 0 },
      "",
      "test",
    ];

    table.forEach((rangeSpec) => {
      assert(!isSuffixRange(rangeSpec));
    });
  });
});

describe("isOtherRange", () => {
  it("should return true", () => {
    const table: RangeSpec[] = ["", "test"];

    table.forEach((rangeSpec) => {
      assert(isOtherRange(rangeSpec));
    });
  });

  it("should return false", () => {
    const table: RangeSpec[] = [
      { firstPos: 0, lastPos: 0, suffixLength: 0 },
      { firstPos: -1, lastPos: -1, suffixLength: -1 },
      { suffixLength: 0 },
      { lastPos: 0, suffixLength: 0 },
    ];

    table.forEach((rangeSpec) => {
      assert(!isOtherRange(rangeSpec));
    });
  });
});

describe("isRangeFormat", () => {
  it("should return true", () => {
    const table: string[] = [
      "bytes=0-1",
      " bytes=0-1 ",
      "a=a",
      "a=0-1, 100-, -200",
    ];

    table.forEach((rangeSpec) => {
      assert(isRangeFormat(rangeSpec));
    });
  });

  it("should return false", () => {
    const table: string[] = [
      "",
      "0-1",
      "<>=<>",
      "-100",
      "0-",
      "a=,",
      "a=,,,",
      "a=,b",
    ];

    table.forEach((rangeSpec) => {
      assert(!isRangeFormat(rangeSpec));
    });
  });
});

describe("isValidIntRange", () => {
  it("should return true", () => {
    const table: IntRange[] = [
      { firstPos: 0, lastPos: undefined },
      { firstPos: 0, lastPos: 0 },
      { firstPos: 0, lastPos: 1 },
      { firstPos: 1.0, lastPos: 1 },
    ];

    table.forEach((intRange) => {
      assert(isValidIntRange(intRange));
    });
  });

  it("should return false", () => {
    const table: IntRange[] = [
      { firstPos: NaN, lastPos: undefined },
      { firstPos: Infinity, lastPos: undefined },
      { firstPos: 0, lastPos: NaN },
      { firstPos: 0, lastPos: -1 },
      { firstPos: 1, lastPos: 0 },
      { firstPos: -1, lastPos: undefined },
      { firstPos: 1.1, lastPos: undefined },
      { firstPos: 0, lastPos: 1.1 },
    ];

    table.forEach((intRange) => {
      assert(!isValidIntRange(intRange));
    });
  });
});

describe("isRangeUnitFormat", () => {
  it("should return true", () => {
    const table: string[] = ["0", "0-1", "-100", "0-", "_", "bytes"];

    table.forEach((rangeSpec) => {
      assert(isRangeUnitFormat(rangeSpec));
    });
  });

  it("should return false", () => {
    const table: string[] = [
      "",
      "<>",
      ",",
      "a=,",
    ];

    table.forEach((rangeSpec) => {
      assert(!isRangeUnitFormat(rangeSpec));
    });
  });
});
