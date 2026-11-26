import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Worst Pizza Topping remake entry: a single menu-pitch line, under 200
// characters, selling a tray table as a topping. The program writes the
// line to the output directory and refuses to succeed unless every gate
// rule below holds for the bytes that landed on disk.
const PITCH =
  "Try our Airplane Tray Table Pizza: one tray licked by 400 strangers, folded into the cheese, so every bite tastes like a red-eye to Cleveland with the seatbelt sign on.";

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "out";
mkdirSync(outputDir, { recursive: true });

const target = join(outputDir, "entry.txt");
writeFileSync(target, PITCH, "utf8");

// Read the file back: the gate judges what was saved, not what was meant.
const saved = readFileSync(target, "utf8");

const problems: string[] = [];
if (saved !== PITCH) problems.push("saved bytes differ from the pitch");
if (saved.length === 0 || saved.length >= 200) problems.push("length outside 1-199");
if (/[\r\n]/.test(saved)) problems.push("not a single line");
if (saved.trim() !== saved) problems.push("edge whitespace present");
if (saved.includes("  ")) problems.push("double space present");
if (!/^[\x20-\x7e]+$/.test(saved)) problems.push("non-ASCII byte present");
if (!saved.toLowerCase().includes("tray table")) problems.push("topping cue missing");
if (!saved.toLowerCase().includes("pizza")) problems.push("pizza cue missing");
if (!saved.endsWith(".")) problems.push("pitch must end with a full stop");

if (problems.length > 0) {
  throw new Error(`entry gate failed: ${problems.join("; ")}`);
}

console.log(saved);
console.log(`chars:${saved.length}`);
