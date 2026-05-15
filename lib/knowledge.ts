import fs from "node:fs";
import path from "node:path";

const KNOWLEDGE_PATH = path.join(process.cwd(), "knowledge.md");

export const KNOWLEDGE_BASE: string = fs.readFileSync(KNOWLEDGE_PATH, "utf-8");
