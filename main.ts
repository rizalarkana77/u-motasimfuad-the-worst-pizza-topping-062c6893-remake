import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

function entryLine(): string {
  return "Try our Airplane Tray Table Pizza: one tray licked by 400 strangers, folded into the cheese, so every bite tastes like a red-eye to Cleveland with the seatbelt sign on.";
}

function validate(line: string): void {
  if (line.length === 0) {
    throw new Error("entry line must not be empty");
  }
  if (line.length >= 200) {
    throw new Error(`entry line must be under 200 characters, got ${line.length}`);
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry line must be a single line");
  }
  if (line !== line.trim()) {
    throw new Error("entry line must not have leading or trailing whitespace");
  }
  if (Buffer.byteLength(line, "utf8") !== line.length) {
    throw new Error("entry line must be plain ASCII for byte-stable output");
  }
  if (line.includes("  ")) {
    throw new Error("entry line must not contain double spaces");
  }
}

function main(): void {
  const line = entryLine();
  validate(line);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR || "out";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, line, "utf8");
  const written = readFileSync(outPath, "utf8");
  if (written !== line) {
    throw new Error("read-back verification failed");
  }
  const sha256 = createHash("sha256").update(written, "utf8").digest("hex");
  console.log(line);
  console.log(`sha256:${sha256}`);
}

main();
