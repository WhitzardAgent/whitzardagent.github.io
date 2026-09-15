import { build } from "esbuild";

export async function loadTerminology() {
  const result = await build({
    entryPoints: ["src/data/terminology.ts"],
    bundle: true,
    format: "esm",
    platform: "node",
    write: false,
  });
  const source = result.outputFiles[0]?.text;
  if (!source) throw new Error("Unable to bundle src/data/terminology.ts");
  const url = `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`;
  return import(url);
}
