import { BuildOptions } from "https://deno.land/x/dnt@0.33.1/mod.ts";

export const makeOptions = (version: string): BuildOptions => ({
  test: false,
  shims: {},
  typeCheck: true,
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  package: {
    name: "@httpland/range-parser",
    version,
    description: "HTTP Range header field parser",
    keywords: [
      "http",
      "parse",
      "parser",
      "header",
      "range",
      "stringify",
      "field",
      "ranges-specifier",
    ],
    license: "MIT",
    homepage: "https://github.com/httpland/range-parser",
    repository: {
      type: "git",
      url: "git+https://github.com/httpland/range-parser.git",
    },
    bugs: {
      url: "https://github.com/httpland/range-parser/issues",
    },
    sideEffects: false,
    type: "module",
    publishConfig: {
      access: "public",
    },
  },
  packageManager: "pnpm",
  mappings: {
    "https://deno.land/x/isx@1.1.1/is_string.ts": {
      name: "@miyauci/isx",
      version: "1.1.1",
      subPath: "is_string",
    },
    "https://deno.land/x/isx@1.1.1/is_number.ts": {
      name: "@miyauci/isx",
      version: "1.1.1",
      subPath: "is_number",
    },
    "https://deno.land/x/isx@1.1.1/is_undefined.ts": {
      name: "@miyauci/isx",
      version: "1.1.1",
      subPath: "is_undefined",
    },
    "https://deno.land/x/isx@1.1.1/number/is_non_negative_integer.ts": {
      name: "@miyauci/isx",
      version: "1.1.1",
      subPath: "number/is_non_negative_integer",
    },
    "https://deno.land/x/isx@1.1.1/iterable/is_not_empty.ts": {
      name: "@miyauci/isx",
      version: "1.1.1",
      subPath: "iterable/is_not_empty",
    },
  },
});
