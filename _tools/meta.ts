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
});
